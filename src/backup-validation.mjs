// Keep backup validation independent of React so malformed imports cannot overwrite
// a previously saved browser workspace. Unknown fields are ignored for older backups.
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const finiteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const validDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(new Date(value + "T12:00:00").getTime());

export function isValidBackupData(data) {
  if (!isObject(data)) return false;
  const fields = ["apps", "entries", "team", "programTitle", "contingency", "hoursPerDay"];
  if (!fields.some((field) => Object.prototype.hasOwnProperty.call(data, field))) return false;
  if ("apps" in data && (!Array.isArray(data.apps) || !data.apps.every((app) =>
    isObject(app) && typeof app.id === "string" && typeof app.target === "string"
    && (!("source" in app) || typeof app.source === "string")
    && (!("testerEstimates" in app) || (isObject(app.testerEstimates) &&
      Object.values(app.testerEstimates).every(finiteNumber)))
    && (!("startDate" in app) || !app.startDate || validDate(app.startDate))
    && (!("endDate" in app) || !app.endDate || validDate(app.endDate))))) return false;
  if ("entries" in data && (!Array.isArray(data.entries) || !data.entries.every((entry) =>
    isObject(entry) && typeof entry.id === "string" && typeof entry.appId === "string"
    && typeof entry.activity === "string" && typeof entry.tester === "string"
    && validDate(entry.date) && finiteNumber(entry.hours)
    && (!("note" in entry) || typeof entry.note === "string")))) return false;
  if ("team" in data && (!Array.isArray(data.team) || !data.team.every((person) => typeof person === "string"))) return false;
  if ("programTitle" in data && typeof data.programTitle !== "string") return false;
  if ("contingency" in data && !finiteNumber(data.contingency)) return false;
  if ("hoursPerDay" in data && (!finiteNumber(data.hoursPerDay) || data.hoursPerDay <= 0)) return false;
  return true;
}

/**
 * Browser persistence must fail closed: unreadable original values stay
 * untouched. The UI may continue in memory so users can export visible data.
 */
export function loadStoredValue(storageProvider, key, fallback) {
  try {
    const raw = storageProvider().getItem(key);
    if (raw === null) return { value: fallback, writable: true, error: null };
    const value = JSON.parse(raw);
    if ((Array.isArray(fallback) && !Array.isArray(value)) ||
        (typeof fallback === "number" && (typeof value !== "number" || !Number.isFinite(value))) ||
        (typeof fallback === "string" && typeof value !== "string")) {
      throw new TypeError("Unexpected stored value shape");
    }
    return { value, writable: true, error: null };
  } catch {
    return { value: fallback, writable: false, error: "unreadable" };
  }
}

export function persistStoredValue(storageProvider, key, value) {
  try {
    storageProvider().setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
