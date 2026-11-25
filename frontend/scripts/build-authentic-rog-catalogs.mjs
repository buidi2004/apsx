import fs from 'fs';
import path from 'path';
import { renderAuthenticCard as renderCard } from './render-card-helper.mjs';

const ROOT = fs.existsSync(path.resolve('frontend/.cache/rog-catalog')) ? path.resolve('frontend') : process.cwd();
const CACHE_DIR = path.resolve(ROOT, '.cache/rog-catalog');
const FILTERS_DIR = path.resolve(ROOT, '.cache/rog-filters');
if (!fs.existsSync(FILTERS_DIR)) {
  fs.mkdirSync(FILTERS_DIR, { recursive: true });
}

export const TAG_MAP = {
  'laptops': { id: 1084, hub: 'laptops-group_allmodels.json', name: 'Laptop Gaming ASUS ROG' },
  'motherboards': { id: 96, hub: 'motherboards-group_allmodels.json', name: 'Bo Mạch Chủ' },
  'monitors': { id: 248, hub: 'monitors-group_allmodels.json', name: 'Màn Hình Gaming' },
  'phones': { id: 20, hub: 'phones-group_allmodels.json', name: 'Điện Thoại ROG Phone' },
  'desktops': { id: 1160, hub: 'desktops-group_allmodels.json', name: 'Máy Bộ PC Gaming' },
  'graphics-cards': { id: 10911, hub: 'graphics-cards_graphics-cards-series.json', name: 'Card Đồ Họa' },
  'power-supply-units': { id: 856, hub: 'power-supply-units-group_allmodels.json', name: 'Nguồn Máy Tính (PSU)' },
  'external-graphics-docks': { id: 1236, hub: 'external-graphics-docks-group_allmodels.json', name: 'Dock Đồ Họa Ngoài (eGPU)' },
  'networking': { id: 324, hub: 'networking-group_allmodels.json', name: 'Thiết Bị Mạng Gaming' },
  'keyboards': { id: 8299, hub: 'keyboards_keyboards-series.json', name: 'Bàn Phím Cơ' },
  'mice-mouse-pads': { id: 3075, hub: 'mice-mouse-pads_mice-series.json', name: 'Chuột & Lót Chuột' },
  'headsets-audio': { id: 3041, hub: 'headsets-audio_headsets-series.json', name: 'Tai Nghe & Audio' },
  'cases': { id: 704, hub: 'cases-group_allmodels.json', name: 'Vỏ Case Gaming' },
  'cooling': { id: 780, hub: 'cooling_cpu-liquid-coolers-series.json', name: 'Tản Nhiệt Nước & Fan' },
  'controllers': { id: 49508, hub: 'controllers-group_allmodels.json', name: 'Tay Cầm Chơi Game' },
  'streaming-kits': { id: 628, hub: 'streaming-kits-group_allmodels.json', name: 'Thiết Bị Stream' },
  'gaming-handhelds': { id: 220212, hub: 'gaming-handhelds_rog-ally-series.json', name: 'Máy Chơi Game Cầm Tay' },
  'gaming-handhelds-acc': { id: 220087, hub: 'gaming-handhelds_accessories-series.json', name: 'Phụ Kiện Máy Chơi Game Cầm Tay' },
  'docks-chargers-and-cables': { id: 247019, hub: 'docks-chargers-and-cables_chargers-series.json', name: 'Củ Sạc & Cáp' },
  'protection-and-gadgets': { id: 49670, hub: 'protection-and-gadgets_cases-and-protection-series.json', name: 'Phụ Kiện Bảo Vệ' },
  'apparel-bags-gear': { id: 2300, hub: 'apparel-bags-gear_bags-series.json', name: 'Trang Phục, Balo & Phụ Kiện' }
};

