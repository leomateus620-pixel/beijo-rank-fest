import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:8080";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  acceptDownloads: true,
});
await page.goto(`${baseUrl}/perfil`, { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: /^Compartilhar$/i })
  .first()
  .click();
await page.getByRole("dialog", { name: /Compartilhar ranking BeijoCheck/i }).waitFor();
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
