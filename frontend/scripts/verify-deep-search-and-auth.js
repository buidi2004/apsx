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

  console.log("=== KIỂM THỬ KẾT NỐI CHUYÊN SÂU: SEARCH ENGINE & VIP AUTH ===");

  // 1. Test Search Page with live BE queries
  console.log("\n1. Điều hướng đến /vn/search...");
  await page.goto("http://localhost:3000/vn/search", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  console.log("-> Nhập từ khóa tìm kiếm: 'zephyrus'...");
  await page.fill("input[placeholder*='Nhập tên laptop']", "zephyrus");
  await page.waitForTimeout(1500);

  const searchResultsCount = await page.locator("article, a:has-text('Zephyrus')").count();
  console.log(`-> Kết quả tìm kiếm thực tế từ Backend: ${searchResultsCount} mục`);

  const ssSearch = "/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/verify-be-fe-live-search.png";
  await page.screenshot({ path: ssSearch, fullPage: false });
  console.log(`-> Lưu ảnh kết quả tìm kiếm: ${ssSearch}`);

  // 2. Test VIP Member & Admin Login Modal on Navbar
  console.log("\n2. Kiểm thử Modal đăng nhập VIP Member & Admin trên Navbar...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Click user icon
  await page.click("button.rog-nav-user");
  await page.waitForTimeout(600);

  // Fill in credentials: admin / Admin@123
  await page.fill("input[placeholder*='admin hoặc email']", "admin");
  await page.fill("input[type='password']", "Admin@123");
  await page.click("button:has-text('XÁC THỰC & ĐĂNG NHẬP')");
  await page.waitForTimeout(1500);

  // Re-open modal to check profile info
  await page.click("button.rog-nav-user");
  await page.waitForTimeout(600);

  const isAdminVisible = await page.isVisible("div:has-text('QUẢN TRỊ VIÊN HỆ THỐNG')");
  console.log(`-> Đăng nhập Backend Admin thành công: ${isAdminVisible ? "XÁC NHẬN (CÓ QUYỀN QUẢN TRỊ)" : "CHƯA XÁC NHẬN"}`);

  const ssAuth = "/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/verify-be-fe-live-auth.png";
  await page.screenshot({ path: ssAuth, fullPage: false });
  console.log(`-> Lưu ảnh trạng thái đăng nhập: ${ssAuth}`);

  await browser.close();
}

run().catch((err) => {
  console.error("Lỗi kiểm thử:", err);
  process.exit(1);
});