async function buildAll() {
  console.log('================================================================');
  console.log('  BUILDING AUTHENTIC ASUS ROG CATALOG HUBS ACROSS ALL CATEGORIES ');
  console.log('================================================================\n');

  let grandTotal = 0;

  for (const [catKey, cat] of Object.entries(TAG_MAP)) {
    const filterCacheFile = path.join(FILTERS_DIR, `${catKey}_${cat.id}.json`);
    let apiData = null;

    if (fs.existsSync(filterCacheFile)) {
      try {
        apiData = JSON.parse(fs.readFileSync(filterCacheFile, 'utf8'));
      } catch {}
    }

    if (!apiData || !apiData.result || !apiData.result.skus) {
      try {
        const url = `https://api-rog.asus.com/recent-data/api/v8/Filters?Page=1&Count=100&WebsiteCode=vn&LevelTagId=${cat.id}&Sort=date&systemCode=rog`;
        const res = await fetch(url);
        apiData = await res.json();
        fs.writeFileSync(filterCacheFile, JSON.stringify(apiData, null, 2));
      } catch (e) {
        console.warn(`Failed to fetch for ${catKey}:`, e.message);
        continue;
      }
    }

    const skus = apiData.result?.skus || [];
    grandTotal += skus.length;
    console.log(`[${cat.name}] (${catKey}) => ${skus.length} authentic SKUs`);

    const hubPath = path.join(CACHE_DIR, cat.hub);
    if (!fs.existsSync(hubPath)) {
      console.warn(`Hub file not found: ${cat.hub}`);
      continue;
    }

    let hubData;
    try {
      hubData = JSON.parse(fs.readFileSync(hubPath, 'utf8'));
    } catch {
      continue;
    }

    let html = hubData.mainHtml || '';

    // Render cards
    const cardsHtml = skus.map((sku, idx) => renderCard(sku, idx)).join('\n');

    // Replace product grid in HTML
    const gridRegex = /<ul[^>]*class=["'][^"']*productResultGroupItems[^"']*["'][^>]*>[\s\S]*?<\/ul>/i;
    if (gridRegex.test(html)) {
      html = html.replace(gridRegex, `<ul class="ProductResult__productResultGroupItems__g7jzg ProductResult__noData__+dnF9">\n${cardsHtml}\n</ul>`);
    } else {
      // If no productResultGroupItems, look for any ul with productItem
      const ulItemRegex = /<ul[^>]*>[\s\S]*?<li[^>]*class=["'][^"']*productItem[^"']*["'][\s\S]*?<\/ul>/i;
      if (ulItemRegex.test(html)) {
        html = html.replace(ulItemRegex, `<ul class="ProductResult__productResultGroupItems__g7jzg ProductResult__noData__+dnF9">\n${cardsHtml}\n</ul>`);
      }
    }

    // Update total count badge in header
    html = html.replace(/<span[^>]*class=["'][^"']*filterDescription[^"']*["'][^>]*>[\s\S]*?<\/span>/i, 
      `<span class="ProductFilter__filterDescription__sU7L8 filterDescription">${skus.length} Sản phẩm</span>`
    );

    hubData.mainHtml = html;
    fs.writeFileSync(hubPath, JSON.stringify(hubData, null, 2));
  }

  // Also build gaming-handhelds-group and storage-group
  // 1. gaming-handhelds-group
  const allySkus = JSON.parse(fs.readFileSync(path.join(FILTERS_DIR, 'gaming-handhelds_220212.json'), 'utf8')).result?.skus || [];
  const allyAccSkus = JSON.parse(fs.readFileSync(path.join(FILTERS_DIR, 'gaming-handhelds-acc_220087.json'), 'utf8')).result?.skus || [];
  const allHandheldSkus = [...allySkus, ...allyAccSkus];
  const handheldCardsHtml = allHandheldSkus.map((sku, idx) => renderCard(sku, idx)).join('\n');

  const handheldHubPath = path.join(CACHE_DIR, 'gaming-handhelds-group.json');
  if (fs.existsSync(handheldHubPath)) {
    const hhData = JSON.parse(fs.readFileSync(handheldHubPath, 'utf8'));
    let hhHtml = hhData.mainHtml || '';
    if (hhHtml.includes('ProductResult__productResultGroupItems')) {
      hhHtml = hhHtml.replace(/<ul[^>]*class=["'][^"']*productResultGroupItems[^"']*["'][^>]*>[\s\S]*?<\/ul>/i, `<ul class="ProductResult__productResultGroupItems__g7jzg">\n${handheldCardsHtml}\n</ul>`);
    } else {
      hhHtml += `\n<div class="ProductResult__productResult__h4+6q"><ul class="ProductResult__productResultGroupItems__g7jzg">\n${handheldCardsHtml}\n</ul></div>`;
    }
    hhData.mainHtml = hhHtml;
    fs.writeFileSync(handheldHubPath, JSON.stringify(hhData, null, 2));
    console.log(`[Máy Chơi Game Cầm Tay] (gaming-handhelds-group) => Updated with ${allHandheldSkus.length} SKUs`);
  }

  // 2. storage-group
  const storageHubPath = path.join(CACHE_DIR, 'storage-group_allmodels.json');
  const storageCard1 = renderCard({
    mktName: 'ROG Strix Arion',
    name: 'ESD-S1C',
    partNo: '90DD02H0-M09000',
    productImgUrl: 'https://dlcdnwebimgs.asus.com/gain/0F2718E2-2CBE-4A63-9D27-A96417937A56/w717/h525',
    skuLink: '/vn/storage/rog-strix-arion-model/',
    keySpec: [
      { name: 'USB-C™ 3.2 Gen 2x1 cho tốc độ lên tới 10 Gbps' },
      { name: 'Hỗ trợ SSD M.2 PCIe NVM Express® chuẩn 2230/2242/2260/2280' },
      { name: 'Thiết kế nhôm nguyên khối tản nhiệt thụ động hiệu quả' },
      { name: 'Hệ thống đèn ASUS Aura Sync RGB độc quyền' }
    ]
  }, 0);
  const storageCard2 = renderCard({
    mktName: 'ROG Strix Arion EVA Edition',
    name: 'ESD-S1CL',
    partNo: '90DD02H0-M09001',
    productImgUrl: 'https://dlcdnwebimgs.asus.com/gain/3B330F6C-49F1-4F29-87D2-7E93BECC7109/w717/h525',
    skuLink: '/vn/storage/rog-strix-arion-eva-edition-model/',
    keySpec: [
      { name: 'Phiên bản giới hạn Evangelion Unit-01 đặc biệt' },
      { name: 'USB-C™ 3.2 Gen 2x1 cho tốc độ lên tới 10 Gbps' },
      { name: 'Hỗ trợ SSD M.2 PCIe NVM Express® 2230/2242/2260/2280' },
      { name: 'Đèn LED Aura Sync mang phong cách Evangelion' }
    ]
  }, 1);

  if (fs.existsSync(storageHubPath)) {
    const stData = JSON.parse(fs.readFileSync(storageHubPath, 'utf8'));
    let stHtml = stData.mainHtml || '';
    const stCards = `${storageCard1}\n${storageCard2}`;
    if (stHtml.includes('productResultGroupItems')) {
      stHtml = stHtml.replace(/<ul[^>]*class=["'][^"']*productResultGroupItems[^"']*["'][^>]*>[\s\S]*?<\/ul>/i, `<ul class="ProductResult__productResultGroupItems__g7jzg">\n${stCards}\n</ul>`);
    } else {
      stHtml += `\n<div class="ProductResult__productResult__h4+6q"><ul class="ProductResult__productResultGroupItems__g7jzg">\n${stCards}\n</ul></div>`;
    }
    stData.mainHtml = stHtml;
    fs.writeFileSync(storageHubPath, JSON.stringify(stData, null, 2));
    console.log(`[Ổ Cứng Di Động ROG] (storage-group) => Updated with 2 SKUs`);
  }

  console.log('\n================================================================');
  console.log(`  BUILD COMPLETE: ${grandTotal} AUTHENTIC PRODUCTS INTEGRATED! `);
  console.log('================================================================\n');
}

buildAll();
