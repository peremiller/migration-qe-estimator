import test from "node:test";
import assert from "node:assert/strict";
import { isValidBackupData } from "../../src/backup-validation.mjs";

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
