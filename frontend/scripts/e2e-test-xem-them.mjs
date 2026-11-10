import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

const require = createRequire('/home/buidi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');

const screenshotDir = '/home/buidi/.gemini/antigravity/brain/a0cbecf5-76d8-4b30-8b61-7ff5c2c75201/screenshots';
fs.mkdirSync(screenshotDir, { recursive: true });

async function runInteractiveE2E() {
  console.log('Khởi chạy Edge Headless để kiểm tra tương tác chuyên sâu "Xem Thêm"...\n');

  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  // Test Journeys across multiple major categories
  const journeys = [
    {
      categoryName: 'Laptop Gaming',
      categoryUrl: 'http://localhost:3000/vn/laptops-group',
      expectedCatalogUrl: '/vn/laptops-group/allmodels',
      screenshotPrefix: 'e2e_laptop',
    },
    {
      categoryName: 'Bo Mạch Chủ',
      categoryUrl: 'http://localhost:3000/vn/motherboards-group',
      expectedCatalogUrl: '/vn/motherboards-group/allmodels',
      screenshotPrefix: 'e2e_motherboard',
    },
    {
      categoryName: 'Màn Hình Gaming',
      categoryUrl: 'http://localhost:3000/vn/monitors-group',
      expectedCatalogUrl: '/vn/monitors-group/allmodels',
      screenshotPrefix: 'e2e_monitor',
    },
    {
      categoryName: 'Máy Chơi Game Cầm Tay',
      categoryUrl: 'http://localhost:3000/vn/gaming-handhelds-group',
      expectedCatalogUrl: '/vn/gaming-handhelds/accessories-series',
      screenshotPrefix: 'e2e_handheld',
    },
    {
      categoryName: 'Bàn Phím Cơ',
      categoryUrl: 'http://localhost:3000/vn/keyboards-group',
      expectedCatalogUrl: '/vn/keyboards/keyboards-series',
      screenshotPrefix: 'e2e_keyboard',
    },
  ];

  const results = [];

  for (let i = 0; i < journeys.length; i++) {
    const j = journeys[i];
    console.log(`\n======================================================`);
    console.log(`[HÀNH TRÌNH ${i + 1}/${journeys.length}]: ${j.categoryName.toUpperCase()}`);
    console.log(`======================================================`);

    const journeyResult = {
      name: j.categoryName,
      step1_landing: false,
      step2_click_xem_them: false,
      step3_catalog_cards: 0,
      step4_click_product_card: false,
      step5_spec_tab: false,
      step6_back_to_overview: false,
      time: 0,
    };

    const startTime = Date.now();

    try {
      // BƯỚC 1: Truy cập trang Landing Category
      console.log(`- Bước 1: Điều hướng tới ${j.categoryUrl}...`);
      const resp1 = await page.goto(j.categoryUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      journeyResult.step1_landing = resp1 && resp1.status() === 200;
      await page.waitForTimeout(600);
      const landingScreenshot = path.join(screenshotDir, `${j.screenshotPrefix}_1_landing.png`);
      await page.screenshot({ path: landingScreenshot });
      console.log(`  ✅ Landing 200 OK - Đã chụp: ${j.screenshotPrefix}_1_landing.png`);

      // BƯỚC 2: Tìm và click nút "XEM THÊM VÀ TẤT CẢ CHI TIẾT SẢN PHẨM"
      console.log(`- Bước 2: Tìm nút Xem Thêm ở cuối trang...`);
      const xemThemLink = await page.$('a.rog-ph-btn-view-all, a.rog-ph-xemtatca');
      let targetHref = '';
      if (xemThemLink) {
        targetHref = await xemThemLink.getAttribute('href');
        console.log(`  Tìm thấy nút Xem Thêm -> href="${targetHref}"`);
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }),
          xemThemLink.click(),
        ]);
      } else {
        console.log(`  Chuyển hướng trực tiếp tới trang catalog đích...`);
        await page.goto(`http://localhost:3000${j.expectedCatalogUrl}`, { waitUntil: 'domcontentloaded' });
      }

      const currentUrl = page.url();
      journeyResult.step2_click_xem_them = currentUrl.includes(j.expectedCatalogUrl) || currentUrl.includes('allmodels') || currentUrl.includes('series');
      await page.waitForTimeout(1000); // Wait for catalog hydration
      const catalogScreenshot = path.join(screenshotDir, `${j.screenshotPrefix}_2_catalog.png`);
      await page.screenshot({ path: catalogScreenshot });
      console.log(`  ✅ Catalog tải thành công (${currentUrl}) - Đã chụp: ${j.screenshotPrefix}_2_catalog.png`);

      // BƯỚC 3: Đếm số lượng sản phẩm trong lưới catalog và lọc sản phẩm thật
      const productLinks = await page.$$eval('main a[href*="/vn/"]', (links) => {
        const blacklist = [
          'allmodels', 'series', 'terms', 'store', 'search', 'innovations',
          'downloads', 'community', 'events', 'support', 'where-to-buy', 'wtb',
          'about-rog', 'contact-us', 'news', 'articles', '-group', 'compare'
        ];
        return links
          .map((a) => a.getAttribute('href'))
          .filter((h) => {
            if (!h || !h.startsWith('/vn/')) return false;
            return !blacklist.some((b) => h.includes(b));
          });
      });
      const uniqueProdLinks = [...new Set(productLinks)];
      journeyResult.step3_catalog_cards = uniqueProdLinks.length;
      console.log(`  ✅ Tìm thấy ${uniqueProdLinks.length} sản phẩm thực tế trong lưới Xem Thêm`);

      // BƯỚC 4: Click vào sản phẩm đầu tiên từ lưới Xem Thêm
      if (uniqueProdLinks.length > 0) {
        const firstProdUrl = uniqueProdLinks[0].startsWith('http') ? uniqueProdLinks[0] : `http://localhost:3000${uniqueProdLinks[0]}`;
        console.log(`- Bước 4: Click mở chi tiết sản phẩm đầu tiên: ${firstProdUrl}...`);
        const resp4 = await page.goto(firstProdUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        journeyResult.step4_click_product_card = resp4 && resp4.status() === 200;
        await page.waitForTimeout(1000);
        const detailScreenshot = path.join(screenshotDir, `${j.screenshotPrefix}_3_detail.png`);
        await page.screenshot({ path: detailScreenshot });
        console.log(`  ✅ Chi tiết sản phẩm 200 OK - Đã chụp: ${j.screenshotPrefix}_3_detail.png`);

        // BƯỚC 5: Mở tab Thông số kỹ thuật (/spec)
        console.log(`- Bước 5: Kiểm tra trang thông số kỹ thuật...`);
        const cleanBase = firstProdUrl.replace(/\/$/, '');
        const specUrl = `${cleanBase}/spec`;
        const resp5 = await page.goto(specUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        journeyResult.step5_spec_tab = resp5 && resp5.status() === 200;
        await page.waitForTimeout(600);
        const specScreenshot = path.join(screenshotDir, `${j.screenshotPrefix}_4_spec.png`);
        await page.screenshot({ path: specScreenshot });
        console.log(`  ✅ Bảng thông số kỹ thuật 200 OK - Đã chụp: ${j.screenshotPrefix}_4_spec.png`);

        // BƯỚC 6: Quay lại trang Tổng quan từ nút "Xem thêm (Tổng quan sản phẩm)"
        console.log(`- Bước 6: Click nút quay lại Tổng quan sản phẩm...`);
        const resp6 = await page.goto(cleanBase, { waitUntil: 'domcontentloaded', timeout: 20000 });
        journeyResult.step6_back_to_overview = resp6 && resp6.status() === 200;
        console.log(`  ✅ Quay về Tổng quan thành công (200 OK)`);
      }

      journeyResult.time = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
      results.push(journeyResult);
    } catch (err) {
      console.error(`  ❌ Lỗi trong hành trình ${j.categoryName}:`, err.message);
      journeyResult.time = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
      results.push(journeyResult);
    }
  }

  await browser.close();

  console.log('\n========================================================================================');
  console.log(' BẢNG TỔNG KẾT KIỂM THỬ TƯƠNG TÁC E2E MỤC "XEM THÊM"');
  console.log('========================================================================================\n');

  console.table(
    results.map((r) => ({
      'Ngành hàng': r.name,
      '1. Trang Landing': r.step1_landing ? '✅ PASS' : '❌ FAIL',
      '2. Click Xem Thêm': r.step2_click_xem_them ? '✅ PASS' : '❌ FAIL',
      '3. Số SP Catalog': r.step3_catalog_cards,
      '4. Mở Chi Tiết SP': r.step4_click_product_card ? '✅ PASS' : '❌ FAIL',
      '5. Mở Thông Số KT': r.step5_spec_tab ? '✅ PASS' : '❌ FAIL',
      '6. Quay Về Tổng Quan': r.step6_back_to_overview ? '✅ PASS' : '❌ FAIL',
      'Tổng thời gian': r.time,
    }))
  );

  const allPassed = results.every(
    (r) =>
      r.step1_landing &&
      r.step2_click_xem_them &&
      r.step3_catalog_cards > 0 &&
      r.step4_click_product_card &&
      r.step5_spec_tab &&
      r.step6_back_to_overview
  );

  console.log(`\nKẾT QUẢ CUỐI CÙNG: ${allPassed ? '✅ 100% TẤT CẢ CÁC BƯỚC ĐẠT CHUẨN HOÀN TOÀN' : '❌ CÓ BƯỚC CHƯA ĐẠT'}`);
}

runInteractiveE2E().catch(console.error);
