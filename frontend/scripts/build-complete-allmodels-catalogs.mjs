import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.resolve('.cache/rog-catalog');

const CATEGORIES = [
  { id: 'laptops', hub: 'laptops-group_allmodels.json', prefix: 'laptops_' },
  { id: 'monitors', hub: 'monitors-group_allmodels.json', prefix: 'monitors_' },
  { id: 'motherboards', hub: 'motherboards-group_allmodels.json', prefix: 'motherboards_' },
  { id: 'graphics-cards', hub: 'graphics-cards_graphics-cards-series.json', prefix: 'graphics-cards_' },
  { id: 'keyboards', hub: 'keyboards_keyboards-series.json', prefix: 'keyboards_' },
  { id: 'mice-mouse-pads', hub: 'mice-mouse-pads_mice-series.json', prefix: 'mice-mouse-pads_' },
  { id: 'headsets-audio', hub: 'headsets-audio_headsets-series.json', prefix: 'headsets-audio_' },
  { id: 'power-supply-units', hub: 'power-supply-units-group_allmodels.json', prefix: 'power-supply-units_' },
  { id: 'cooling', hub: 'cooling_cpu-liquid-coolers-series.json', prefix: 'cooling_' },
  { id: 'cases', hub: 'cases-group_allmodels.json', prefix: 'cases_' },
  { id: 'networking', hub: 'networking-group_allmodels.json', prefix: 'networking_' },
  { id: 'controllers', hub: 'controllers-group_allmodels.json', prefix: 'controllers_' },
  { id: 'streaming-kits', hub: 'streaming-kits-group_allmodels.json', prefix: 'streaming-kits_' },
  { id: 'phones', hub: 'phones-group_allmodels.json', prefix: 'phones_' },
  { id: 'desktops', hub: 'desktops-group_allmodels.json', prefix: 'desktops_' },
  { id: 'external-graphics-docks', hub: 'external-graphics-docks-group_allmodels.json', prefix: 'external-graphics-docks_' }
];

function buildCard(num, title, sku, url, thumb, specs = []) {
  const specItems = specs.map(s => `<li style="display:;"><p>${s}</p></li>`).join('\n');
  return `
<li data-number="${num}" class="productItem ProductResultItem__productItem__Wc51h">
  <div tabindex="0" role="button" aria-label="${title}" class="ProductResultItem__productItemImage__ha34S ProductResultItem__isECSite__jaAKc">
    <div class="ProductResultItem__productItemImageWrapper__eeMJe">
      <a aria-hidden="true" tabindex="-1" href="${url}" class="ProductResultItem__productItemLink__mbXkd">
        <picture class="ProductResultItem__show__K8KZO">
          <img src="${thumb}" alt="${title}" loading="lazy" style="width: 100%; aspect-ratio: 717/525; object-fit: contain;">
        </picture>
      </a>
    </div>
  </div>
  <div class="ProductResultItem__productBadge__R7+Nc"></div>
  <div class="ProductResultItem__productItemTitle__75icn ProductResultItem__subTitle__NpiB7">
    <a href="${url}"><span class="ProductResultItem__mktName__bqftk">${title}</span></a>
  </div>
  ${sku ? `<div tabindex="0" role="button" aria-label="${sku}" class="ProductResultItem__productItemTitle__75icn"><a href="${url}"><span class="ProductResultItem__subName__Y3lzj">${sku}</span></a></div>` : ''}
  <div class="ProductResultItem__productItemWrapper__+TBGp">
    <div class="ProductResultItem__productItemContent__k1c74">
      <div class="ProductResultItem__productItemIntroduction__Mh6XZ ProductResultItem__active__q75dC">
        <ul class="ProductResultItem__keySpecItems__wR8pI">
          ${specItems}
        </ul>
      </div>
    </div>
  </div>
  <div class="ProductResultItem__productItemButtons__2Z9tQ" style="display: flex; gap: 8px; margin-top: 14px;">
    <a href="${url}" class="btn ButtonBorderRed__btnBorderRed__zkcIA ButtonBorderRed__isRed__NoKph ButtonBorderRed__maxWidth__3+GoD ButtonBorderRed__isFilter__SONNI ButtonBorderRed__isLearnMore__RFCmc" style="flex: 1; text-align: center; text-decoration: none; padding: 10px; border: 1px solid #ff0036; color: #ff0036; font-weight: 700; text-transform: uppercase; font-size: 13px;">
      <span>XEM THÊM</span>
    </a>
  </div>
</li>
  `.trim();
}

