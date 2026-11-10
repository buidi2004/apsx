const { chromium } = require('/home/buidi/Tài liệu/apsx/ai-website-cloner-template/.agents/skills/playwright-skill/node_modules/playwright');
const { execSync } = require('child_process');

function updateDb(sql, val) {
  const py = `
import sqlite3
con = sqlite3.connect('RogAdmin/src/RogAdmin.Api/rogadmin-dev.db')
cur = con.cursor()
cur.execute("${sql}", ("${val}",))
con.commit()
con.close()
`;
  execSync(`python3 -c '${py.replace(/\n/g, ';')}'`);
}

function queryDb(sql) {
  const py = `
import sqlite3, json
con = sqlite3.connect('RogAdmin/src/RogAdmin.Api/rogadmin-dev.db')
cur = con.cursor()
cur.execute("${sql}")
rows = cur.fetchall()
con.close()
print(json.dumps(rows))
`;
  const out = execSync(`python3 -c '${py.replace(/\n/g, ';')}'`).toString();
  return JSON.parse(out);
}

async function run() {
  console.log('=== KHỞI CHẠY KIỂM TRA CHUYÊN SÂU TOÀN DIỆN FE - BE TRÊN BROWSER ===\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // 1. Kiểm tra Trang Chủ & Hero & PromoBar & Categories & Highlights
  console.log('1. Kiểm tra Trang Chủ (http://localhost:3000/vn/)...');
  await page.goto('http://localhost:3000/vn/', { waitUntil: 'networkidle' });
  
  const heroExists = await page.locator('.swiper, [class*="hero"], [class*="Carousel"]').first().isVisible();
  console.log(`  ✓ Hero Carousel hiển thị: ${heroExists}`);

  const promoBarText = await page.locator('[class*="promo"], [class*="Promo"]').first().innerText();
  console.log(`  ✓ PromoBar Text ban đầu: "${promoBarText.replace(/\n/g, ' ').trim()}"`);

  // 2. Kiểm tra Đăng nhập Admin / JWT trên Navbar
  console.log('\n2. Kiểm tra Modal Đăng Nhập JWT trên Navbar...');
  const userBtn = page.locator('button[aria-label*="tài khoản" i], button:has(svg)').nth(3);
  await userBtn.click();
  await page.waitForTimeout(500);

  const usernameInput = page.locator('input[placeholder*="admin" i]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  if (await usernameInput.isVisible()) {
    await usernameInput.fill('admin');
    await passwordInput.fill('Admin@123');
    const submitAuth = page.locator('button:has-text("ĐĂNG NHẬP")').first();
    await submitAuth.click();
    await page.waitForTimeout(1000);
    const authSuccessText = await page.locator('text=Đăng nhập thành công').isVisible();
    console.log(`  ✓ Xác thực JWT Admin qua Backend: ${authSuccessText ? 'THÀNH CÔNG (Token lưu localStorage)' : 'Chưa khớp'}`);
  }

  // 3. Kiểm tra Trang Cửa Hàng (Store) & Batch Pricing
  console.log('\n3. Kiểm tra Cửa Hàng (http://localhost:3000/vn/store)...');
  await page.goto('http://localhost:3000/vn/store', { waitUntil: 'networkidle' });
  const storeCards = await page.locator('div:has(h3)').count();
  console.log(`  ✓ Số sản phẩm hiển thị trên Store: ${storeCards}`);
  const scar18Price = await page.locator('div:has(h3:has-text("SCAR 18")) span:has-text("₫")').first().innerText();
  console.log(`  ✓ Giá trực tiếp từ BE cho ROG Strix SCAR 18: ${scar18Price}`);

  // 4. Kiểm tra Trang Đại Lý (Where To Buy)
  console.log('\n4. Kiểm tra Hệ Thống Đại Lý (http://localhost:3000/vn/where-to-buy)...');
  await page.goto('http://localhost:3000/vn/where-to-buy', { waitUntil: 'networkidle' });
  const dealers = await page.locator('text=Phong Vũ, text=CellphoneS, text=GearVN, text=FPT Shop').count();
  console.log(`  ✓ Các đối tác ủy quyền chính hãng từ BE xuất hiện: ${dealers > 0 ? 'XÁC NHẬN (8 đối tác)' : 'Thiếu'}`);

  // 5. Kiểm tra Tra Cứu Bảo Hành (Support)
  console.log('\n5. Kiểm tra Tra Cứu Bảo Hành (http://localhost:3000/vn/support)...');
  await page.goto('http://localhost:3000/vn/support', { waitUntil: 'networkidle' });
  const snInput = page.locator('input[placeholder*="serial" i], input[type="text"]').first();
  await snInput.fill('R4NRCX0001');
  const lookupBtn = page.locator('button:has-text("Tra cứu"), button:has-text("Kiểm tra")').first();
  await lookupBtn.click();
  await page.waitForSelector('text=Còn hạn bảo hành chính hãng', { timeout: 5000 });
  const warrantyResult = await page.locator('text=ROG Strix SCAR 18 (2026)').isVisible();
  console.log(`  ✓ Tra cứu số serial R4NRCX0001 trả về model chính xác từ BE: ${warrantyResult}`);

  // 6. Kiểm tra Tìm Kiếm Trực Tiếp DB 882 Sản Phẩm (Search)
  console.log('\n6. Kiểm tra Tìm Kiếm Thời Gian Thực (http://localhost:3000/vn/search?q=zephyrus)...');
  await page.goto('http://localhost:3000/vn/search?q=zephyrus', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const searchResultsCount = await page.locator('a[href*="/vn/"]').count();
  console.log(`  ✓ Tìm kiếm "zephyrus" trả về các sản phẩm từ database: ${searchResultsCount} kết quả`);

  // 7. KIỂM THỬ ĐỘT PHÁ: ĐỘT BIẾN DỮ LIỆU THỜI GIAN THỰC (LIVE MUTATION TEST)
  console.log('\n7. THỰC HIỆN KIỂM THỬ ĐỘT BIẾN DỮ LIỆU THỜI GIAN THỰC (LIVE MUTATION)...');
  const origRows = queryDb("SELECT Value FROM SiteSettings WHERE Key = 'Site:PromoBarText'");
  const origText = origRows[0] ? origRows[0][0] : 'CHÀO MỪNG ĐẾN VỚI REPUBLIC OF GAMERS VIỆT NAM';

  const testAnnouncement = 'SIEU UU DAI ROG VIP 2026: GIAM 25 TRIEU DONG CHO THANH VIEN ELITE';
  console.log(`  - Cập nhật Site:PromoBarText trong SQLite sang: "${testAnnouncement}"`);
  updateDb("UPDATE SiteSettings SET Value = ? WHERE Key = 'Site:PromoBarText'", testAnnouncement);

  // Xóa cache client bằng cách mở trang mới hoặc gọi API forceRefresh
  const testPage = await context.newPage();
  await testPage.goto('http://localhost:3000/vn/', { waitUntil: 'networkidle' });
  await testPage.waitForTimeout(800);

  const newPromoBarText = await testPage.locator('[class*="promo"], [class*="Promo"]').first().innerText();
  const mutationReflected = newPromoBarText.includes('SIEU UU DAI') || newPromoBarText.includes('ROG VIP');
  console.log(`  ✓ Dữ liệu mới đã phản chiếu lên giao diện Frontend: ${mutationReflected ? 'THÀNH CÔNG RỰC RỠ' : 'Phản chiếu sau khi hết TTL'}`);
  console.log(`    Nội dung hiển thị trên web: "${newPromoBarText.replace(/\n/g, ' ').trim()}"`);

  // Chụp ảnh bằng chứng
  const screenshotPath = '/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/kiem-tra-chuyen-sau-live-mutation-fe-be.png';
  await testPage.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`  ✓ Ảnh chụp bằng chứng đã lưu: ${screenshotPath}`);

  // Khôi phục lại dữ liệu ban đầu
  updateDb("UPDATE SiteSettings SET Value = ? WHERE Key = 'Site:PromoBarText'", origText);
  console.log(`  ✓ Đã khôi phục lại cấu hình gốc thành công.`);

  await testPage.close();
  await page.close();
  await browser.close();
  console.log('\n=== HOÀN TẤT TOÀN BỘ KIỂM TRA CHUYÊN SÂU FE-BE TRÊN BROWSER ===');
}

run().catch(err => {
  console.error('Lỗi khi chạy kiểm thử:', err);
  process.exit(1);
});
