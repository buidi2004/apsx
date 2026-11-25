import fs from 'fs';
import path from 'path';
import { renderAuthenticCard } from './render-card-helper.mjs';

const ROOT = fs.existsSync(path.resolve('frontend/.cache/rog-catalog')) ? path.resolve('frontend') : process.cwd();
const CACHE_DIR = path.resolve(ROOT, '.cache/rog-catalog');
const FILTERS_DIR = path.resolve(ROOT, '.cache/rog-filters');
const PRICES_PATH = path.resolve(ROOT, '.cache/all-sku-prices.json');
const SEARCH_INDEX_PATH = path.resolve(ROOT, 'src/components/sites/rog-asus/universal/all-products-search-index.json');
const FACET_PUBLIC_PATH = path.resolve(ROOT, 'src/components/sites/rog-asus/universal/rog-facet-map.json');

fs.mkdirSync(FILTERS_DIR, { recursive: true });
fs.mkdirSync(CACHE_DIR, { recursive: true });

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
  'gaming-handhelds-acc': { id: 220087, hub: 'gaming-handhelds_accessories-series.json', name: 'Phụ Kiện Handhelds' },
  'docks-chargers-and-cables': { id: 247019, hub: 'docks-chargers-and-cables_chargers-series.json', name: 'Củ Sạc & Cáp' },
  'protection-and-gadgets': { id: 49670, hub: 'protection-and-gadgets_cases-and-protection-series.json', name: 'Phụ Kiện Bảo Vệ' },
  'apparel-bags-gear': { id: 2300, hub: 'apparel-bags-gear_bags-series.json', name: 'Trang Phục, Balo & Phụ Kiện' }
};

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
};

/**
 * Balanced HTML tag replacer: replaces the entire <tagName ...>...</tagName> element
 * matched by startRegex (counting nested open/close tags of the same tagName).
 */
function replaceBalancedElement(html, tagName, startRegex, renderReplacement) {
  const m = startRegex.exec(html);
  if (!m) return { html, replaced: false };

  const startIdx = m.index;
  const openTagEnd = html.indexOf('>', startIdx) + 1;
  const openTag = html.slice(startIdx, openTagEnd);

  const tagFinder = new RegExp(`<(\\/?)${tagName}\\b[^>]*>`, 'gi');
  tagFinder.lastIndex = startIdx;

  let depth = 0;
  let endIdx = -1;
  let match;
  while ((match = tagFinder.exec(html)) !== null) {
    if (match[1] === '/') {
      depth--;
      if (depth <= 0) {
        endIdx = match.index + match[0].length;
        break;
      }
    } else {
      depth++;
    }
  }

  if (endIdx === -1) return { html, replaced: false };
  const replacement = renderReplacement(openTag, html.slice(openTagEnd, endIdx - `</${tagName}>`.length));
  return {
    html: html.slice(0, startIdx) + replacement + html.slice(endIdx),
    replaced: true
  };
}

