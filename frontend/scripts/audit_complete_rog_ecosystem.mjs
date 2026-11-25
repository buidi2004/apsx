import { chromium } from 'playwright';

const testPages = [
  // 1. Hubs ("Xem thêm" tổng)
  { type: 'HUB', name: 'Laptop Gaming ASUS ROG', url: '/vn/laptops-group/allmodels' },
  { type: 'HUB', name: 'Bo Mạch Chủ', url: '/vn/motherboards-group/allmodels' },
  { type: 'HUB', name: 'Card Đồ Họa', url: '/vn/graphics-cards/graphics-cards-series' },
  { type: 'HUB', name: 'Màn Hình Gaming', url: '/vn/monitors-group/allmodels' },
  { type: 'HUB', name: 'Điện Thoại ROG Phone', url: '/vn/phones-group/allmodels' },
  { type: 'HUB', name: 'Máy Bộ PC Gaming', url: '/vn/desktops-group/allmodels' },
  { type: 'HUB', name: 'Nguồn Máy Tính (PSU)', url: '/vn/power-supply-units-group/allmodels' },
  { type: 'HUB', name: 'Dock Đồ Họa Ngoài (eGPU)', url: '/vn/external-graphics-docks-group/allmodels' },
  { type: 'HUB', name: 'Thiết Bị Mạng Gaming', url: '/vn/networking-group/allmodels' },
  { type: 'HUB', name: 'Bàn Phím Cơ', url: '/vn/keyboards/keyboards-series' },
  { type: 'HUB', name: 'Chuột & Lót Chuột', url: '/vn/mice-mouse-pads/mice-series' },
  { type: 'HUB', name: 'Tai Nghe & Audio', url: '/vn/headsets-audio/headsets-series' },
  { type: 'HUB', name: 'Vỏ Case Gaming', url: '/vn/cases-group/allmodels' },
  { type: 'HUB', name: 'Trang Phục, Balo & Phụ Kiện', url: '/vn/apparel-bags-gear/bags-series' },
  { type: 'HUB', name: 'Thiết Bị Stream', url: '/vn/streaming-kits-group/allmodels' },
  { type: 'HUB', name: 'Tay Cầm Chơi Game', url: '/vn/controllers-group/allmodels' },
  { type: 'HUB', name: 'Phụ Kiện Bảo Vệ', url: '/vn/protection-and-gadgets/cases-and-protection-series' },
  { type: 'HUB', name: 'Tản Nhiệt Nước & Fan', url: '/vn/cooling/cpu-liquid-coolers-series' },
  { type: 'HUB', name: 'Củ Sạc & Cáp', url: '/vn/docks-chargers-and-cables/chargers-series' },
  
  // 2. Dòng sản phẩm ("Xem thêm" Series)
  { type: 'SERIES', name: 'ROG Zephyrus Series', url: '/vn/laptops/rog-zephyrus-series' },
  { type: 'SERIES', name: 'ROG Strix Laptop Series', url: '/vn/laptops/rog-strix-series' },
  { type: 'SERIES', name: 'ROG Flow Series', url: '/vn/laptops/rog-flow-series' },
  { type: 'SERIES', name: 'ROG Maximus Series', url: '/vn/motherboards/rog-maximus-series' },
  { type: 'SERIES', name: 'ROG Crosshair Series', url: '/vn/motherboards/rog-crosshair-series' },
  { type: 'SERIES', name: 'ROG Thor PSU Series', url: '/vn/power-supply-units/rog-thor-series' },
  { type: 'SERIES', name: 'ROG Ryujin Cooling Series', url: '/vn/cooling/cpu-liquid-coolers/rog-ryujin-series' },
  { type: 'SERIES', name: 'ROG Ally Series', url: '/vn/gaming-handhelds/rog-ally-series' },
  
  // 3. Chi tiết sản phẩm Flagship & Tiêu biểu
  { type: 'DETAIL', name: 'ROG SCAR 18 (2026)', url: '/vn/laptops/rog-strix/rog-strix-scar-18-2026' },
  { type: 'DETAIL', name: 'ROG Strix G18 (2025)', url: '/vn/laptops/rog-strix/rog-strix-g18-2025' },
  { type: 'DETAIL', name: 'ROG Zephyrus G16 GU605', url: '/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605' },
  { type: 'DETAIL', name: 'ROG Zephyrus Duo 2026', url: '/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026' },
  { type: 'DETAIL', name: 'ROG Flow Z13-KJP', url: '/vn/laptops/rog-flow/rog-flow-z13-kjp' },
  { type: 'DETAIL', name: 'ROG Ally (2023)', url: '/vn/gaming-handhelds/rog-ally/rog-ally-2023' },
  { type: 'DETAIL', name: 'ROG Phone 7', url: '/vn/phones/rog-phone-7' },
  { type: 'DETAIL', name: 'ROG Strix XG259QNSR Ace', url: '/vn/monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace' },
  { type: 'DETAIL', name: 'ROG Matrix RTX 5090 30th', url: '/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th' },
  { type: 'DETAIL', name: 'ROG Swift OLED PG34WCDN', url: '/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn' },
  { type: 'DETAIL', name: 'ROG Azoth Extreme Edition 20', url: '/vn/keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20' },
  { type: 'DETAIL', name: 'ROG Strix Arion', url: '/vn/storage/rog-strix-arion-model' },
];

