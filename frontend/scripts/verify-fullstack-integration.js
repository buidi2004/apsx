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

  const errors = [];
  page.on("console", msg => {
    if (msg.type() === "error") {
      errors.push(`[${msg.location().url || "console"}] ${msg.text()}`);
    }
  });

  const urls = [
    { path: "/", name: "Trang chủ (Home)" },
    { path: "/vn/store", name: "Cửa hàng ROG Store & Bảng giá" },
    { path: "/vn/support", name: "Trung tâm bảo hành & Tra cứu Serial" },
    { path: "/vn/where-to-buy", name: "Hệ thống đại lý ủy quyền" },
    { path: "/vn/compare", name: "Công cụ so sánh laptop" },
    { path: "/vn/laptops/rog-strix/rog-strix-scar-18-2026", name: "Chi tiết SCAR 18 (Flagship)" }
  ];

  console.log("=== KIỂM THỬ PLAYWRIGHT TOÀN DIỆN FRONTEND & BACKEND ===");

  for (const item of urls) {
    const fullUrl = "http://localhost:3000" + item.path;
    console.log(`\nTesting ${item.name}: ${fullUrl}`);
    await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(1000);

    const title = await page.title();
    console.log(`  -> Title: "${title}"`);

    if (item.path === "/vn/support") {
      // Test interactive warranty lookup
      await page.fill("input[placeholder*='R4NRCX']", "R4NRCX0001");
      await page.click("button:has-text('TRA CỨU')");
      await page.waitForTimeout(1000);
      const hasResult = await page.isVisible(".rog-warranty-result, div:has-text('CÒN HẠN BẢO HÀNH CHÍNH HÃNG')");
      console.log(`  -> Tra cứu số serial R4NRCX0001: ${hasResult ? "THÀNH CÔNG" : "CHƯA THẤY KẾT QUẢ"}`);
    }

    if (item.path === "/vn/store") {
      const itemsCount = await page.locator("article, div:has-text('₫')").count();
      console.log(`  -> Số thẻ giá/sản phẩm hiển thị: ${itemsCount}`);
    }
  }

  // Capture proof screenshot of Store page with live pricing
  await page.goto("http://localhost:3000/vn/store", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const ssStore = "/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/verify-be-fe-live-store.png";
  await page.screenshot({ path: ssStore, fullPage: false });
  console.log(`\nScreenshot saved: ${ssStore}`);

  // Capture proof screenshot of Warranty lookup result
  await page.goto("http://localhost:3000/vn/support", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.fill("input[placeholder*='R4NRCX']", "R4NRCX0001");
  await page.click("button:has-text('TRA CỨU')");
  await page.waitForTimeout(1000);
  const ssSupport = "/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/verify-be-fe-live-warranty.png";
  await page.screenshot({ path: ssSupport, fullPage: false });
  console.log(`Screenshot saved: ${ssSupport}`);

  console.log(`\n=== TỔNG KẾT KIỂM THỬ: ${errors.length} lỗi Console JS ===`);
  if (errors.length > 0) {
    console.log("Errors:", errors.slice(0, 5));
  }

  await browser.close();
}

run().catch((err) => {
  console.error("Lỗi kiểm thử:", err);
  process.exit(1);
});
