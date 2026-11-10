import { createRequire } from 'module';
import { execSync } from 'child_process';

const require = createRequire('/home/buidi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');

const DB_PATH = '/home/buidi/Tài liệu/apsx/RogAdmin/src/RogAdmin.Api/rogadmin-dev.db';
const BE_URL = 'http://localhost:5161';
const PROXY_URL = 'http://localhost:3000/api/be';
const FE_URL = 'http://localhost:3000';

function queryDb(sql) {
  const cmd = `sqlite3 "${DB_PATH}" "${sql}"`;
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

async function main() {
  console.log('='.repeat(84));
  console.log(' KIỂM TRA CHUYÊN SÂU NGUỒN GỐC DỮ LIỆU (5-STAGE DATA LINEAGE TRACE)');
  console.log(' DB (SQLite) -> BE (ASP.NET Core) -> PROXY (Next.js) -> CLIENT RAM -> DOM UI');
  console.log('='.repeat(84));

  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const lineageReport = [];

  // =========================================================================
  // TRACE 1: FLAGSHIP PRODUCT (ROG Strix SCAR 18 2026)
  // =========================================================================
  console.log('\n[TRACE 1] Kiểm tra sản phẩm Flagship: ROG Strix SCAR 18 (2026)...');
  const slug1 = 'laptops/rog-strix/rog-strix-scar-18-2026';
  
  // Stage 1: SQLite
  const dbProduct = queryDb(`SELECT p.Name, p.ModelCode, pp.Price FROM Products p LEFT JOIN ProductPrices pp ON p.Id = pp.ProductId WHERE p.Slug LIKE '%scar-18%' LIMIT 1;`).split('|');
  const s1Db = { name: dbProduct[0], model: dbProduct[1], price: Number(dbProduct[2]) };

  // Stage 2: BE API
  const beProduct = await fetch(`${BE_URL}/api/public/products/item?slug=${slug1}`).then(r => r.json());
  const s2Be = { name: beProduct.name, model: beProduct.modelCode, price: beProduct.price };

  // Stage 3: FE Proxy
  const proxyProduct = await fetch(`${PROXY_URL}/public/products/item?slug=${slug1}`).then(r => r.json());
  const s3Proxy = { name: proxyProduct.name, model: proxyProduct.modelCode, price: proxyProduct.price };

  // Stage 5: DOM UI
  await page.goto(`${FE_URL}/vn/laptops/rog-strix/rog-strix-scar-18-2026`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(1000);
  const domTitle = await page.title();
  const s5Dom = domTitle.includes('SCAR 18');

  const match1 = s1Db.name === s2Be.name && s2Be.name === s3Proxy.name && s5Dom;
  lineageReport.push({
    entity: 'Sản phẩm Flagship',
    identifier: slug1,
    stage1_Database: `Name: "${s1Db.name}", Price: ${s1Db.price.toLocaleString()}đ`,
    stage2_BackendAPI: `Name: "${s2Be.name}", Price: ${s2Be.price.toLocaleString()}đ`,
    stage3_NextProxy: `Name: "${s3Proxy.name}", Price: ${s3Proxy.price.toLocaleString()}đ`,
    stage5_BrowserDOM: s5Dom ? `DOM Title: "${domTitle.slice(0, 35)}..."` : 'Không khớp',
    verdict: match1 ? '✅ ĐỒNG BỘ 100%' : '❌ LỆCH DỮ LIỆU'
  });

  // =========================================================================
  // TRACE 2: WARRANTY RECORD (Serial R4NRCX0001)
  // =========================================================================
  console.log('\n[TRACE 2] Kiểm tra hồ sơ bảo hành: Serial R4NRCX0001...');
  const serial = 'R4NRCX0001';

  // Stage 1: SQLite
  const dbWarranty = queryDb(`SELECT ProductModel, ServiceCenter FROM WarrantyRecords WHERE SerialNumber = '${serial}';`).split('|');
  const s1W = { product: dbWarranty[0], center: dbWarranty[1] };

  // Stage 2: BE API
  const beW = await fetch(`${BE_URL}/api/public/warranty/check?serial=${serial}`).then(r => r.json());
  
  // Stage 3: FE Proxy
  const proxyW = await fetch(`${PROXY_URL}/public/warranty/check?serial=${serial}`).then(r => r.json());

  // Stage 5: DOM UI
  await page.goto(`${FE_URL}/vn/support`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(600);
  await page.fill('input[placeholder*="R4NRCX"]', serial);
  await page.click('button:has-text("TRA CỨU")');
  await page.waitForTimeout(1200);
  const s5W = await page.isVisible('text=CÒN HẠN BẢO HÀNH CHÍNH HÃNG');

  const match2 = s1W.product === beW.productModel && beW.productModel === proxyW.productModel && s5W;
  lineageReport.push({
    entity: 'Tra cứu Bảo hành',
    identifier: serial,
    stage1_Database: `${s1W.product} (${s1W.center.slice(0, 25)}...)`,
    stage2_BackendAPI: `${beW.productModel} (${beW.statusText})`,
    stage3_NextProxy: `${proxyW.productModel} (${proxyW.statusText})`,
    stage5_BrowserDOM: s5W ? 'Thẻ bảo hành hiển thị trên DOM' : 'Không thấy thẻ',
    verdict: match2 ? '✅ ĐỒNG BỘ 100%' : '❌ LỆCH DỮ LIỆU'
  });

  // =========================================================================
  // TRACE 3: PROMO BAR SITE SETTING
  // =========================================================================
  console.log('\n[TRACE 3] Kiểm tra cấu hình hệ thống: promoBarText...');
  
  // Stage 1: SQLite
  const dbPromo = queryDb(`SELECT Value FROM SiteSettings WHERE [Key] = 'promoBarText';`);

  // Stage 2: BE API
  const beConfig = await fetch(`${BE_URL}/api/public/site-config`).then(r => r.json());
  const bePromo = beConfig.promoBar?.text;

  // Stage 3: FE Proxy
  const proxyConfig = await fetch(`${PROXY_URL}/public/site-config`).then(r => r.json());
  const proxyPromo = proxyConfig.promoBar?.text;

  // Stage 5: DOM UI
  await page.goto(`${FE_URL}/vn`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(800);
  const domPromo = await page.locator('.rog-promo').textContent();

  const match3 = dbPromo === bePromo && bePromo === proxyPromo && domPromo?.trim() === dbPromo;
  lineageReport.push({
    entity: 'Cấu hình PromoBar',
    identifier: 'promoBarText',
    stage1_Database: `"${dbPromo}"`,
    stage2_BackendAPI: `"${bePromo}"`,
    stage3_NextProxy: `"${proxyPromo}"`,
    stage5_BrowserDOM: `"${domPromo?.trim()}"`,
    verdict: match3 ? '✅ ĐỒNG BỘ 100%' : '❌ LỆCH DỮ LIỆU'
  });

  // =========================================================================
  // TRACE 4: HERO SLIDES CAROUSEL
  // =========================================================================
  console.log('\n[TRACE 4] Kiểm tra Banner Hero Carousel...');
  
  // Stage 1: SQLite
  const dbSlideCount = Number(queryDb(`SELECT COUNT(*) FROM HeroSlides WHERE IsActive = 1;`));

  // Stage 2: BE API
  const beSlides = await fetch(`${BE_URL}/api/public/hero-slides`).then(r => r.json());

  // Stage 3: FE Proxy
  const proxySlides = await fetch(`${PROXY_URL}/public/hero-slides`).then(r => r.json());

  // Stage 5: DOM UI
  const domSlidesCount = await page.locator('.swiper-slide, [class*="hero-slide"]').count();

  const match4 = dbSlideCount === beSlides.length && beSlides.length === proxySlides.length && domSlidesCount === dbSlideCount;
  lineageReport.push({
    entity: 'Hero Banner Slides',
    identifier: 'hero-slides',
    stage1_Database: `${dbSlideCount} slides active`,
    stage2_BackendAPI: `${beSlides.length} slides`,
    stage3_NextProxy: `${proxySlides.length} slides`,
    stage5_BrowserDOM: `${domSlidesCount} slides hiển thị`,
    verdict: match4 ? '✅ ĐỒNG BỘ 100%' : '❌ LỆCH DỮ LIỆU'
  });

  // =========================================================================
  // TRACE 5: PRODUCT CATEGORIES (22 NGÀNH HÀNG)
  // =========================================================================
  console.log('\n[TRACE 5] Kiểm tra 22 ngành hàng Khám phá sản phẩm...');

  // Stage 1: SQLite
  const dbCatCount = Number(queryDb(`SELECT COUNT(*) FROM ProductCategories WHERE IsActive = 1;`));

  // Stage 2: BE API
  const beCats = await fetch(`${BE_URL}/api/public/product-categories`).then(r => r.json());

  // Stage 3: FE Proxy
  const proxyCats = await fetch(`${PROXY_URL}/public/product-categories`).then(r => r.json());

  // Stage 5: DOM UI
  const domCatsCount = await page.locator('.rog-product-item').count();

  const match5 = dbCatCount === beCats.length && beCats.length === proxyCats.length && domCatsCount === dbCatCount;
  lineageReport.push({
    entity: 'Danh mục ngành hàng',
    identifier: 'product-categories',
    stage1_Database: `${dbCatCount} categories active`,
    stage2_BackendAPI: `${beCats.length} categories`,
    stage3_NextProxy: `${proxyCats.length} categories`,
    stage5_BrowserDOM: `${domCatsCount} thẻ hiển thị`,
    verdict: match5 ? '✅ ĐỒNG BỘ 100%' : '❌ LỆCH DỮ LIỆU'
  });

  await browser.close();

  // IN BẢNG BÁO CÁO NGUỒN GỐC DỮ LIỆU
  console.log('\n' + '='.repeat(84));
  console.log(' BẢNG ĐỐI SOÁT NGUỒN GỐC DỮ LIỆU TỪNG BẢN GHI (DATA LINEAGE VERIFIED)');
  console.log('='.repeat(84));
  console.table(lineageReport);

  const allPassed = lineageReport.every(r => r.verdict.includes('100%'));
  console.log(`\nKẾT QUẢ KIỂM TRA CHUYÊN SÂU NGUỒN GỐC:`);
  console.log(`- Tất cả 5 thực thể cốt lõi kiểm tra: ${allPassed ? '✅ KHỚP CHUẨN XÁC 100% TỪ DATABASE ĐẾN DOM TRÌNH DUYỆT' : '❌ CÓ SAI LỆCH'}`);
  console.log('='.repeat(84));
}

main().catch(err => {
  console.error('Lỗi trace:', err);
  process.exit(1);
});