async function processCategory(cat) {
  const hubPath = path.join(CACHE_DIR, cat.hub);
  if (!fs.existsSync(hubPath)) {
    console.warn(`Hub file not found: ${cat.hub}`);
    return;
  }

  let hubData;
  try {
    hubData = JSON.parse(fs.readFileSync(hubPath, 'utf8'));
  } catch {
    return;
  }

  let html = hubData.mainHtml || '';

  // Extract all existing product links from hub
  const existingUrls = new Set();
  const existingMatches = [...html.matchAll(/href=["']\/vn\/([^"']+)["']/gi)];
  for (const m of existingMatches) {
    existingUrls.add(m[1].replace(/^\/+|\/+$/g, ''));
  }

  // Find all candidate product files
  const allFiles = fs.readdirSync(CACHE_DIR);
  const prodFiles = allFiles.filter(f => 
    f.startsWith(cat.prefix) && 
    !f.includes('_spec') && 
    !f.includes('_award') && 
    !f.includes('_gallery') && 
    !f.includes('_wtb') && 
    !f.includes('_helpdesk') &&
    f !== cat.hub
  );

  const newCards = [];
  let nextNum = 100;

  for (const pf of prodFiles) {
    try {
      const pData = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, pf), 'utf8'));
      const slug = pf.replace(/\.json$/, '').replace(/_/g, '/');
      const cleanSlug = slug.replace(/^\/+|\/+$/g, '');

      if (existingUrls.has(cleanSlug)) continue;
      existingUrls.add(cleanSlug);

      const title = pData.title?.split('|')[0]?.trim() || cleanSlug.split('/').pop() || 'ROG Product';
      
      // Find thumbnail
      let thumb = 'https://dlcdnwebimgs.asus.com/gain/BF78DF19-AA0C-4464-B21B-CB1393BD6570/w717/h525';
      const imgMatch = pData.mainHtml?.match(/<img[^>]+src=["'](https:\/\/[^"']+\/(?:w717|h525|large|medium)[^"']*)["']/i) ||
                       pData.mainHtml?.match(/<img[^>]+src=["'](https:\/\/[^"']+\.(?:png|webp|jpg))["']/i);
      if (imgMatch) {
        thumb = imgMatch[1];
      }

      // Extract specs or bullets
      const specMatches = [...(pData.mainHtml?.matchAll(/<(?:li|p|h4)\b[^>]*>([^<]{10,80})<\/(?:li|p|h4)>/gi) || [])].map(m => m[1].trim());
      const filteredSpecs = specMatches.filter(s => 
        !s.includes('ASUS') && 
        !s.includes('Cookie') && 
        !s.includes('Privacy') && 
        !s.includes('Republic') && 
        !s.includes('JavaScript')
      ).slice(0, 4);

      if (filteredSpecs.length === 0) {
        filteredSpecs.push('ASUS ROG Gaming Flagship Series');
        filteredSpecs.push('Hiệu năng gaming đỉnh cao thế hệ mới');
        filteredSpecs.push('Tản nhiệt thông minh ROG Intelligent Cooling');
      }

      const cardHtml = buildCard(nextNum++, title, '', `/vn/${cleanSlug}`, thumb, filteredSpecs);
      newCards.push(cardHtml);
    } catch {
      // ignore
    }
  }

  if (newCards.length > 0) {
    // Inject new cards into the ul
    const ulCloseIdx = html.lastIndexOf('</ul>');
    if (ulCloseIdx !== -1) {
      html = html.slice(0, ulCloseIdx) + '\n' + newCards.join('\n') + '\n' + html.slice(ulCloseIdx);
      hubData.mainHtml = html;
      fs.writeFileSync(hubPath, JSON.stringify(hubData));
      console.log(`[ENRICHED] ${cat.id}: Added ${newCards.length} missing product cards!`);
    }
  } else {
    console.log(`[OK] ${cat.id}: Already has full products.`);
  }
}

async function main() {
  console.log('========================================================');
  console.log('  ENRICHING ALL "XEM THÊM" HUBS WITH FULL PRODUCT CARDS  ');
  console.log('========================================================\n');

  for (const cat of CATEGORIES) {
    await processCategory(cat);
  }

  console.log('\nAll catalog hubs enriched successfully!');
}

main().catch(console.error);
