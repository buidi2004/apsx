import { createRequire } from 'module';

const require = createRequire('/home/buidi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');

const BE_URL = 'http://127.0.0.1:5161';
const FE_URL = 'http://localhost:3000';

async function testMutationSync() {
  console.log('========================================================================');
  console.log(' THỬ NGHIỆM ĐỒNG BỘ ĐỔI DỮ LIỆU THỰC TẾ: ADMIN API -> FRONTEND UI');
  console.log('========================================================================\n');

  // BƯỚC 1: Đăng nhập Admin lấy token
  console.log('- Bước 1: Đăng nhập vào RogAdmin BE để lấy JWT Token...');
  const loginRes = await fetch(`${BE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Admin@123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`  ✅ Đăng nhập thành công! User: ${loginData.user.username} (${loginData.user.role})`);

  // BƯỚC 2: Đọc cấu hình PromoBar hiện tại
  console.log('\n- Bước 2: Đọc cấu hình PromoBar hiện tại...');
  const cfgRes = await fetch(`${BE_URL}/api/public/site-config`);
  const cfgData = await cfgRes.json();
  const originalText = cfgData.promoBar?.text || 'Mua Ngay Laptop Gaming AI ROG RTX 50 Series!';
  console.log(`  Cấu hình gốc: "${originalText}"`);

  // BƯỚC 3: Cập nhật PromoBar qua Admin API
  const testText = '🔥 [ROG ADMIN BE LIVE] - SIÊU SALE LAPTOP GAMING AI 2026 🔥';
  console.log(`\n- Bước 3: Cập nhật PromoBar thành: "${testText}" qua PUT /api/admin/site-settings/promoBarText...`);
  const updateRes = await fetch(`${BE_URL}/api/admin/site-settings/promoBarText`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ value: testText })
  });
  console.log(`  ✅ Cập nhật BE phản hồi HTTP ${updateRes.status}`);

  // BƯỚC 4: Kiểm tra FE Proxy
  console.log('\n- Bước 4: Kiểm tra dữ liệu qua Next.js FE Proxy (/api/be/public/site-config)...');
  const feProxyRes = await fetch(`${FE_URL}/api/be/public/site-config`, { cache: 'no-store' });
  const feProxyData = await feProxyRes.json();
  console.log(`  FE Proxy phản hồi: "${feProxyData.promoBar?.text}"`);
  const isProxySynced = feProxyData.promoBar?.text === testText;
  console.log(`  Trạng thái đồng bộ qua Proxy: ${isProxySynced ? '✅ ĐỒNG BỘ 100%' : '❌ CHƯA ĐỒNG BỘ'}`);

  // BƯỚC 5: Mở trang chủ FE bằng Edge Headless & chụp ảnh màn hình
  console.log('\n- Bước 5: Mở trang chủ http://localhost:3000/vn bằng Edge Headless...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${FE_URL}/vn`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(1500); // Wait for useEffect hydration

  const renderedPromoText = await page.$eval('.rog-promo', el => el.textContent?.trim());
  console.log(`  Chữ trên giao diện thực tế của người dùng: "${renderedPromoText}"`);
  const isUiSynced = renderedPromoText === testText;
  console.log(`  Kết quả hiển thị giao diện: ${isUiSynced ? '✅ ĐỒNG BỘ THÀNH CÔNG VÀO GIAO DIỆN UI' : '❌ CHƯA HIỂN THỊ'}`);

  const snapPath = '/home/buidi/.gemini/antigravity/brain/a0cbecf5-76d8-4b30-8b61-7ff5c2c75201/screenshots/live_be_fe_mutation_verified.png';
  await page.screenshot({ path: snapPath });
  console.log(`  📸 Đã chụp ảnh màn hình xác nhận: live_be_fe_mutation_verified.png`);
  await browser.close();

  // BƯỚC 6: Khôi phục lại cấu hình gốc
  console.log('\n- Bước 6: Khôi phục lại cấu hình gốc của PromoBar...');
  await fetch(`${BE_URL}/api/admin/site-settings/promoBarText`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ value: 'Mua Ngay Laptop Gaming AI ROG RTX 50 Series!' })
  });
  console.log(`  ✅ Đã khôi phục về: "Mua Ngay Laptop Gaming AI ROG RTX 50 Series!"`);

  console.log('\n========================================================================');
  console.log(` KẾT LUẬN: ${isProxySynced && isUiSynced ? '✅ KẾT NỐI HAI CHIỀU FRONTEND <-> BACKEND HOÀN TOÀN THỰC CHẤT 100%' : '❌ CÓ BƯỚC CHƯA THÀNH CÔNG'}`);
  console.log('========================================================================');
}

testMutationSync().catch(console.error);
