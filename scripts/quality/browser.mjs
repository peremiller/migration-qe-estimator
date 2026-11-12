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
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.ok(overflow <= 3, "horizontal overflow at " + width + "px: " + overflow);
      assert.deepEqual(pageErrors, [], "unexpected page errors");
      passed++;
      await page.close();
    }
  }
  console.log("Chromium keyboard, modal, hash/history/refresh, invalid import and data preservation passed in", passed, "viewport/theme combinations");
} finally {
  await browser.close();
}
