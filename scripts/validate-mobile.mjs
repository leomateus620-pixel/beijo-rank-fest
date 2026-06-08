import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:8080";
const routes = ["/", "/ranking", "/explorar", "/perfil", "/eventos"];
const sizes = [
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 360, height: 780 },
];
const screenshotMap = new Map([
  ["390x844/", "home-390x844.png"],
  ["390x844/ranking", "ranking-390x844.png"],
  ["390x844/explorar", "explorar-390x844.png"],
]);

await mkdir("artifacts/screenshots", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
const failures = [];

for (const size of sizes) {
  await page.setViewportSize(size);
  for (const route of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const result = await page.evaluate(() => {
      const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter((node) => {
        const style = window.getComputedStyle(node);
        return style.display !== "none" && style.visibility !== "hidden";
      });
      const exportCards = [
        ...document.querySelectorAll('[data-export-card="beijocheck-ranking"]'),
      ].map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          visible:
            rect.right > 0 &&
            rect.left < window.innerWidth &&
            rect.bottom > 0 &&
            rect.top < window.innerHeight,
        };
      });
      const nav = document.querySelector('nav[aria-label="Navegação principal"]');
      const navRect = nav?.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        bodyScrollWidth: document.body.scrollWidth,
        path: location.pathname,
        dialogsOpen: dialogs.length,
        exportCardsVisible: exportCards.filter((card) => card.visible).length,
        navInsideViewport: navRect
          ? navRect.bottom <= window.innerHeight + 1 &&
            navRect.left >= -1 &&
            navRect.right <= window.innerWidth + 1
          : true,
      };
    });
    const overflow = Math.max(result.scrollWidth, result.bodyScrollWidth) - result.innerWidth;
    console.log(
      `${size.width}x${size.height} ${route}: overflow=${overflow} dialogs=${result.dialogsOpen} exportVisible=${result.exportCardsVisible}`,
    );
    if (
      overflow > 2 ||
      result.dialogsOpen > 0 ||
      result.exportCardsVisible > 0 ||
      !result.navInsideViewport
    ) {
      failures.push({ size, route, ...result, overflow });
    }
    const key = `${size.width}x${size.height}${route}`;
    if (screenshotMap.has(key)) {
      await page.screenshot({
        path: `artifacts/screenshots/${screenshotMap.get(key)}`,
        fullPage: true,
      });
    }
  }
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${baseUrl}/ranking`, { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: /Compartilhar ranking/i })
  .first()
  .click();
await page.getByRole("dialog", { name: /Compartilhar ranking BeijoCheck/i }).waitFor();
await page.screenshot({
  path: "artifacts/screenshots/ranking-share-modal-390x844.png",
  fullPage: true,
});
await page.keyboard.press("Escape");
await page
  .getByRole("dialog", { name: /Compartilhar ranking BeijoCheck/i })
  .waitFor({ state: "detached" });

await page.goto(`${baseUrl}/perfil`, { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: /^Compartilhar$/i })
  .first()
  .click();
await page.getByRole("dialog", { name: /Compartilhar ranking BeijoCheck/i }).waitFor();
await page.screenshot({
  path: "artifacts/screenshots/perfil-share-modal-390x844.png",
  fullPage: true,
});

await browser.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
