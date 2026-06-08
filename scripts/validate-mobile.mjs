import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:8080";
const routes = ["/", "/explorar", "/curtidas", "/chat", "/perfil", "/ranking", "/eventos"];
const sizes = [
  { width: 360, height: 780 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];
const screenshotMap = new Map([
  ["390x844/", "swipe-390x844.png"],
  ["390x844/explorar", "explorar-390x844.png"],
  ["390x844/curtidas", "curtidas-390x844.png"],
  ["390x844/chat", "chat-390x844.png"],
  ["390x844/perfil", "perfil-390x844.png"],
  ["390x844/ranking", "ranking-390x844.png"],
]);

await mkdir("artifacts/screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
const failures = [];

for (const size of sizes) {
  await page.setViewportSize(size);
  for (const route of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    if (route === "/") {
      await page
        .getByRole("button", { name: /Próxima foto/i })
        .first()
        .click();
    }
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
          visible:
            rect.right > 0 &&
            rect.left < window.innerWidth &&
            rect.bottom > 0 &&
            rect.top < window.innerHeight,
        };
      });
      const nav = document.querySelector('nav[aria-label="Navegação principal"]');
      const navRect = nav?.getBoundingClientRect();
      const actionButtons = [...document.querySelectorAll("button,a")].filter((node) => {
        const text = node.textContent || node.getAttribute("aria-label") || "";
        return /Interessar|Pular|Compartilhar|Entrar|Confirmar|Editar perfil|Abrir|Ver curtidas/.test(
          text,
        );
      });
      const coveredActions = actionButtons.filter((node) => {
        if (!navRect) return false;
        const rect = node.getBoundingClientRect();
        return (
          rect.bottom > navRect.top &&
          rect.top < navRect.bottom &&
          rect.top < window.innerHeight &&
          rect.bottom > 0
        );
      });
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        bodyScrollWidth: document.body.scrollWidth,
        dialogsOpen: dialogs.length,
        exportCardsVisible: exportCards.filter((card) => card.visible).length,
        navInsideViewport: navRect
          ? navRect.bottom <= window.innerHeight + 1 &&
            navRect.left >= -1 &&
            navRect.right <= window.innerWidth + 1
          : true,
        coveredActions: coveredActions.length,
        hasBottomNav: Boolean(nav),
        hasVisibleCta: actionButtons.some((node) => {
          const rect = node.getBoundingClientRect();
          return (
            rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
          );
        }),
      };
    });
    const overflow = Math.max(result.scrollWidth, result.bodyScrollWidth) - result.innerWidth;
    console.log(
      `${size.width}x${size.height} ${route}: overflow=${overflow} dialogs=${result.dialogsOpen} exportVisible=${result.exportCardsVisible} covered=${result.coveredActions}`,
    );
    if (
      overflow > 2 ||
      result.dialogsOpen > 0 ||
      result.exportCardsVisible > 0 ||
      !result.navInsideViewport ||
      !result.hasBottomNav
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
await page.goto(`${baseUrl}/perfil`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Editar perfil/i }).click();
await page.getByRole("dialog", { name: /Editar info/i }).waitFor();
await page.screenshot({ path: "artifacts/screenshots/editar-perfil-390x844.png", fullPage: true });
await page.goto(`${baseUrl}/perfil`, { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: /^Compartilhar$/i })
  .first()
  .click();
await page.getByRole("dialog", { name: /Compartilhar ranking BeijoCheck/i }).waitFor();
await page.screenshot({
  path: "artifacts/screenshots/share-bottom-sheet-390x844.png",
  fullPage: true,
});

await browser.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
