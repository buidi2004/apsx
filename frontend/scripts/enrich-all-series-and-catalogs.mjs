import fs from 'fs';
import path from 'path';
import { renderAuthenticCard as renderCard } from './render-card-helper.mjs';

const ROOT = fs.existsSync(path.resolve('frontend/.cache/rog-catalog')) ? path.resolve('frontend') : process.cwd();
const CACHE_DIR = path.resolve(ROOT, '.cache/rog-catalog');
const FILTERS_DIR = path.resolve(ROOT, '.cache/rog-filters');

async function main() {
  console.log('Enriching all series and sub-catalog files with authentic products...');

  // 1. Gather all SKUs from filters dir
  const allSkus = [];
  const filterFiles = fs.readdirSync(FILTERS_DIR).filter(f => f.endsWith('.json'));
  for (const ff of filterFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(FILTERS_DIR, ff), 'utf8'));
      const skus = data.result?.skus || [];
      allSkus.push(...skus);
    } catch {}
  }

  console.log(`Loaded ${allSkus.length} authentic SKUs from filters cache.`);

  // 2. Identify all series files in CACHE_DIR
  const allFiles = fs.readdirSync(CACHE_DIR);
  const seriesFiles = allFiles.filter(f => f.endsWith('-series.json') && !f.includes('articles'));

  let updatedSeriesCount = 0;

  for (const sf of seriesFiles) {
    const fullPath = path.join(CACHE_DIR, sf);
    let sData;
    try {
      sData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch {
      continue;
    }

    let html = sData.mainHtml || '';
    if (!html) continue;

    // Determine category and keyword
    const categoryPrefix = sf.split('_')[0];
    const cleanName = sf.replace('.json', '');
    let keyword = '';
    if (cleanName.includes('strix')) keyword = 'strix';
    else if (cleanName.includes('zephyrus')) keyword = 'zephyrus';
    else if (cleanName.includes('flow')) keyword = 'flow';
    else if (cleanName.includes('maximus')) keyword = 'maximus';
    else if (cleanName.includes('crosshair')) keyword = 'crosshair';
    else if (cleanName.includes('matrix')) keyword = 'matrix';
    else if (cleanName.includes('astral')) keyword = 'astral';
    else if (cleanName.includes('thor')) keyword = 'thor';
    else if (cleanName.includes('loki')) keyword = 'loki';
    else if (cleanName.includes('ryujin')) keyword = 'ryujin';
    else if (cleanName.includes('ryuo')) keyword = 'ryuo';
    else if (cleanName.includes('rapture')) keyword = 'rapture';
    else if (cleanName.includes('swift')) keyword = 'swift';
    else if (cleanName.includes('ally')) keyword = 'ally';

    if (!keyword) continue;

    // Filter SKUs matching keyword AND matching category prefix
    const matchingSkus = allSkus.filter(s => {
      const sLink = (s.skuLink || '').toLowerCase();
      const text = ((s.mktName || '') + ' ' + (s.name || '') + ' ' + sLink).toLowerCase();
      
      const matchCat = sLink.includes('/' + categoryPrefix + '/');
      const matchKw = text.includes(keyword);
      return matchCat && matchKw;
    });

    if (matchingSkus.length === 0) continue;

    // Check existing card links in series HTML
    const existingLinks = new Set();
    const existingMatches = [...html.matchAll(/href=["']\/vn\/([^"']+)["']/gi)];
    for (const em of existingMatches) {
      existingLinks.add(em[1].replace(/^\/+|\/+$/g, ''));
    }

    const missingSkus = matchingSkus.filter(s => {
      const sLink = (s.skuLink || '').replace('https://rog.asus.com', '').replace(/^\/+|\/+$/g, '');
      return !existingLinks.has(sLink);
    });

    if (missingSkus.length > 0) {
      console.log(`Series [${sf}] (${categoryPrefix} - '${keyword}'): adding ${missingSkus.length} missing SKUs (total matching: ${matchingSkus.length})`);
      
      const newCardsHtml = missingSkus.map((sku, idx) => renderCard(sku, 500 + idx)).join('\n');

      // Check if container is SeriesHome__seriesHomeGroupItems or ProductResult__productResultGroupItems
      if (html.includes('SeriesHome__seriesHomeGroupItems')) {
        html = html.replace(/(<div[^>]*class=["'][^"']*SeriesHome__seriesHomeGroupItems[^"']*["'][^>]*>)/i, `$1\n${newCardsHtml}\n`);
      } else if (html.includes('ProductResult__productResultGroupItems')) {
        html = html.replace(/(<ul[^>]*class=["'][^"']*ProductResult__productResultGroupItems[^"']*["'][^>]*>)/i, `$1\n${newCardsHtml}\n`);
      }

      sData.mainHtml = html;
      fs.writeFileSync(fullPath, JSON.stringify(sData, null, 2));
      updatedSeriesCount++;
    }
  }

  console.log(`\nEnrichment complete: updated ${updatedSeriesCount} series files with authentic category-scoped SKUs.`);
}

main();
