import { chromium } from 'playwright';
import fs from 'fs';

const xemThemCategories = [
  { id: 'laptops', name: 'Laptop Gaming ASUS ROG', url: '/vn/laptops-group/allmodels', seriesUrl: '/vn/laptops/rog-zephyrus-series' },
  { id: 'motherboards', name: 'Bo Mạch Chủ', url: '/vn/motherboards-group/allmodels', seriesUrl: '/vn/motherboards/rog-strix-series' },
  { id: 'graphics-cards', name: 'Card Đồ Họa', url: '/vn/graphics-cards-group/allmodels', seriesUrl: '/vn/graphics-cards/graphics-cards-series' },
  { id: 'monitors', name: 'Màn Hình Gaming', url: '/vn/monitors-group/allmodels', seriesUrl: '/vn/monitors/rog-swift-series' },
  { id: 'phones', name: 'Điện Thoại ROG Phone', url: '/vn/phones-group/allmodels', seriesUrl: '/vn/phones/rog-phone-series' },
  { id: 'desktops', name: 'Máy Bộ PC Gaming', url: '/vn/desktops-group/allmodels', seriesUrl: '/vn/desktops/rog-strix-series' },
  { id: 'power-supplies', name: 'Nguồn Máy Tính (PSU)', url: '/vn/power-supply-units-group/allmodels', seriesUrl: '/vn/power-supply-units/rog-thor-series' },
  { id: 'egpu', name: 'Dock Đồ Họa Ngoài (eGPU)', url: '/vn/external-graphics-docks-group/allmodels', seriesUrl: null },
  { id: 'networking', name: 'Thiết Bị Mạng Gaming', url: '/vn/networking-group/allmodels', seriesUrl: '/vn/networking/rog-rapture-series' },
  { id: 'keyboards', name: 'Bàn Phím Cơ', url: '/vn/keyboards-group/allmodels', seriesUrl: '/vn/keyboards/keyboards-series' },
  { id: 'mice', name: 'Chuột & Lót Chuột', url: '/vn/mice-mouse-pads-group/allmodels', seriesUrl: '/vn/mice-mouse-pads/mice-series' },
  { id: 'headsets', name: 'Tai Nghe & Audio', url: '/vn/headsets-audio-group/allmodels', seriesUrl: '/vn/headsets-audio/headsets-series' },
  { id: 'cases', name: 'Vỏ Case Gaming', url: '/vn/cases-group/allmodels', seriesUrl: '/vn/cases/rog-hyperion-series' },
  { id: 'apparel', name: 'Trang Phục, Balo & Phụ Kiện', url: '/vn/apparel-bags-gear-group/allmodels', seriesUrl: '/vn/apparel-bags-gear/bags-series' },
  { id: 'streaming', name: 'Thiết Bị Stream', url: '/vn/streaming-kits-group/allmodels', seriesUrl: null },
  { id: 'controllers', name: 'Tay Cầm Chơi Game', url: '/vn/controllers-group/allmodels', seriesUrl: null },
  { id: 'protection', name: 'Phụ Kiện Bảo Vệ', url: '/vn/protection-and-gadgets-group/allmodels', seriesUrl: '/vn/protection-and-gadgets/cases-and-protection-series' },
  { id: 'cooling', name: 'Tản Nhiệt Nước & Fan', url: '/vn/cooling-group/allmodels', seriesUrl: '/vn/cooling/cpu-liquid-coolers-series' },
  { id: 'handhelds', name: 'Máy Chơi Game Cầm Tay', url: '/vn/gaming-handhelds-group', seriesUrl: '/vn/gaming-handhelds/accessories-series' },
  { id: 'rog-saga', name: 'ROG SAGA', url: '/vn/rog-saga-group', seriesUrl: null },
  { id: 'docks-chargers', name: 'Củ Sạc & Cáp', url: '/vn/docks-chargers-and-cables-group/allmodels', seriesUrl: '/vn/docks-chargers-and-cables/chargers-series' },
  { id: 'storage', name: 'Ổ Cứng Di Động ROG', url: '/vn/storage-group/allmodels', seriesUrl: '/vn/storage/rog-strix-arion-model' },
];

async function main() {
  console.log('========================================================================');
  console.log('  KIỂM TRA CHUYÊN SÂU TẤT CẢ CÁC TRANG SẢN PHẨM "XEM THÊM" (ASUS ROG)   ');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const results = [];

  for (const item of xemThemCategories) {
    const fullUrl = 'http://localhost:3000' + item.url;
    process.stdout.write(`Đang kiểm tra: [${item.name}] (${item.url})... `);

    try {
      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(600);

      const status = response ? response.status() : 0;
      const title = await page.title();

      // Count product cards and verify key DOM elements
      const metrics = await page.evaluate(() => {
        const productCards = document.querySelectorAll(
          '.productCard, [class*="productCard"], [class*="ProductCard"], [data-product-id], .cardItem, [class*="Card_"], [class*="product_card"]'
        );
        const images = document.querySelectorAll('img');
        const filters = document.querySelectorAll('[class*="filter"], [class*="Filter"], aside, select');
        const links = document.querySelectorAll('a[href*="/vn/"]');

        return {
          productCount: productCards.length,
          imageCount: images.length,
          hasFilters: filters.length > 0,
          internalLinks: links.length
        };
      });

      const pass = status === 200 && (metrics.productCount > 0 || metrics.imageCount > 2);
      console.log(pass ? `✅ 200 OK (${metrics.productCount} SP, ${metrics.imageCount} ảnh)` : `⚠️ ${status} (${metrics.productCount} SP)`);

      results.push({
        category: item.name,
        url: item.url,
        status,
        title: title.slice(0, 45),
        productCards: metrics.productCount,
        images: metrics.imageCount,
        hasFilters: metrics.hasFilters,
        pass
      });

    } catch (err) {
      console.log(`❌ Lỗi: ${err.message}`);
      results.push({
        category: item.name,
        url: item.url,
        status: 'CRASH/TIMEOUT',
        title: 'N/A',
        productCards: 0,
        images: 0,
        hasFilters: false,
        pass: false
      });
    }
  }

  await browser.close();

  console.log('\n========================================================================');
  console.log('  BẢNG TỔNG HỢP KIỂM ĐỊNH TOÀN BỘ 22 TRANG "XEM THÊM"                  ');
  console.log('========================================================================');
  console.table(results.map(r => ({
    'Ngành Hàng': r.category,
    'Đường Dẫn': r.url,
    'HTTP': r.status,
    'Số SP Render': r.productCards,
    'Số Ảnh': r.images,
    'Bộ Lọc': r.hasFilters ? 'Có' : 'Không',
    'Trạng Thái': r.pass ? '✅ ĐẠT CHUẨN' : '❌ CẦN XỬ LÝ'
  })));

  const passedCount = results.filter(r => r.pass).length;
  const passRate = ((passedCount / results.length) * 100).toFixed(1);
  console.log(`\nTổng số trang đã kiểm tra: ${results.length}`);
  console.log(`Số trang đạt chuẩn 100% render: ${passedCount}/${results.length} (${passRate}%)`);
  console.log('========================================================================\n');
}

main().catch(console.error);
