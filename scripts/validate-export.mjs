import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  acceptDownloads: true,
  ignoreHTTPSErrors: true,
});
await page.goto("http://localhost:8080/perfil", { waitUntil: "networkidle" });
const button = page.getByRole("button", { name: /Baixar PNG/i }).first();
await button.scrollIntoViewIfNeeded();
const downloadPromise = page.waitForEvent("download", { timeout: 60000 });
await button.click();
const download = await downloadPromise;
const path = "artifacts/screenshots/export-beijocheck-ranking.png";
await mkdir("artifacts/screenshots", { recursive: true });
await download.saveAs(path);
console.log(`downloaded=${download.suggestedFilename()} saved=${path}`);
await browser.close();
