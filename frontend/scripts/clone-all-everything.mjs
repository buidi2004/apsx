import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache', 'rog-catalog');
fs.mkdirSync(CACHE_DIR, { recursive: true });

// 1. Collect all URLs from product1.xml and category1.xml
const pXml = fs.readFileSync('.cache/product1.xml', 'utf8');
const pUrls = [...pXml.matchAll(/<loc>https:\/\/rog\.asus\.com\/vn\/([^<]+)\/<\/loc>/g)].map(m => m[1]);

const cXml = fs.readFileSync('.cache/category1.xml', 'utf8');
const cUrls = [...cXml.matchAll(/<loc>https:\/\/rog\.asus\.com\/vn\/([^<]+)\/<\/loc>/g)].map(m => m[1]);

const allUrls = [...new Set([...pUrls, ...cUrls])];
console.log(`Total unique URLs in ROG VN sitemaps: ${allUrls.length}`);

// 2. Identify remaining uncached URLs
const cachedFiles = fs.readdirSync(CACHE_DIR);
const cachedSet = new Set(cachedFiles.map(f => f.replace(/\.json$/, '')));

const uncached = allUrls.filter(u => {
  const cleanKey = u.replace(/[^a-zA-Z0-9-_]/g, '_');
  return !cachedSet.has(cleanKey);
});

console.log(`Already cached: ${cachedSet.size}`);
console.log(`Remaining uncached to clone: ${uncached.length}`);

if (uncached.length === 0) {
  console.log('ALL URLs ARE ALREADY 100% CACHED!');
  process.exit(0);
}

// 3. Parser function
function parseAndFormat(text) {
  const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'ASUS Republic of Gamers';

  const cssMatches = [...text.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)];
  const cssLinks = cssMatches.map((m) => {
    let link = m[0];
    link = link.replace(/href=["']\/(?!\/)/g, 'href="https://rog.asus.com/');
    link = link.replace(/href=["']\/\/(dlcdn[^\s"'>]+)/g, 'href="https://$1');
    return link;
  });

  const styleMatches = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  const styles = styleMatches.map((m) => m[1]);

  const mainStart = text.indexOf('<main');
  const mainEnd = text.lastIndexOf('</main>');
  let mainHtml = '';
  if (mainStart !== -1 && mainEnd !== -1) {
    mainHtml = text.slice(mainStart, mainEnd + 7);
  } else {
    const overviewIdx = text.indexOf('class="productOverview"');
    if (overviewIdx !== -1) {
      const startTag = text.lastIndexOf('<div', overviewIdx);
      const footerIdx = text.indexOf('<footer');
      mainHtml = text.slice(startTag, footerIdx !== -1 ? footerIdx : undefined);
    }
  }

  if (!mainHtml) return null;

  mainHtml = mainHtml.replace(
    /(src|data-src|poster)=["']\/(?!\/)([^"']+)["']/gi,
    '$1="https://rog.asus.com/$2"'
  );
  mainHtml = mainHtml.replace(
    /(src|data-src|poster)=["']\/\/(dlcdn[^\s"'>]+)["']/gi,
    '$1="https://$2"'
  );

  mainHtml = mainHtml.replace(
    /href=["']https:\/\/rog\.asus\.com\/vn\/([^"']+)["']/gi,
    'href="/vn/$1"'
  );
  mainHtml = mainHtml.replace(
    /href=["']\/(?!vn\/)(?!\/)([^"']+)["']/gi,
    'href="https://rog.asus.com/$1"'
  );

  mainHtml = mainHtml.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    const lazyMatch = attrs.match(/data-src=["']([^"']+)["']/i);
    if (lazyMatch && (!attrs.includes('src=') || attrs.includes('src=""') || attrs.includes('blank.gif'))) {
      newAttrs = newAttrs.replace(/src=["'][^"']*["']/i, '');
      newAttrs += ` src="${lazyMatch[1]}"`;
    }
    return `<img ${newAttrs}>`;
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

// 4. Concurrency pool
const CONCURRENCY = 25;
let completed = 0;
let failed = 0;
let skipped = 0;
const total = uncached.length;
const startTime = Date.now();

async function downloadUrl(relUrl) {
  const cleanKey = relUrl.replace(/[^a-zA-Z0-9-_]/g, '_');
  const cacheFile = path.join(CACHE_DIR, `${cleanKey}.json`);

  if (fs.existsSync(cacheFile)) {
    skipped++;
    return;
  }

  const targetUrl = `https://rog.asus.com/vn/${relUrl}/`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8',
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        failed++;
        return;
      }

      const text = await res.text();
      const parsed = parseAndFormat(text);

      if (parsed) {
        fs.writeFileSync(cacheFile, JSON.stringify(parsed));
        completed++;
      } else {
        failed++;
      }
      return;
    } catch {
      if (attempt === 2) {
        failed++;
      }
    }
  }
}

async function worker(iterator) {
  for (const [index, relUrl] of iterator) {
    await downloadUrl(relUrl);
    const count = completed + failed + skipped;
    if (count % 50 === 0 || count === total) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const speed = (count / (Date.now() - startTime) * 1000).toFixed(1);
      console.log(`[${count}/${total}] (${((count/total)*100).toFixed(1)}%) - OK: ${completed}, Failed: ${failed}, Skipped: ${skipped} (${speed} req/s, ${elapsed}s)`);
    }
  }
}

const iterator = uncached.entries();
const workers = Array.from({ length: CONCURRENCY }, () => worker(iterator));

await Promise.all(workers);

const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n==============================================`);
console.log(`CLONING COMPLETE!`);
console.log(`Total processed: ${total}`);
console.log(`Successfully cached: ${completed}`);
console.log(`Failed / Not Found: ${failed}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total cache files in directory: ${fs.readdirSync(CACHE_DIR).length}`);
console.log(`Elapsed time: ${totalTime}s`);
console.log(`==============================================`);

