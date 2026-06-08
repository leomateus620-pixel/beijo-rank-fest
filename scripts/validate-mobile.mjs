import { chromium } from "playwright";

const routes = ["/", "/explorar", "/ranking", "/perfil", "/eventos"];
const sizes = [
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 360, height: 780 },
];
const browser = await chromium.launch();
const page = await browser.newPage();
const failures = [];
for (const size of sizes) {
  await page.setViewportSize(size);
  for (const route of routes) {
    await page.goto(`http://localhost:8080${route}`, { waitUntil: "networkidle" });
    const result = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth,
      path: location.pathname,
    }));
    const overflow = Math.max(result.scrollWidth, result.bodyScrollWidth) - result.innerWidth;
    console.log(`${size.width}x${size.height} ${route}: overflow=${overflow}`);
    if (overflow > 2) failures.push({ size, route, ...result, overflow });
  }
}
await browser.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
