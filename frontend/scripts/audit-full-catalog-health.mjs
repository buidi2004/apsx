import fs from 'fs';
import path from 'path';

const xml = fs.readFileSync('.cache/product1.xml', 'utf8');
const allUrls = [...xml.matchAll(/<loc>https:\/\/rog\.asus\.com\/vn\/([^<]+)\/<\/loc>/g)].map(m => m[1]);
const subPageSet = new Set(['spec', 'award', 'gallery', 'wtb', 'helpdesk', 'review', 'compatible-list']);

const baseProducts = allUrls.filter(u => !subPageSet.has(u.split('/').pop()));
const cacheDir = path.join(process.cwd(), '.cache', 'rog-catalog');
const cachedFiles = fs.readdirSync(cacheDir);
const cachedSet = new Set(cachedFiles.map(f => f.replace(/\.json$/, '')));

// Group base products by category
const catStats = {};

for (const p of baseProducts) {
  const parts = p.split('/');
  const cat = parts[0];
  if (!catStats[cat]) {
    catStats[cat] = { total: 0, overviewCached: 0, specCached: 0, missingOverview: [] };
  }
  catStats[cat].total++;

  const cleanKey = p.replace(/[^a-zA-Z0-9-_]/g, '_');
  const specKey = cleanKey + '_spec';

  if (cachedSet.has(cleanKey)) {
    catStats[cat].overviewCached++;
  } else {
    catStats[cat].missingOverview.push(p);
  }

  if (cachedSet.has(specKey)) {
    catStats[cat].specCached++;
  }
}

console.log('=== ASUS ROG VN COMPREHENSIVE PRODUCT AUDIT ===\n');
console.log(`Total Unique Products on ASUS ROG VN Sitemap: ${baseProducts.length}`);
console.log(`Total Cached Files on Disk: ${cachedFiles.length}\n`);

const summaryTable = [];
let totalOverview = 0;
let totalSpec = 0;
let totalMissing = 0;

for (const [cat, stats] of Object.entries(catStats)) {
  totalOverview += stats.overviewCached;
  totalSpec += stats.specCached;
  totalMissing += stats.missingOverview.length;
  summaryTable.push({
    'Danh mục (Category)': cat,
    'Tổng SP (Total)': stats.total,
    'Trang Tổng quan (Overview)': `${stats.overviewCached}/${stats.total} (${Math.round((stats.overviewCached / stats.total) * 100)}%)`,
    'Thông số KT (Spec)': `${stats.specCached}/${stats.total} (${Math.round((stats.specCached / stats.total) * 100)}%)`,
    'Còn thiếu (Missing)': stats.missingOverview.length,
  });
}

console.table(summaryTable);

console.log(`\nSUMMARY:`);
console.log(`- Tổng sản phẩm chi tiết cơ sở: ${baseProducts.length}`);
console.log(`- Đã tải & cache trang tổng quan (Overview): ${totalOverview}/${baseProducts.length} (${((totalOverview/baseProducts.length)*100).toFixed(1)}%)`);
console.log(`- Đã tải & cache trang thông số kỹ thuật (Spec): ${totalSpec}/${baseProducts.length} (${((totalSpec/baseProducts.length)*100).toFixed(1)}%)`);
console.log(`- Số trang sản phẩm chi tiết còn thiếu: ${totalMissing}`);

if (totalMissing > 0) {
  console.log('\nDanh sách sản phẩm còn thiếu:');
  for (const [cat, stats] of Object.entries(catStats)) {
    if (stats.missingOverview.length > 0) {
      console.log(`[${cat}]:`, stats.missingOverview);
    }
  }
}

