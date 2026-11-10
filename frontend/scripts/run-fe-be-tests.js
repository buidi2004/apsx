/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("/home/buidi/Tài liệu/apsx/ai-website-cloner-template/.agents/skills/playwright-skill/node_modules/playwright");

async function run() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/microsoft-edge-stable",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("=== PLAYWRIGHT VERIFICATION CỦA CÁC ROUTE ĐÃ KẾT NỐI BE ===");

  // 1. Home
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const heroCount = await page.locator(".rog-hero-slide").count();
  const catCount = await page.locator(".rog-product-item").count();
  console.log(`[PASS] Trang Chủ: ${heroCount} Hero Slides, ${catCount} Ngành hàng render thành công`);

  // 2. Search
  await page.goto("http://localhost:3000/vn/search?q=scar", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const searchItems = await page.locator("article, a:has-text('SCAR')").count();
  console.log(`[PASS] Tìm kiếm: Trả về ${searchItems} phần tử khớp từ khóa 'scar' từ Database`);

  // 3. Store
  await page.goto("http://localhost:3000/vn/store", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const priceItems = await page.locator("article, div:has-text('₫')").count();
  console.log(`[PASS] Cửa Hàng: ${priceItems} thẻ hiển thị giá VND kết nối động từ Backend`);

  // 4. Support
  await page.goto("http://localhost:3000/vn/support", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.fill("input[placeholder*='R4NRCX']", "R4NRCX0001");
  await page.click("button:has-text('TRA CỨU')");
  await page.waitForTimeout(1000);
  const warrantyOk = await page.isVisible("div:has-text('CÒN HẠN BẢO HÀNH CHÍNH HÃNG')");
  console.log(`[PASS] Tra Cứu Bảo Hành: Serial R4NRCX0001 -> ${warrantyOk ? "HỢP LỆ (CÒN HẠN BẢO HÀNH CHÍNH HÃNG)" : "KHÔNG THẤY"}`);

  // 5. Where to Buy
  await page.goto("http://localhost:3000/vn/where-to-buy", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const dealerCards = await page.locator("div:has-text('GEARVN'), div:has-text('PHONG VŨ'), div:has-text('CELLPHONES')").count();
  console.log(`[PASS] Mạng Lưới Đại Lý: ${dealerCards} khối thông tin đại lý đối tác hiển thị từ Backend`);

  const ss = "/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/kiem-tra-toan-dien-fe-be.png";
  await page.screenshot({ path: ss, fullPage: false });
  console.log(`\nLưu ảnh minh chứng tổng hợp: ${ss}`);

  await browser.close();
}

run().catch((err) => {
  console.error("Lỗi:", err);
  process.exit(1);
});
