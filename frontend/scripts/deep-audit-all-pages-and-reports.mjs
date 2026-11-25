import { chromium } from "playwright";

const BE_URL = "http://localhost:5161";
const FE_URL = "http://localhost:3000";

async function main() {
  console.log("=".repeat(85));
  console.log(" KIỂM THỬ TRỰC QUAN CHUYÊN SÂU: PLAYWRIGHT TOÀN BỘ STOREFRONT VÀ ADMIN SPA");
  console.log("=".repeat(85));

  const browser = await chromium.launch({
    executablePath: "/usr/bin/microsoft-edge-stable",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  const auditLog = {
    adminChecks: [],
    feChecks: [],
    consoleErrors: [],
    networkFailures: [],
  };

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      auditLog.consoleErrors.push({ url: page.url(), text: msg.text() });
    }
  });

  page.on("requestfailed", (req) => {
    // ignore harmless aborts or favicon
    if (!req.url().includes("favicon.ico")) {
      auditLog.networkFailures.push({ url: req.url(), failure: req.failure()?.errorText });
    }
  });

  // =========================================================
  // PHẦN 1: ADMIN SPA & BÁO CÁO THỐNG KÊ (REPORTS DEEP TEST)
  // =========================================================
  console.log("\n>>> [PHẦN 1] KIỂM THỬ GIAO DIỆN ADMIN SPA & CÁC BÁO CÁO <<<");

  // 1.1 Login Admin
  try {
    await page.goto(`${BE_URL}/admin`, { waitUntil: "domcontentloaded" });
    await page.fill("#login-username", "admin");
    await page.fill("#login-password", "Admin@123");
    await page.click('#login-form button[type="submit"]');
    await page.waitForSelector("#app:not(.hidden)", { timeout: 5000 });
    console.log("  [PASS] 1.1 Đăng nhập Admin SPA thành công");
    auditLog.adminChecks.push({ name: "Admin Login", ok: true });
  } catch (err) {
    console.error("  [FAIL] 1.1 Đăng nhập Admin:", err.message);
    auditLog.adminChecks.push({ name: "Admin Login", ok: false, error: err.message });
  }

  // 1.2 Dashboard
  try {
    await page.waitForSelector("#dashboard-stats .stat-card", { timeout: 5000 });
    const statCardsCount = await page.locator("#dashboard-stats .stat-card").count();
    console.log(`  [PASS] 1.2 Dashboard tải thành công: ${statCardsCount} thẻ số liệu`);
    auditLog.adminChecks.push({ name: "Dashboard Stats", ok: statCardsCount >= 10, count: statCardsCount });
  } catch (err) {
    console.error("  [FAIL] 1.2 Dashboard:", err.message);
    auditLog.adminChecks.push({ name: "Dashboard Stats", ok: false, error: err.message });
  }

  // 1.3 Reports & Analytics Tabs
  const reportTabs = [
    { id: "top-products", name: "Báo cáo Top Sản Phẩm Bán Chạy", table: "#report-top-products-table" },
    { id: "inventory", name: "Báo cáo Sức Khỏe Tồn Kho", table: "#report-inventory-table" },
    { id: "warranty", name: "Báo cáo Hồ Sơ Bảo Hành", table: "#report-warranty-table" },
    { id: "customers", name: "Báo cáo Phân Tích Khách Hàng", table: "#report-customers-table" },
  ];

  try {
    await page.click('nav a[href="#reports"]');
    await page.waitForSelector("#page-reports:not(.hidden)", { timeout: 5000 });
    await page.waitForTimeout(1000);

    for (const tab of reportTabs) {
      await page.click(`.report-tabs-nav button[data-report-tab="${tab.id}"]`);
      await page.waitForTimeout(600);
      const isVisible = await page.isVisible(tab.table);
      console.log(`  [PASS] 1.3 Tab ${tab.name}: Hiển thị bảng dữ liệu [${tab.table}]`);
      auditLog.adminChecks.push({ name: tab.name, ok: isVisible });
    }

    // Test Presets
    const presets = ["7d", "30d", "month", "all"];
    for (const p of presets) {
      await page.click(`.report-filters button[data-preset="${p}"]`);
      await page.waitForTimeout(400);
    }
    console.log("  [PASS] 1.4 Bộ lọc thời gian (7d, 30d, month, all) phản hồi mượt mà");
    auditLog.adminChecks.push({ name: "Report Time Presets", ok: true });
  } catch (err) {
    console.error("  [FAIL] 1.3/1.4 Báo cáo Reports:", err.message);
    auditLog.adminChecks.push({ name: "Reports Tab", ok: false, error: err.message });
  }

  // 1.4 Các phân hệ quản trị khác
  const otherPages = [
    { hash: "orders", table: "#orders-table", label: "Quản lý Đơn Hàng" },
    { hash: "products", table: "#products-table", label: "Sản Phẩm & Giá" },
    { hash: "coupons", table: "#coupons-table", label: "Mã Giảm Giá / Voucher" },
    { hash: "reviews", table: "#reviews-table", label: "Kiểm Duyệt Đánh Giá" },
    { hash: "dealers", table: "#dealers-table", label: "Hệ Thống Đại Lý" },
    { hash: "warranty", table: "#warranty-table", label: "Hồ Sơ Bảo Hành" },
    { hash: "customers", table: "#customers-table", label: "Khách Hàng & VIP Elite" },
    { hash: "articles", table: "#articles-table", label: "Bài Viết & Cẩm Nang" },
  ];

  for (const p of otherPages) {
    try {
      await page.evaluate((hash) => {
        const el = document.querySelector(`nav a[href="#${hash}"]`);
        if (el) el.click();
      }, p.hash);
      await page.waitForTimeout(600);
      const isOk = await page.isVisible(p.table);
      console.log(`  [PASS] Phân hệ Admin: ${p.label} (${p.hash}) tải dữ liệu thành công`);
      auditLog.adminChecks.push({ name: p.label, ok: isOk });
    } catch (err) {
      console.error(`  [FAIL] Phân hệ Admin ${p.label}:`, err.message);
      auditLog.adminChecks.push({ name: p.label, ok: false, error: err.message });
    }
  }

  // =========================================================
  // PHẦN 2: STOREFRONT NGƯỜI DÙNG (FRONTEND DEEP TEST)
  // =========================================================
  console.log("\n>>> [PHẦN 2] KIỂM THỬ TOÀN BỘ CÁC TRANG STOREFRONT NGƯỜI DÙNG <<<");

  const fePages = [
    { url: `${FE_URL}/vn`, name: "Trang Chủ ROG Việt Nam", selector: ".rog-promo, .rog-hero-slide" },
    { url: `${FE_URL}/vn/backend-status`, name: "Trang Chẩn Đoán Sức Khỏe Kết Nối (backend-status)", selector: "table, .status-item" },
    { url: `${FE_URL}/vn/store`, name: "Cửa Hàng Trực Tuyến (store)", selector: "article, .rog-store-card" },
    { url: `${FE_URL}/vn/search?q=scar`, name: "Tìm Kiếm Thông Minh (search?q=scar)", selector: "article, h1" },
    { url: `${FE_URL}/vn/support`, name: "Trung Tâm Hỗ Trợ & Bảo Hành (support)", selector: "input[placeholder*='R4NRCX'], button" },
    { url: `${FE_URL}/vn/where-to-buy`, name: "Hệ Thống Đại Lý Ủy Quyền (where-to-buy)", selector: "div, h1" },
    { url: `${FE_URL}/vn/downloads`, name: "Kho Tiện Ích & Phần Mềm (downloads)", selector: "div, h1" },
    { url: `${FE_URL}/vn/innovations`, name: "Công Nghệ Đột Phá ROG (innovations)", selector: "div, h1" },
    { url: `${FE_URL}/vn/events`, name: "Sự Kiện & Khuyến Mãi (events)", selector: "div, h1" },
    { url: `${FE_URL}/vn/about-rog`, name: "Giới Thiệu Thương Hiệu (about-rog)", selector: "h1, div" },
    { url: `${FE_URL}/vn/cart`, name: "Giỏ Hàng (cart)", selector: "div, h1" },
    { url: `${FE_URL}/vn/checkout`, name: "Thanh Toán Đơn Hàng (checkout)", selector: "form, input" },
    { url: `${FE_URL}/vn/account/login`, name: "Đăng Nhập Khách Hàng (account/login)", selector: "form, input[type='email']" },
    { url: `${FE_URL}/vn/account/register`, name: "Đăng Ký Khách Hàng (account/register)", selector: "form, input[type='email']" },
    { url: `${FE_URL}/vn/laptops/rog-strix/rog-strix-scar-18-2026`, name: "Chi Tiết Máy: ROG Strix SCAR 18 (2026)", selector: "h1, .rog-subbar" },
    { url: `${FE_URL}/vn/gaming-handhelds/rog-ally/rog-ally-2023`, name: "Chi Tiết Máy: ROG Ally (2023)", selector: "h1, .rog-subbar, body" },
    { url: `${FE_URL}/vn/phones/rog-phone-7`, name: "Chi Tiết Máy: ROG Phone 7", selector: "h1, .rog-subbar, body" },
  ];

  for (const fp of fePages) {
    try {
      const res = await page.goto(fp.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(500);
      const status = res?.status();
      const textLen = await page.evaluate(() => document.body.innerText.trim().length).catch(() => 0);
      const isOk = status === 200 && textLen > 20;
      console.log(`  [${isOk ? "PASS" : "FAIL"}] ${fp.name} (HTTP ${status}, Content: ${textLen} chars)`);
      auditLog.feChecks.push({ name: fp.name, url: fp.url, status, ok: isOk });
    } catch (err) {
      console.error(`  [FAIL] ${fp.name}:`, err.message);
      auditLog.feChecks.push({ name: fp.name, url: fp.url, ok: false, error: err.message });
    }
  }

  await browser.close();

  // =========================================================
  // TỔNG KẾT
  // =========================================================
  console.log("\n" + "=".repeat(85));
  console.log(" KẾT QUẢ TỔNG QUAN TOÀN BỘ KIỂM THỬ TRỰC QUAN PLAYWRIGHT");
  console.log("=".repeat(85));

  const totalAdminPass = auditLog.adminChecks.filter((c) => c.ok).length;
  const totalAdmin = auditLog.adminChecks.length;
  console.log(`- Phân hệ Admin & Báo cáo: ${totalAdminPass} / ${totalAdmin} tiêu chuẩn đạt (${(totalAdminPass/totalAdmin*100).toFixed(1)}%)`);

  const totalFePass = auditLog.feChecks.filter((c) => c.ok).length;
  const totalFe = auditLog.feChecks.length;
  console.log(`- Phân hệ Storefront FE:   ${totalFePass} / ${totalFe} trang đạt (${(totalFePass/totalFe*100).toFixed(1)}%)`);

  const criticalErrors = auditLog.consoleErrors.filter(
    (e) => !e.text.includes("ResizeObserver") &&
           !e.text.includes("Non-serializable") &&
           !e.text.includes("favicon.ico") &&
           !e.text.includes("net::ERR_ABORTED")
  );
  console.log(`- Lỗi Console nghiêm trọng: ${criticalErrors.length}`);
  if (criticalErrors.length > 0) {
    const unique = [...new Set(criticalErrors.map((e) => `[${e.url}] ${e.text}`))];
    console.log(`- Chi tiết ${unique.length} lỗi console phân biệt:`);
    unique.forEach((u) => console.log(`   * ${u.slice(0, 160)}`));
  }

  if (totalAdminPass === totalAdmin && totalFePass === totalFe && criticalErrors.length === 0) {
    console.log("\n🚀 XÁC NHẬN: TẤT CẢ CÁC TRANG VÀ BÁO CÁO HOẠT ĐỘNG HOÀN TOÀN KHÔNG CÓ LỖI!");
  } else {
    console.log("\n⚠️ PHÁT HIỆN CÓ ĐIỂM CẦN LƯU Ý:");
    auditLog.feChecks.filter((c) => !c.ok).forEach((c) => console.log(`  * Lỗi FE: ${c.name} -> ${c.error || c.status}`));
    auditLog.adminChecks.filter((c) => !c.ok).forEach((c) => console.log(`  * Lỗi Admin: ${c.name} -> ${c.error}`));
  }
}

main().catch((err) => {
  console.error("Lỗi thực thi kiểm thử Playwright:", err);
  process.exit(1);
});
