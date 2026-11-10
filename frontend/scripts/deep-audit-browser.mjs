import { createRequire } from 'module';
const require = createRequire('/home/buidi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');
import path from 'path';
import fs from 'fs';

const screenshotDir = '/home/buidi/.gemini/antigravity/brain/a0cbecf5-76d8-4b30-8b61-7ff5c2c75201/screenshots';
fs.mkdirSync(screenshotDir, { recursive: true });

const testPages = [
  // 1. "XEM THÊM" - CÁC TRANG DANH MỤC TỔNG HỢP / ALLMODELS / SERIES
  {
    type: 'Xem Thêm (Catalog Hub)',
    url: 'http://localhost:3000/vn/laptops-group/allmodels',
    name: 'catalog_laptops_allmodels',
    expectedSelector: '.productResultLayout, .productCard, .filter',
  },
  {
    type: 'Xem Thêm (Catalog Hub)',
    url: 'http://localhost:3000/vn/motherboards-group/allmodels',
    name: 'catalog_motherboards_allmodels',
    expectedSelector: '.productResultLayout, .productCard, .filter',
  },
  {
    type: 'Xem Thêm (Catalog Hub)',
    url: 'http://localhost:3000/vn/monitors-group/allmodels',
    name: 'catalog_monitors_allmodels',
    expectedSelector: '.productResultLayout, .productCard, .filter',
  },
  {
    type: 'Xem Thêm (Catalog Hub)',
    url: 'http://localhost:3000/vn/graphics-cards-group/allmodels',
    name: 'catalog_graphics_cards_allmodels',
    expectedSelector: '.productResultLayout, .productCard, .filter',
  },
  {
    type: 'Xem Thêm (Catalog Hub)',
    url: 'http://localhost:3000/vn/keyboards-family-series',
    name: 'catalog_keyboards_series',
    expectedSelector: '.productResultLayout, .productCard, .filter',
  },
  {
    type: 'Xem Thêm (Catalog Hub)',
    url: 'http://localhost:3000/vn/cooling-group/allmodels',
    name: 'catalog_cooling_allmodels',
    expectedSelector: '.productResultLayout, .productCard, .filter',
  },
  {
    type: 'Xem Thêm (Catalog Hub)',
    url: 'http://localhost:3000/vn/power-supply-units-group/allmodels',
    name: 'catalog_psu_allmodels',
    expectedSelector: '.productResultLayout, .productCard, .filter',
  },
  {
    type: 'Xem Thêm (Catalog Hub)',
    url: 'http://localhost:3000/vn/gaming-handhelds-group',
    name: 'catalog_handhelds_group',
    expectedSelector: '.rog-category-home, .rog-category-hero',
  },

  // 2. "CHI TIẾT SẢN PHẨM" - FLAGSHIP TÙY BIẾN CAO CẤP
  {
    type: 'Chi Tiết (Flagship)',
    url: 'http://localhost:3000/vn/laptops/rog-strix/rog-strix-scar-18-2026',
    name: 'detail_scar_18_2026',
    expectedSelector: '.rog-scar18, .rog-detail-wrap, h1',
  },
  {
    type: 'Chi Tiết (Flagship)',
    url: 'http://localhost:3000/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605',
    name: 'detail_zephyrus_g16',
    expectedSelector: '.rog-g16-overview, h1',
  },
  {
    type: 'Chi Tiết (Flagship)',
    url: 'http://localhost:3000/vn/gaming-handhelds/rog-ally/rog-ally-2023',
    name: 'detail_rog_ally_2023',
    expectedSelector: '.rog-ally-page, h1',
  },
  {
    type: 'Chi Tiết (Flagship)',
    url: 'http://localhost:3000/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th',
    name: 'detail_matrix_5090',
    expectedSelector: '.rog-matrix-page, h1',
  },
  {
    type: 'Chi Tiết (Flagship)',
    url: 'http://localhost:3000/vn/phones/rog-phone-7',
    name: 'detail_phone_7',
    expectedSelector: '.rog-phone7, h1',
  },

  // 3. "CHI TIẾT SẢN PHẨM" - UNIVERSAL SSR TỪ CATALOG GỐC
  {
    type: 'Chi Tiết (Universal SSR)',
    url: 'http://localhost:3000/vn/motherboards/rog-maximus/rog-maximus-z890-extreme',
    name: 'detail_z890_extreme',
    expectedSelector: '.productOverview, .productOverviewLayout, .rog-universal-main-container',
  },
  {
    type: 'Chi Tiết (Universal SSR)',
    url: 'http://localhost:3000/vn/graphics-cards/rog-astral/rog-astral-rtx5090-o32g-gaming',
    name: 'detail_astral_5090',
    expectedSelector: '.productOverview, .productOverviewLayout, .rog-universal-main-container',
  },
  {
    type: 'Chi Tiết (Universal SSR)',
    url: 'http://localhost:3000/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn',
    name: 'detail_pg34wcdn',
    expectedSelector: '.productOverview, .productOverviewLayout, .rog-universal-main-container',
  },
  {
    type: 'Chi Tiết (Universal SSR)',
    url: 'http://localhost:3000/vn/keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20',
    name: 'detail_azoth_extreme',
    expectedSelector: '.productOverview, .productOverviewLayout, .rog-universal-main-container',
  },
  {
    type: 'Chi Tiết (Universal SSR)',
    url: 'http://localhost:3000/vn/mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-extreme',
    name: 'detail_harpe_ace_extreme',
    expectedSelector: '.productOverview, .productOverviewLayout, .rog-universal-main-container',
  },
  {
    type: 'Chi Tiết (Universal SSR)',
    url: 'http://localhost:3000/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming',
    name: 'detail_thor_1600t3',
    expectedSelector: '.productOverview, .productOverviewLayout, .rog-universal-main-container',
  },
  {
    type: 'Chi Tiết (Universal SSR)',
    url: 'http://localhost:3000/vn/cooling/cpu-liquid-coolers/rog-ryujin/rog-ryujin-iii-360-argb-extreme',
    name: 'detail_ryujin_iii_extreme',
    expectedSelector: '.productOverview, .productOverviewLayout, .rog-universal-main-container',
  },

  // 4. "THÔNG SỐ KỸ THUẬT" (SPEC SUBPAGES)
  {
    type: 'Thông Số Kỹ Thuật (Spec)',
    url: 'http://localhost:3000/vn/laptops/rog-strix/rog-strix-scar-18-2026/spec',
    name: 'spec_scar_18_2026',
    expectedSelector: '.rog-spec-table, .spec-table, table',
  },
  {
    type: 'Thông Số Kỹ Thuật (Spec)',
    url: 'http://localhost:3000/vn/keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20/spec',
    name: 'spec_azoth_extreme',
    expectedSelector: '.rog-spec-table, .spec-table, table',
  },
  {
    type: 'Thông Số Kỹ Thuật (Spec)',
    url: 'http://localhost:3000/vn/motherboards/rog-maximus/rog-maximus-z890-extreme/spec',
    name: 'spec_z890_extreme',
    expectedSelector: '.productSpec, .specTable, table, .rog-universal-main-container',
  },
  {
    type: 'Thông Số Kỹ Thuật (Spec)',
    url: 'http://localhost:3000/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/spec',
    name: 'spec_matrix_5090',
    expectedSelector: '.rog-spec-table, .spec-table, table',
  },
];

