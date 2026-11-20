import test from "node:test";
import assert from "node:assert/strict";
import { isValidBackupData, loadStoredValue, persistStoredValue } from "../../src/backup-validation.mjs";

const example = {
  programTitle: "Migration QA", contingency: 15, hoursPerDay: 8,
  team: ["Tester One"],
  apps: [{ id: "crm", target: "CRM", source: "Legacy", testerEstimates: { "Tester One": 8 }, startDate: "2026-08-03" }],
  entries: [{ id: "entry-1", appId: "crm", activity: "Test Execution", tester: "Tester One", hours: 3.5, date: "2026-08-04", note: "Verified" }],
};

test("accepts the existing complete exported workspace format", () => assert.equal(isValidBackupData(example), true));
test("accepts an older partial backup without deleting unspecified fields", () => assert.equal(isValidBackupData({team: ["Tester One"]}), true));
test("rejects empty, unrelated, and non-object backups", () => {
  for (const value of [null, false, [], "text", {}, {random: 1}]) assert.equal(isValidBackupData(value), false);
});
test("rejects corrupt arrays before any state setter runs", () => {
  for (const value of [{...example, apps: {}}, {...example, entries: [null]}, {...example, team: ["ok", 123]}, {...example, entries: [{...example.entries[0], date:"not-a-date"}]}]) {
    assert.equal(isValidBackupData(value), false);
  }
});
test("rejects malformed app metadata and non-finite time settings", () => {
  for (const value of [
    {...example, apps: [{id:"x", target: 10}]},
    {...example, apps: [{...example.apps[0], testerEstimates: {x: "bad"}}]},
    {...example, contingency: Infinity},
    {...example, hoursPerDay: 0},
  ]) assert.equal(isValidBackupData(value), false);
});

test("loading a corrupted stored record preserves the original bytes and disables overwrites", () => {
  const records = new Map([["migrateqa-apps", "{broken-json"]]);
  const storage = { getItem: (key) => records.get(key) ?? null, setItem: (key, value) => records.set(key, value) };
  const result = loadStoredValue(() => storage, "migrateqa-apps", [{ id: "sample" }]);
  assert.deepEqual(result, { value: [{ id: "sample" }], writable: false, error: "unreadable" });
  assert.equal(records.get("migrateqa-apps"), "{broken-json");
});
test("valid saved arrays and primitive values remain intact", () => {
  const records = new Map([["migrateqa-team", '["Existing Tester"]'], ["migrateqa-hours-day", "6"]]);
  const storage = { getItem: (key) => records.get(key) ?? null, setItem: (key, value) => records.set(key, value) };
  assert.deepEqual(loadStoredValue(() => storage, "migrateqa-team", []), {value: ["Existing Tester"], writable: true, error: null});
  assert.equal(loadStoredValue(() => storage, "migrateqa-hours-day", 8).value, 6);
  assert.equal(persistStoredValue(() => storage, "migrateqa-team", ["Existing Tester", "New Tester"]), true);
  assert.deepEqual(JSON.parse(records.get("migrateqa-team")), ["Existing Tester", "New Tester"]);
});
test("denied browser storage reads or writes never crash or report success", () => {
  const denied = () => { throw new Error("SecurityError"); };
  const result = loadStoredValue(denied, "migrateqa-apps", []);
  assert.deepEqual(result, {value: [], writable: false, error: "unreadable"});
  assert.equal(persistStoredValue(denied, "migrateqa-apps", []), false);
  const writeDenied = { getItem: () => null, setItem: () => { throw new Error("QuotaExceededError"); } };
  assert.equal(loadStoredValue(() => writeDenied, "key", []).writable, true);
  assert.equal(persistStoredValue(() => writeDenied, "key", []), false);
});
test("valid JSON with incompatible stored shapes is not replaced with defaults", () => {
  for (const [raw, fallback] of [["null", []], ["{}", []], ['"invalid"', 8], ["null", "title"]]) {
    const record = { getItem: () => raw };
    assert.equal(loadStoredValue(() => record, "key", fallback).writable, false);
  }
});
