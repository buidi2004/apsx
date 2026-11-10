import http from 'http';
import fs from 'fs';

// Collect all unique internal hrefs from:
// 1. RogProductHome.tsx
// 2. RogNavbar.tsx
// 3. RogFooter.tsx
// 4. Cached catalog hubs
// 5. sitemap base products

const allHrefs = new Set();

function addHrefsFromText(text) {
  const matches = [...text.matchAll(/href=["'](\/vn\/[^"']+)["']/g)];
  for (const m of matches) {
    let u = m[1].replace(/#.*$/, '').replace(/\/$/, '');
    if (u) allHrefs.add(u);
  }
}

// 1. Source files
['src/components/sites/rog-asus/RogProductHome.tsx',
 'src/components/sites/rog-asus/RogNavbar.tsx',
 'src/components/sites/rog-asus/RogFooter.tsx',
 'src/app/vn/[...slug]/page.tsx'
].forEach(f => {
  if (fs.existsSync(f)) addHrefsFromText(fs.readFileSync(f, 'utf8'));
});

// 2. Cached catalog hubs
const cacheDir = '.cache/rog-catalog';
if (fs.existsSync(cacheDir)) {
  const files = fs.readdirSync(cacheDir).filter(f => f.includes('allmodels') || f.includes('series'));
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(`${cacheDir}/${file}`, 'utf8'));
      if (data.mainHtml) addHrefsFromText(data.mainHtml);
    } catch {}
  }
}

console.log(`Total unique internal /vn/ links discovered: ${allHrefs.size}`);

async function checkUrl(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      // Follow redirects (307, 308) once if needed
      if ((res.statusCode === 307 || res.statusCode === 308) && res.headers.location) {
        http.get(`http://localhost:3000${res.headers.location}`, (r2) => {
          resolve({ path, status: r2.statusCode, redirected: true });
        }).on('error', (e) => resolve({ path, status: e.message }));
      } else {
        resolve({ path, status: res.statusCode, redirected: false });
      }
    });
    req.on('error', (err) => resolve({ path, status: err.message }));
  });
}

// Test in batches of 20
const hrefArray = [...allHrefs];
const results = [];
const batchSize = 20;

for (let i = 0; i < hrefArray.length; i += batchSize) {
  const batch = hrefArray.slice(i, i + batchSize);
  const res = await Promise.all(batch.map(checkUrl));
  results.push(...res);
  process.stdout.write(`Tested ${Math.min(i + batchSize, hrefArray.length)}/${hrefArray.length} links...\r`);
}

console.log('\nAudit complete!');
const passed = results.filter(r => r.status === 200);
const failed = results.filter(r => r.status !== 200);

console.log(`\nResults: ${passed.length}/${results.length} PASSED (${((passed.length/results.length)*100).toFixed(1)}%)`);
if (failed.length > 0) {
  console.log(`\nFailed links (${failed.length}):`);
  console.table(failed);
} else {
  console.log('\nZERO BROKEN LINKS! 100% of all discovered internal links returned 200 OK.');
}