async function runDeepAudit() {
  console.log('Khởi động Edge/Chromium headless để kiểm tra chuyên sâu...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  });

  const results = [];

  for (let i = 0; i < testPages.length; i++) {
    const t = testPages[i];
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore Google Analytics / GTM / external tracking noise
        if (!text.includes('googletagmanager') && !text.includes('analytics') && !text.includes('doubleclick')) {
          consoleErrors.push(text);
        }
      }
    });

    const startTime = Date.now();
    let status = 0;
    let title = '';
    let hasContent = false;
    let textLength = 0;
    let screenshotPath = '';
    let errorMessage = '';

    try {
      const response = await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      status = response ? response.status() : 0;
      await page.waitForTimeout(1000); // Wait 1s for hydration

      title = await page.title();
      const bodyText = await page.innerText('body');
      textLength = bodyText.length;
      hasContent = textLength > 200;

      // Capture screenshot
      screenshotPath = path.join(screenshotDir, `${t.name}.png`);
      await page.screenshot({ path: screenshotPath });

      // Check internal links on this page
      const internalLinks = await page.$$eval('a[href^="/vn/"]', (els) => els.map((a) => a.getAttribute('href')));
      const uniqueLinks = [...new Set(internalLinks)].filter(Boolean);

      results.push({
        name: t.name,
        type: t.type,
        url: t.url,
        status,
        title: title.slice(0, 45) + (title.length > 45 ? '...' : ''),
        renderTime: `${Date.now() - startTime}ms`,
        textLength,
        consoleErrors: consoleErrors.length,
        internalLinksCount: uniqueLinks.length,
        pass: status === 200 && hasContent,
      });

      console.log(`[${i + 1}/${testPages.length}] ${status === 200 ? '✅ PASS' : '❌ FAIL'}: [${t.type}] ${t.url} (${status}) - Title: ${title.slice(0, 30)}...`);
    } catch (err) {
      errorMessage = err.message;
      results.push({
        name: t.name,
        type: t.type,
        url: t.url,
        status: status || 500,
        title: 'LỖI',
        renderTime: `${Date.now() - startTime}ms`,
        textLength: 0,
        consoleErrors: consoleErrors.length,
        internalLinksCount: 0,
        pass: false,
        error: errorMessage,
      });
      console.log(`[${i + 1}/${testPages.length}] ❌ ERROR: [${t.type}] ${t.url} - ${errorMessage}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n=== BẢNG TỔNG HỢP KIỂM TRA CHUYÊN SÂU ===\n');
  console.table(
    results.map((r) => ({
      Loại: r.type,
      URL: r.url.replace('http://localhost:3000', ''),
      HTTP: r.status,
      Tiêu_đề: r.title,
      Độ_dài_chữ: r.textLength,
      Links_nội_bộ: r.internalLinksCount,
      Thời_gian: r.renderTime,
      Kết_quả: r.pass ? 'PASS' : 'FAIL',
    }))
  );

  const passedCount = results.filter((r) => r.pass).length;
  console.log(`\nTổng số trang kiểm tra chuyên sâu: ${results.length}`);
  console.log(`Số trang đạt chuẩn (200 OK + Đầy đủ nội dung + Ảnh chụp): ${passedCount}/${results.length} (${((passedCount / results.length) * 100).toFixed(1)}%)`);
}

runDeepAudit().catch(console.error);
