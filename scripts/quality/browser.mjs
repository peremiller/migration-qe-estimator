import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:5173/";
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
let passed = 0;
try {
  for (const width of [320, 390, 1280]) {
    for (const colorScheme of ["light", "dark"]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme });
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await page.goto(base + "#settings", { waitUntil: "networkidle" });
      await page.waitForFunction(() => document.title.startsWith("Settings"));
      assert.equal(await page.locator('main#workspace-main').count(), 1, "main landmark");
      assert.equal(await page.locator(".skip-link").count(), 1, "skip navigation");
      assert.equal(await page.locator('nav[aria-label="Primary navigation"]').count(), 1);
      await page.evaluate(() => localStorage.setItem("primeqe-preservation-sentinel", "must-remain"));
      await page.locator('input[type="file"]').setInputFiles({
        name: "invalid-backup.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify({ apps: "unsafe-shape" })),
      });
      await page.getByRole("status").filter({ hasText: "existing workspace data was preserved" }).waitFor({ state: "visible" });
      assert.equal(await page.evaluate(() => localStorage.getItem("primeqe-preservation-sentinel")), "must-remain");
      const opener = page.locator('header.topbar button[aria-label="Log time"]:visible, header.topbar button:visible').filter({ hasText: /Log time|^$/ }).last();
      const actualOpener = page.locator('header.topbar button:visible').first();
      await actualOpener.click();
      const dialog = page.getByRole("dialog", { name: "Log time" });
      await dialog.waitFor({ state: "visible" });
      assert.equal(await dialog.getAttribute("aria-modal"), "true");
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "detached" });
      assert.equal(await actualOpener.evaluate((element) => document.activeElement === element), true, "focus restored to trigger");
      const nav = page.locator('.mobile-nav button:visible, .side-nav button:visible').filter({ hasText: "Dashboard" }).first();
      await nav.click();
      await page.waitForFunction(() => document.title.startsWith("Dashboard"));
      await page.goBack({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => document.title.startsWith("Settings"));
      await page.reload();
      await page.waitForFunction(() => document.title.startsWith("Settings"));
      assert.equal(await page.evaluate(() => localStorage.getItem("primeqe-preservation-sentinel")), "must-remain");
      const timeNav = page.locator('.mobile-nav button:visible, .side-nav button:visible').filter({ hasText: "Time Log" }).first();
      await timeNav.click();
      await page.waitForFunction(() => document.title.startsWith("Time Log"));
      const search = page.getByRole("textbox", { name: "Search time log notes and testers" });
      const byApplication = page.getByRole("combobox", { name: "Filter time logs by application" });
      const byActivity = page.getByRole("combobox", { name: "Filter time logs by activity" });
      const byTester = page.getByRole("combobox", { name: "Filter time logs by tester" });
      assert.equal(await search.count(), 1, "time log search has an accessible name");
      assert.equal(await byApplication.count(), 1, "application filter has its own accessible name");
      assert.equal(await byActivity.count(), 1, "activity filter has its own accessible name");
      assert.equal(await byTester.count(), 1, "tester filter has its own accessible name");
      await byApplication.selectOption({ index: 1 });
      assert.equal(await byActivity.inputValue(), "all", "changing application preserves activity filter");
      assert.equal(await byTester.inputValue(), "all", "changing application preserves tester filter");
      await byApplication.selectOption("all");
      await byApplication.focus();
      await page.keyboard.press("Tab");
      assert.equal(await byActivity.evaluate((element) => element === document.activeElement), true, "filter keyboard order remains predictable");
      assert.equal(await page.evaluate(() => localStorage.getItem("primeqe-preservation-sentinel")), "must-remain", "filter interactions preserve stored data");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.ok(overflow <= 3, "horizontal overflow at " + width + "px: " + overflow);
      assert.deepEqual(pageErrors, [], "unexpected page errors");
      passed++;
      await page.close();
    }
  }
  // Open real UI with a corrupt pre-existing record. It must remain untouched.
  const corrupt = await browser.newPage({ viewport: { width: 390, height: 900 }, colorScheme: "dark" });
  const corruptErrors = [];
  corrupt.on("pageerror", error => corruptErrors.push(error.message));
  await corrupt.addInitScript(() => window.localStorage.setItem("migrateqa-apps", "{corrupt-original"));
  await corrupt.goto(base + "#settings", { waitUntil: "networkidle" });
  await corrupt.getByRole("alert").filter({ hasText: "Browser storage warning" }).waitFor({ state: "visible" });
  assert.equal(await corrupt.evaluate(() => localStorage.getItem("migrateqa-apps")), "{corrupt-original", "unreadable original must survive boot");
  assert.deepEqual(corruptErrors, [], "corrupt record should not crash application");
  await corrupt.close();
    console.log("Chromium keyboard, modal, hash/history/refresh, invalid import and data preservation passed in", passed, "viewport/theme combinations");
} finally {
  await browser.close();
}