async function main() {
  console.log('========================================================================');
  console.log('  KIỂM ĐỊNH TOÀN DIỆN HỆ SINH THÁI ASUS ROG (HUBS + SERIES + CHI TIẾT)  ');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const results = [];

  for (const item of testPages) {
    const fullUrl = 'http://localhost:3000' + item.url;
    process.stdout.write(`Đang kiểm tra: [${item.type}] ${item.name}... `);

    try {
      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(600);

      const status = response ? response.status() : 0;
      const title = await page.title();

      const metrics = await page.evaluate(() => {
        const cards = document.querySelectorAll('li.productItem, [class*="ProductResultItem__productItem__"]');
        const images = document.querySelectorAll('img');
        const subbar = document.querySelector('[class*="TabBar"], [class*="subBar"], [class*="SubBar"], #productTabBarContainer');
        const hasLoadMore = !!document.querySelector('#rog-catalog-load-more-wrapper, [class*="loadMoreButtonWrapper"]');

        return {
          cardsCount: cards.length,
          imageCount: images.length,
          hasSubbar: !!subbar,
          hasLoadMore
        };
      });

      const pass = status === 200 && (metrics.cardsCount > 0 || metrics.imageCount > 5);
      console.log(pass ? `✅ 200 OK (${metrics.cardsCount} SP, ${metrics.imageCount} ảnh)` : `⚠️ ${status}`);

      results.push({
        type: item.type,
        name: item.name,
        url: item.url,
        status,
        cards: metrics.cardsCount,
        images: metrics.imageCount,
        subbar: metrics.hasSubbar ? 'Có' : '-',
        loadMore: metrics.hasLoadMore ? 'Có' : '-',
        pass
      });

    } catch (err) {
      console.log(`❌ Lỗi: ${err.message}`);
      results.push({
        type: item.type,
        name: item.name,
        url: item.url,
        status: 'ERROR',
        cards: 0,
        images: 0,
        subbar: '-',
        loadMore: '-',
        pass: false
      });
    }
  }

  await browser.close();

  console.log('\n========================================================================');
  console.log('  BẢNG TỔNG KẾT KIỂM ĐỊNH TOÀN DIỆN ASUS ROG                            ');
  console.log('========================================================================');
  console.table(results.map(r => ({
    'Phân Loại': r.type,
    'Tên Trang': r.name,
    'Đường Dẫn': r.url,
    'HTTP': r.status,
    'Số SP': r.cards,
    'Số Ảnh': r.images,
    'Subbar': r.subbar,
    'Tải thêm': r.loadMore,
    'Kết Quả': r.pass ? '✅ ĐẠT' : '❌'
  })));

  const passedCount = results.filter(r => r.pass).length;
  console.log(`\nTổng kiểm tra: ${results.length} trang | Đạt chuẩn: ${passedCount}/${results.length} (${((passedCount/results.length)*100).toFixed(1)}%)`);
  console.log('========================================================================\n');
}

main();
