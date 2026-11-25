import { chromium } from 'playwright';
import fs from 'fs';

const targets = [
  '/vn/laptops-group',
  '/vn/laptops-group/allmodels',
  '/vn/laptops/rog-zephyrus-series',
  '/vn/laptops/rog-strix-series',
  '/vn/laptops/rog-flow-series',
  '/vn/graphics-cards/graphics-cards-series',
  '/vn/motherboards-group/allmodels',
  '/vn/monitors-group/allmodels',
  '/vn/gaming-handhelds-group',
  '/vn/gaming-handhelds/rog-ally-series',
  '/vn/gaming-handhelds/accessories-series',
  '/vn/keyboards/keyboards-series',
  '/vn/mice-mouse-pads/mice-series',
  '/vn/headsets-audio/headsets-series',
  '/vn/power-supply-units-group/allmodels',
  '/vn/cooling/cpu-liquid-coolers-series',
  '/vn/cases-group/allmodels',
  '/vn/networking-group/allmodels',
  '/vn/desktops-group/allmodels',
  '/vn/phones-group/allmodels',
  '/vn/apparel-bags-gear/bags-series'
];

async function inspectPage(page) {
  return page.evaluate(() => {
    const productLis = Array.from(document.querySelectorAll('li.productItem, li[class*="ProductResultItem__productItem__"]'));
    const visibleCards = productLis.filter(li => window.getComputedStyle(li).display !== 'none').length;
    const seen = new Set();
    let dupCount = 0;
    for (const li of productLis) {
      const key = li.getAttribute('data-partno') || `${li.querySelector('[class*="mktName"]')?.textContent?.trim()}|${li.querySelector('[class*="subName"]')?.textContent?.trim()}`;
      if (seen.has(key)) dupCount++;
      seen.add(key);
    }

    const filterGroups = Array.from(document.querySelectorAll('.Toggle__filterToggleName__JCEpr'))
      .map(e => e.textContent.trim().replace(/\s+/g, ' '));
    const populatedFilterInputs = document.querySelectorAll('.filterContainer .toggleList input[type="checkbox"]').length;
    const imgs = Array.from(document.querySelectorAll('main img'));
    const brokenImgs = imgs.filter(img => {
      const src = img.getAttribute('src') || '';
      return !src || src.includes('blank.gif') || (img.complete && img.naturalWidth === 0);
    }).length;
    const heading = document.querySelector('h1, .rog-ph-intro-title')?.textContent?.trim().replace(/\s+/g, ' ') || '';
    const seoDesc = document.querySelector('.filterDescription')?.textContent?.trim().slice(0, 60) || '';
    const filtersTotal = document.querySelector('h2.ProductResult__filtersTotal__geyCI')?.textContent?.trim().replace(/\s+/g, ' ') || '';
    const loadMoreBtn = document.querySelector('.ProductResult__loadMoreButtonWrapper__W1KMM, .SeriesHome__loadMoreButtonWrapper__ktKLE');
    const loadMoreVisible = loadMoreBtn ? window.getComputedStyle(loadMoreBtn).display !== 'none' : false;

    return {
      heading: heading.slice(0, 50),
      filtersTotal,
      seoDescOk: seoDesc.length > 15 && !/^\d+\s+Sản phẩm$/i.test(seoDesc),
      totalDomCards: productLis.length,
      visibleCards,
      uniqueProducts: seen.size,
      dupCards: dupCount,
      filterGroupsCount: filterGroups.length,
      populatedFilterInputs,
      brokenImgs,
      loadMoreVisible
    };
  });
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
  });

  const report = [];
  const pageR = await ctx.newPage();
  const pageL = await ctx.newPage();

  for (const t of targets) {
    const pageErrors = [];
    const consoleErrors = [];
    const onPageErr = (err) => pageErrors.push(err.message);
    const onConsole = (msg) => {
      if (msg.type() === 'error') {
        const txt = msg.text();
        if (!txt.includes('5161')) consoleErrors.push(txt.slice(0, 140));
      }
    };
    pageL.on('pageerror', onPageErr);
    pageL.on('console', onConsole);

    process.stdout.write(`Checking ${t.padEnd(42)} ... `);
    const [resR, resL] = await Promise.all([
      pageR.goto('https://rog.asus.com' + t, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => null),
      pageL.goto('http://localhost:3000' + t, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => null)
    ]);
    await pageR.waitForTimeout(2500);
    await pageL.waitForTimeout(1500);

    pageL.off('pageerror', onPageErr);
    pageL.off('console', onConsole);

    const statusR = resR ? resR.status() : 'ERR';
    const statusL = resL ? resL.status() : 'ERR';
    const statsR = await inspectPage(pageR).catch(e => ({ error: e.message }));
    const statsL = await inspectPage(pageL).catch(e => ({ error: e.message }));

    console.log(
      `R(${statusR}) vis=${statsR.visibleCards} total="${statsR.filtersTotal}" | L(${statusL}) vis=${statsL.visibleCards}/${statsL.totalDomCards} uniq=${statsL.uniqueProducts} dup=${statsL.dupCards} filters=${statsL.populatedFilterInputs} seo=${statsL.seoDescOk} brokenImg=${statsL.brokenImgs} errs=${pageErrors.length + consoleErrors.length}`
    );
    report.push({
      path: t,
      remote: { status: statusR, ...statsR },
      local: { status: statusL, pageErrors, consoleErrors, ...statsL }
    });
  }

  fs.mkdirSync('.cache/ui-diff', { recursive: true });
  fs.writeFileSync('.cache/ui-diff/live-vs-local-xem-them.json', JSON.stringify(report, null, 2));
  await browser.close();
  console.log('\nSaved full report to frontend/.cache/ui-diff/live-vs-local-xem-them.json');
}

main().catch(e => { console.error(e); process.exit(1); });
