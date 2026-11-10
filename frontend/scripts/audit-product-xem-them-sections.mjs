import http from 'http';

const testProducts = [
  { name: 'ROG Ally (2023)', base: '/vn/gaming-handhelds/rog-ally/rog-ally-2023' },
  { name: 'ROG Strix SCAR 18 (2026)', base: '/vn/laptops/rog-strix/rog-strix-scar-18-2026' },
  { name: 'ROG Zephyrus G16 (2025)', base: '/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605' },
  { name: 'ROG Matrix RTX 5090 30th', base: '/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th' },
  { name: 'ROG Maximus Z890 Extreme', base: '/vn/motherboards/rog-maximus/rog-maximus-z890-extreme' },
  { name: 'ROG Swift OLED PG34WCDN', base: '/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn' },
  { name: 'ROG Azoth Extreme Edition 20', base: '/vn/keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20' },
  { name: 'ROG Harpe Ace Extreme', base: '/vn/mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-extreme' },
  { name: 'ROG Thor 1600W Titanium III', base: '/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming' },
  { name: 'ROG Ryujin III 360 ARGB Extreme', base: '/vn/cooling/cpu-liquid-coolers/rog-ryujin/rog-ryujin-iii-360-argb-extreme' },
];

async function check(url) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve(500));
  });
}

console.log('====================================================================');
console.log(' KIỂM TRA CHUYÊN SÂU: CÁC MỤC \"XEM THÊM\" TRONG CHI TIẾT SẢN PHẨM');
console.log('====================================================================\n');

const results = [];

for (const p of testProducts) {
  const overviewStatus = await check(p.base);
  const specStatus = await check(`${p.base}/spec`);
  const galleryStatus = await check(`${p.base}/gallery`);
  const awardStatus = await check(`${p.base}/award`);
  const wtbStatus = await check(`${p.base}/wtb`);
  const helpdeskStatus = await check(`${p.base}/helpdesk`);

  results.push({
    'Sản phẩm': p.name,
    'Xem thêm (Tổng quan)': overviewStatus === 200 ? '✅ 200' : `❌ ${overviewStatus}`,
    'Xem thêm (Thông số)': specStatus === 200 ? '✅ 200' : `❌ ${specStatus}`,
    'Xem thêm (Thư viện)': galleryStatus === 200 ? '✅ 200' : `❌ ${galleryStatus}`,
    'Xem thêm (Giải thưởng)': awardStatus === 200 ? '✅ 200' : `❌ ${awardStatus}`,
    'Xem thêm (Nơi mua)': wtbStatus === 200 ? '✅ 200' : `❌ ${wtbStatus}`,
    'Xem thêm (Hỗ trợ)': helpdeskStatus === 200 ? '✅ 200' : `❌ ${helpdeskStatus}`,
  });
}

console.table(results);

console.log('\nKIỂM TRA CÁC LIÊN KẾT ĐỀ XUẤT LIÊN QUAN TRONG ROG ALLY 2023:');
const allyRecs = [
  '/vn/gaming-handhelds/rog-ally/rog-xbox-ally-x-2025/',
  '/vn/gaming-handhelds/accessories/rog-xbox-ally-2-in-1-premium-case/',
  '/vn/gaming-handhelds/accessories/rog-ally-travel-case/',
  '/vn/gaming-handhelds/rog-ally/rog-xbox-ally-2025/',
  '/vn/gaming-handhelds/rog-ally/rog-ally-x-2024/',
  '/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026/',
  '/vn/laptops/rog-flow/rog-flow-z13-2025/',
  '/vn/controllers/rog-raikiri-model/',
];

const recResults = await Promise.all(allyRecs.map(async (u) => ({
  url: u,
  status: await check(u)
})));

console.table(recResults.map(r => ({
  'Sản phẩm đề xuất': r.url,
  'Mã HTTP': r.status,
  'Kết quả': r.status === 200 || r.status === 308 ? '✅ 200/308 OK' : '❌ LỖI'
})));

console.log('\nHoàn tất kiểm tra chuyên sâu các mục "Xem thêm" của sản phẩm!');