/** Clean SSR HTML snippet using identical rules as RogUniversalProductOverview.tsx */
function extractAndCleanSsr(rawHtml) {
  const titleMatch = rawHtml.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'ASUS Republic of Gamers';

  const cssMatches = [...rawHtml.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)];
  const cssLinks = cssMatches
    .map((m) => {
      let link = m[0];
      link = link.replace(/href=["']\/(?!\/)/g, 'href="https://rog.asus.com/');
      link = link.replace(/href=["']\/\/(dlcdn[^\s"'>]+)/g, 'href="https://$1');
      return link;
    })
    .filter(
      (l) =>
        !l.includes('2B37C5BC-FC31-4697-925A-6622E78C5CF9/dist/overview/css/overview.css') &&
        !l.includes('2B37C5BC-FC31-4697-925A-6622E78C5CF9/v4/css/features.css')
    );

  const styleMatches = [...rawHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  const styles = styleMatches.map((m) => m[1]);

  const mainStart = rawHtml.indexOf('<main');
  const mainEnd = rawHtml.lastIndexOf('</main>');
  let mainHtml = '';
  if (mainStart !== -1 && mainEnd !== -1) {
    mainHtml = rawHtml.slice(mainStart, mainEnd + 7);
  } else {
    const overviewIdx = rawHtml.indexOf('class="productOverview"');
    if (overviewIdx !== -1) {
      const startTag = rawHtml.lastIndexOf('<div', overviewIdx);
      const footerIdx = rawHtml.indexOf('<footer');
      mainHtml = rawHtml.slice(startTag, footerIdx !== -1 ? footerIdx : undefined);
    }
  }

  if (!mainHtml) return null;

  mainHtml = mainHtml.replace(/(src|data-src|poster)=["']\/(?!\/)([^"']+)["']/gi, '$1="https://rog.asus.com/$2"');
  mainHtml = mainHtml.replace(/(src|data-src|poster)=["']\/\/(dlcdn[^\s"'>]+)["']/gi, '$1="https://$2"');
  mainHtml = mainHtml.replace(/href=["']https:\/\/rog\.asus\.com\/vn\/([^"']+)["']/gi, 'href="/vn/$1"');
  mainHtml = mainHtml.replace(/href=["']\/(?!vn\/)(?!\/)([^"']+)["']/gi, 'href="https://rog.asus.com/$1"');

  // Fix lazy-loaded images & strip blank.gif
  mainHtml = mainHtml.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    const lazyMatch = attrs.match(/data-src=["']([^"']+)["']/i);
    if (lazyMatch && (!attrs.includes('src=') || attrs.includes('src=""') || attrs.includes('blank.gif'))) {
      newAttrs = newAttrs.replace(/src=["'][^"']*["']/gi, '');
      newAttrs += ` src="${lazyMatch[1]}"`;
    } else if (attrs.includes('blank.gif') && !lazyMatch) {
      newAttrs = newAttrs.replace(/src=["'][^"']*blank\.gif[^"']*["']/gi, 'src="/sites/rog-asus/img/hot/strix-scar-18.webp"');
    }
    return `<img ${newAttrs.trim()}>`;
  });

  mainHtml = mainHtml.replace(/<video\b([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('muted')) attrs += ' muted';
    if (!attrs.includes('playsinline')) attrs += ' playsinline';
    if (!attrs.includes('autoplay')) attrs += ' autoplay';
    if (!attrs.includes('loop')) attrs += ' loop';
    return `<video ${attrs}>`;
  });

  return { title, cssLinks, styles, mainHtml };
}

async function runPool(items, concurrency, fn) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function fetchAllFiltersWithPagination(tagId) {
  const firstRes = await fetch(
    `https://api-rog.asus.com/recent-data/api/v8/Filters?Page=1&Count=100&WebsiteCode=vn&LevelTagId=${tagId}&Sort=date&systemCode=rog`
  );
  const firstJson = await firstRes.json();
  const resObj = firstJson.result || {};
  const skus = [...(resObj.skus || [])];
  const totalCount = Number(resObj.skuCount || skus.length);

  let page = 2;
  while (skus.length < totalCount && page <= 10) {
    const nextRes = await fetch(
      `https://api-rog.asus.com/recent-data/api/v8/Filters?Page=${page}&Count=100&WebsiteCode=vn&LevelTagId=${tagId}&Sort=date&systemCode=rog`
    );
    const nextJson = await nextRes.json();
    const nextSkus = nextJson.result?.skus || [];
    if (nextSkus.length === 0) break;
    skus.push(...nextSkus);
    page++;
  }

  // Clean invalid skuLinks pointing to domain root
  for (const s of skus) {
    if (s.skuLink && /^https?:\/\/rog\.asus\.com\/?(?:vn\/?)?$/i.test(s.skuLink.trim())) {
      s.skuLink = `/vn/search?q=${encodeURIComponent(s.mktName || s.name || s.partNo || '')}`;
    }
  }

  return {
    result: {
      ...resObj,
      skus,
      skuCount: skus.length
    }
  };
}

async function main() {
  console.log('===================================================================');
  console.log('  PHASE 2: FULL REBUILD OF ALL SKUS, PRICES, FILTERS & SSR HTML');
  console.log('===================================================================\n');

  // STEP 1: Fetch all 21 categories (with full pagination)
  console.log('1) Fetching paginated Filters API across all 21 categories...');
  const catFilterData = {};
  const allUniqueSkusMap = new Map();

  for (const [catKey, cat] of Object.entries(TAG_MAP)) {
    const cacheFile = path.join(FILTERS_DIR, `${catKey}_${cat.id}.json`);
    let apiData = null;
    try {
      apiData = await fetchAllFiltersWithPagination(cat.id);
      fs.writeFileSync(cacheFile, JSON.stringify(apiData, null, 2));
    } catch (e) {
      if (fs.existsSync(cacheFile)) {
        apiData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      }
    }
    if (apiData?.result?.skus) {
      catFilterData[catKey] = apiData.result;
      for (const s of apiData.result.skus) {
        if (s.partNo && !allUniqueSkusMap.has(s.partNo)) {
          allUniqueSkusMap.set(s.partNo, s);
        }
      }
      console.log(`  [${catKey.padEnd(26)}] levelTag=${String(cat.id).padEnd(6)} => ${apiData.result.skus.length} SKUs`);
    }
  }
  console.log(`  => Total unique SKUs across all categories: ${allUniqueSkusMap.size}\n`);

  // STEP 2: Refresh live eStore prices in batches of 25
  console.log('2) Refreshing live eStore pricing via ASUS NoCache/SkuPrice API...');
  const existingPrices = fs.existsSync(PRICES_PATH) ? JSON.parse(fs.readFileSync(PRICES_PATH, 'utf8')) : {};
  const partNos = [...allUniqueSkusMap.keys()];
  const batches = [];
  for (let i = 0; i < partNos.length; i += 25) {
    batches.push(partNos.slice(i, i + 25));
  }

  let updatedPriceCount = 0;
  await runPool(batches, 8, async (batch) => {
    try {
      const r = await fetch('https://api-rog.asus.com/api/nc/v4/NoCache/SkuPrice?systemCode=rog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteCode: 'vn', skuWebPathName: batch.join(',') })
      });
      if (r.ok) {
        const j = await r.json();
        for (const item of j.result || []) {
          if (item.sku) {
            existingPrices[item.sku] = item;
            updatedPriceCount++;
          }
        }
      }
    } catch {}
  });
  fs.writeFileSync(PRICES_PATH, JSON.stringify(existingPrices, null, 2));
  console.log(`  => Refreshed prices for ${updatedPriceCount} SKUs (saved to all-sku-prices.json)\n`);

  // Rebuild all-products-search-index.json cleanly as well
  const searchIndex = [...allUniqueSkusMap.values()].map((s) => {
    const pr = existingPrices[s.partNo];
    const cleanLink = (s.skuLink || '#').replace(/^https:\/\/rog\.asus\.com/i, '');
    return {
      id: s.id,
      partNo: s.partNo,
      title: s.mktName || s.name || '',
      subName: s.name || '',
      img: s.productImgUrl || '',
      link: cleanLink.startsWith('/') ? cleanLink : `/vn/${cleanLink}`,
      price: pr?.price || '',
      specs: (s.keySpec || []).slice(0, 4).map((x) => x.name).join(' • ')
    };
  });
  fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchIndex, null, 2));
  console.log(`  => Updated all-products-search-index.json (${searchIndex.length} SKUs)\n`);

  // STEP 3: Fetch exact itemId -> partNo[] facet mappings for all active filter checkboxes
  console.log('3) Building exact itemId -> partNo[] facet mappings (Concurrency 16)...');
  const facetTasks = [];
  const facetMap = {
    generatedAt: new Date().toISOString(),
    byCategory: {},
    byItemId: {}
  };

  for (const [catKey, result] of Object.entries(catFilterData)) {
    const levelTagId = TAG_MAP[catKey].id;
    const groups = (result.chooseItem?.groups || []).map((g) => {
      const directItems = (g.items || []).filter((it) => it.count > 0);
      const subGroups = (g.subGroup || [])
        .map((sg) => ({
          subGroupId: sg.subGroupId,
          name: sg.name,
          items: (sg.items || []).filter((it) => it.count > 0).map((it) => ({
            itemId: it.itemId,
            name: it.name,
            isSeries: it.isSeries
          }))
        }))
        .filter((sg) => sg.items.length > 0);

      for (const it of directItems) {
        facetTasks.push({ catKey, levelTagId, itemId: it.itemId });
      }
      for (const sg of subGroups) {
        for (const it of sg.items) {
          facetTasks.push({ catKey, levelTagId, itemId: it.itemId });
        }
      }

      return {
        groupId: g.groupId,
        name: g.name,
        items: directItems.map((it) => ({ itemId: it.itemId, name: it.name, isSeries: it.isSeries })),
        subGroup: subGroups
      };
    }).filter((g) => g.items.length > 0 || g.subGroup.length > 0);

    facetMap.byCategory[catKey] = {
      levelTagId,
      name: TAG_MAP[catKey].name,
      totalSkus: result.skus.length,
      groups
    };
  }

  console.log(`  Querying ${facetTasks.length} active filter itemIds against live ASUS Filters API...`);
  let doneFacets = 0;
  await runPool(facetTasks, 16, async (t) => {
    try {
      const r = await fetch(
        `https://api-rog.asus.com/recent-data/api/v8/Filters?Page=1&Count=120&WebsiteCode=vn&LevelTagId=${t.levelTagId}&itemId=${t.itemId}&Sort=date&systemCode=rog`
      );
      if (r.ok) {
        const j = await r.json();
        const partList = (j.result?.skus || []).map((s) => s.partNo).filter(Boolean);
        facetMap.byItemId[String(t.itemId)] = partList;
      }
    } catch {}
    doneFacets++;
    if (doneFacets % 100 === 0) process.stdout.write(`  ...${doneFacets}/${facetTasks.length}\n`);
  });

  // Also inject item counts per itemId cleanly into byCategory
  for (const catObj of Object.values(facetMap.byCategory)) {
    for (const g of catObj.groups) {
      for (const it of g.items) {
        it.partNos = facetMap.byItemId[String(it.itemId)] || [];
        it.count = it.partNos.length;
      }
      g.items = g.items.filter((it) => it.count > 0);
      for (const sg of g.subGroup) {
        for (const it of sg.items) {
          it.partNos = facetMap.byItemId[String(it.itemId)] || [];
          it.count = it.partNos.length;
        }
        sg.items = sg.items.filter((it) => it.count > 0);
      }
      g.subGroup = g.subGroup.filter((sg) => sg.items.length > 0);
    }
    catObj.groups = catObj.groups.filter((g) => g.items.length > 0 || g.subGroup.length > 0);
  }

  fs.writeFileSync(path.join(FILTERS_DIR, 'facet-map.json'), JSON.stringify(facetMap, null, 2));
  fs.writeFileSync(FACET_PUBLIC_PATH, JSON.stringify(facetMap));
  console.log(`  => Built exact facet-map.json (${Object.keys(facetMap.byItemId).length} item mappings)\n`);

  // STEP 4: Rebuild ALL real listing/hub/series pages from clean fresh live SSR HTML + full SKUs!
  console.log('4) Fetching clean SSR HTML & rebuilding all allmodels/series listing caches...');
  const allCatalogFiles = fs
    .readdirSync(CACHE_DIR)
    .filter((f) => (f.endsWith('allmodels.json') || f.endsWith('-series.json')) && !f.startsWith('articles_') && !f.startsWith('tag_'))
    .sort();

  const targetFiles = [];
  for (const f of allCatalogFiles) {
    const oldData = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, f), 'utf8'));
    const h = oldData.mainHtml || '';
    // Keep legacy single-product pages ending in -series untouched
    if (h.includes('<div class="productOverview">')) continue;
    if (h.includes('ProductResult__') || h.includes('SeriesHome__') || h.includes('ProductFilter__')) {
      targetFiles.push(f);
    }
  }
  console.log(`  Identified ${targetFiles.length} listing/hub/series cache files to refresh cleanly.`);

  // Map series slugs -> matching itemId in category or exact SKU filter
  const HUB_FILES_MAP = new Map();
  for (const [catKey, cat] of Object.entries(TAG_MAP)) {
    HUB_FILES_MAP.set(cat.hub, { catKey, isFullHub: true });
  }
  // Additional group allmodels hubs that serve a sub-category or category alias
  HUB_FILES_MAP.set('gaming-handhelds_rog-ally-series.json', { catKey: 'gaming-handhelds', isFullHub: true });
  HUB_FILES_MAP.set('gaming-handhelds_accessories-series.json', { catKey: 'gaming-handhelds-acc', isFullHub: true });
  HUB_FILES_MAP.set('cooling_cpu-liquid-coolers-series.json', { catKey: 'cooling', isFullHub: false, pathPrefix: '/cooling/cpu-liquid-coolers/' });

  let rebuiltCount = 0;

  await runPool(targetFiles, 8, async (fileName) => {
    const urlPath = fileName.replace(/\.json$/, '').replace(/_/g, '/');
    const liveUrl = `https://rog.asus.com/vn/${urlPath}/`;
    const filePath = path.join(CACHE_DIR, fileName);

    let pageData = null;
    try {
      const res = await fetch(liveUrl, { headers: FETCH_HEADERS, signal: AbortSignal.timeout(20000) });
      if (res.ok) {
        const rawHtml = await res.text();
        pageData = extractAndCleanSsr(rawHtml);
      }
    } catch {}

    // Fallback to existing clean metadata if remote skipped
    if (!pageData) {
      pageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    let html = pageData.mainHtml || '';
    if (!html) return;

    // Determine category key from filename prefix
    let catKey = urlPath.split('/')[0].replace(/-group$/, '');
    if (fileName === 'gaming-handhelds_accessories-series.json') catKey = 'gaming-handhelds-acc';

    const catResult = catFilterData[catKey];
    let matchedSkus = [];

    const hubMeta = HUB_FILES_MAP.get(fileName);
    if (hubMeta && hubMeta.isFullHub && catFilterData[hubMeta.catKey]) {
      matchedSkus = catFilterData[hubMeta.catKey].skus;
    } else if (catResult) {
      const seriesSlug = urlPath.split('/').pop().replace(/-series$/, '').toLowerCase();
      // 1) Try matching facet item name against seriesSlug
      const catFacets = facetMap.byCategory[catKey];
      let matchedItemPartNos = null;
      if (catFacets) {
        for (const g of catFacets.groups) {
          for (const it of g.items) {
            const norm = it.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (norm === seriesSlug || norm.includes(seriesSlug) || seriesSlug.includes(norm)) {
              if (!matchedItemPartNos) matchedItemPartNos = new Set();
              it.partNos.forEach((p) => matchedItemPartNos.add(p));
            }
          }
          for (const sg of g.subGroup) {
            for (const it of sg.items) {
              const norm = it.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              if (norm === seriesSlug || norm.includes(seriesSlug) || seriesSlug.includes(norm)) {
                if (!matchedItemPartNos) matchedItemPartNos = new Set();
                it.partNos.forEach((p) => matchedItemPartNos.add(p));
              }
            }
          }
        }
      }

      // 2) Also match SKUs whose official skuLink path starts with /vn/<parentFolders>/
      const parentUrlPrefix = `/vn/${urlPath.replace(/-series$/, '')}/`.toLowerCase();
      const parentPrefixAlt = `/vn/${urlPath.split('/').slice(0, -1).join('/')}/${seriesSlug}/`.toLowerCase();
      const ssrPartNos = new Set([...html.matchAll(/<input[^>]*name=["']([A-Z0-9-]+)["']/gi)].map((m) => m[1]));

      matchedSkus = catResult.skus.filter((s) => {
        const sLink = (s.skuLink || '').replace(/^https:\/\/rog\.asus\.com/i, '').toLowerCase();
        if (sLink.startsWith(parentUrlPrefix) || sLink.startsWith(parentPrefixAlt)) return true;
        if (matchedItemPartNos && matchedItemPartNos.has(s.partNo)) return true;
        if (ssrPartNos.has(s.partNo)) return true;
        return false;
      });
    }

    // If matchedSkus found (> 0), cleanly replace ONLY the balanced product container!
    if (matchedSkus.length > 0) {
      const cardsHtml = matchedSkus.map((sku, idx) => renderAuthenticCard(sku, idx, existingPrices)).join('\n');

      let resReplace = replaceBalancedElement(
        html,
        'ul',
        /<ul[^>]*class=["'][^"']*productResultGroupItems[^"']*["'][^>]*>/i,
        (openTag) => `${openTag}\n${cardsHtml}\n</ul>`
      );

      if (!resReplace.replaced) {
        const seriesTagMatch = html.match(/<(div|ul)[^>]*class=["'][^"']*SeriesHome__seriesHomeGroupItems[^"']*["'][^>]*>/i);
        if (seriesTagMatch) {
          const tag = seriesTagMatch[1].toLowerCase();
          resReplace = replaceBalancedElement(
            html,
            tag,
            new RegExp(`<${tag}[^>]*class=["'][^"']*SeriesHome__seriesHomeGroupItems[^"']*["'][^>]*>`, 'i'),
            (openTag) => `${openTag}\n${cardsHtml}\n</${tag}>`
          );
        }
      }

      html = resReplace.html;

      // Update product counter headline WITHOUT touching .filterDescription SEO text!
      html = html.replace(
        /<h2([^>]*class=["'][^"']*filtersTotal[^"']*["'][^>]*)>[\s\S]*?<\/h2>/i,
        `<h2$1>${matchedSkus.length} Sản phẩm</h2>`
      );
    }

    // Stamp category metadata onto <main> so RogCatalogInteractive knows exact category & levelTagId
    const levelTagId = TAG_MAP[catKey]?.id || '';
    if (!html.includes('data-rog-cat=')) {
      html = html.replace(/<main\b([^>]*)>/i, `<main$1 data-rog-cat="${catKey}" data-rog-tag="${levelTagId}">`);
    } else {
      html = html.replace(/data-rog-cat="[^"]*"/i, `data-rog-cat="${catKey}"`);
    }

    pageData.mainHtml = html;
    fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2));
    rebuiltCount++;
    console.log(`  [OK] ${fileName.padEnd(55)} => ${matchedSkus.length} SKUs`);
  });

  // Also ensure storage-group_allmodels.json exists and is clean if linked directly
  const storageModelPath = path.join(CACHE_DIR, 'storage_rog-strix-arion-model.json');
  if (fs.existsSync(storageModelPath)) {
    const s = fs.readFileSync(storageModelPath, 'utf8');
    fs.writeFileSync(path.join(CACHE_DIR, 'storage-group_allmodels.json'), s);
  }

  console.log(`\n✅ PHASE 2 COMPLETE: Cleanly rebuilt ${rebuiltCount} catalog/series pages with balanced DOM & exact SKUs!`);
}

main().catch((err) => {
  console.error('Fatal error in Phase 2 rebuild:', err);
  process.exit(1);
});
