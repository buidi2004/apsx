/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("/home/buidi/Tài liệu/apsx/ai-website-cloner-template/.agents/skills/playwright-skill/node_modules/playwright");

async function run() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/microsoft-edge-stable",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to http://localhost:3000 to verify mutated PromoBar...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const promoText = await page.locator(".rog-promo").textContent();
  console.log("-> Live PromoBar text in DOM:", promoText.trim());

  console.log("Navigating to http://localhost:3000/vn/store to verify mutated SCAR 18 price...");
  await page.goto("http://localhost:3000/vn/store", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const scarCard = page.locator("div:has(h3:has-text('SCAR 18'))").first();
  const cardText = await scarCard.textContent();
  console.log("-> SCAR 18 card contains mutated price 119.990.000 ₫:", cardText.includes("119.990.000"));

  const ssPath = "/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/verify-live-mutation-reflected-fe.png";
  await page.screenshot({ path: ssPath, fullPage: false });
  console.log("Screenshot saved:", ssPath);

  await browser.close();
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
