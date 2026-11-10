import http from 'http';

const xemThemRoutes = [
  // Official "XEM THÊM" category landing destinations
  { cat: 'Laptops', url: '/vn/laptops-group/allmodels' },
  { cat: 'Bo Mạch Chủ', url: '/vn/motherboards-group/allmodels' },
  { cat: 'Card Đồ Họa', url: '/vn/graphics-cards/graphics-cards-series' },
  { cat: 'Card Đồ Họa (Allmodels)', url: '/vn/graphics-cards-group/allmodels' },
  { cat: 'Màn Hình', url: '/vn/monitors-group/allmodels' },
  { cat: 'Bàn Phím Cơ', url: '/vn/keyboards/keyboards-series' },
  { cat: 'Bàn Phím Cơ (Allmodels)', url: '/vn/keyboards-group/allmodels' },
  { cat: 'Chuột Gaming', url: '/vn/mice-mouse-pads/mice-series' },
  { cat: 'Chuột Gaming (Allmodels)', url: '/vn/mice-mouse-pads-group/allmodels' },
  { cat: 'Tai Nghe & Audio', url: '/vn/headsets-audio/headsets-series' },
  { cat: 'Tai Nghe & Audio (Allmodels)', url: '/vn/headsets-audio-group/allmodels' },
  { cat: 'Nguồn Máy Tính', url: '/vn/power-supply-units-group/allmodels' },
  { cat: 'Tản Nhiệt CPU', url: '/vn/cooling/cpu-liquid-coolers-series' },
  { cat: 'Tản Nhiệt CPU (Allmodels)', url: '/vn/cooling-group/allmodels' },
  { cat: 'Máy Chơi Game Cầm Tay', url: '/vn/gaming-handhelds/accessories-series' },
  { cat: 'Gaming Handhelds Group', url: '/vn/gaming-handhelds-group' },
  { cat: 'Điện Thoại Gaming', url: '/vn/phones-group/allmodels' },
  { cat: 'Máy Bộ PC Gaming', url: '/vn/desktops-group/allmodels' },
  { cat: 'Vỏ Case Máy Tính', url: '/vn/cases-group/allmodels' },
  { cat: 'Thiết Bị Mạng WiFi 7', url: '/vn/networking-group/allmodels' },
  { cat: 'Tay Cầm Chơi Game', url: '/vn/controllers-group/allmodels' },
  { cat: 'Thiết Bị Stream', url: '/vn/streaming-kits-group/allmodels' },
  { cat: 'Dock Đồ Họa Ngoài', url: '/vn/external-graphics-docks-group/allmodels' },
  { cat: 'Ổ Cứng Di Động', url: '/vn/storage/rog-strix-arion-model' },
  { cat: 'Ổ Cứng (Allmodels)', url: '/vn/storage-group/allmodels' },
  { cat: 'Trang Phục & Balo', url: '/vn/apparel-bags-gear/bags-series' },
  { cat: 'Trang Phục (Allmodels)', url: '/vn/apparel-bags-gear-group/allmodels' },
  { cat: 'Phụ Kiện Bảo Vệ', url: '/vn/protection-and-gadgets/cases-and-protection-series' },
  { cat: 'Phụ Kiện (Allmodels)', url: '/vn/protection-and-gadgets-group/allmodels' },
  { cat: 'Củ Sạc & Cáp', url: '/vn/docks-chargers-and-cables/chargers-series' },
  { cat: 'Củ Sạc (Allmodels)', url: '/vn/docks-chargers-and-cables-group/allmodels' },
  { cat: 'ROG Saga Vũ Trụ', url: '/vn/rog-saga/toys/rog-omni-figure-og' },
  { cat: 'ROG Saga Group', url: '/vn/rog-saga-group' },
];

async function check(item) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + item.url, (res) => {
      // Follow redirect if 307 or 308
      if ((res.statusCode === 307 || res.statusCode === 308) && res.headers.location) {
        http.get('http://localhost:3000' + res.headers.location, (r2) => {
          resolve({ ...item, status: r2.statusCode, target: res.headers.location });
        }).on('error', (e) => resolve({ ...item, status: e.message }));
      } else {
        resolve({ ...item, status: res.statusCode, target: item.url });
      }
    }).on('error', (e) => resolve({ ...item, status: e.message }));
  });
}

console.log('KIỂM TRA TẤT CẢ CÁC TRANG \"XEM THÊM\" TRÊN LOCALHOST:3000...\n');
const results = await Promise.all(xemThemRoutes.map(check));

console.table(results.map(r => ({
  'Ngành hàng (Category)': r.cat,
  'Đường dẫn URL': r.url,
  'Mã HTTP': r.status,
  'Trang đích': r.target,
  'Kết quả': r.status === 200 ? '✅ 200 OK' : '❌ LỖI'
})));

const passed = results.filter(r => r.status === 200);
console.log(`\nTổng số trang "Xem thêm" đã kiểm tra: ${results.length}`);
console.log(`Tỷ lệ thành công: ${passed.length}/${results.length} (${((passed.length/results.length)*100).toFixed(1)}%)`);

