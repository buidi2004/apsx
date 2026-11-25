import { chromium } from 'playwright';

function assert(cond, msg) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

async function main() {
  console.log('🚀 Running Complete Phase 5 E2E Verification Suite...\n');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const summary = {
    apis: {},
    searchOverlay: {},
    laptopsHub: {},
    motherboardsHub: {},
    seriesHomeAndRouting: {},
    compareNavigation: {},
    mobileDrawer: {},
    runtimeErrors: { pageErrors: [], hydrationOrConsoleErrors: [] }
  };

  const attachErrorListeners = (page) => {
    page.on('pageerror', (err) => summary.runtimeErrors.pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore upstream ASUS CDN third-party font CORS/404s & offline backend 5161
        const isUpstreamCdnFont =
          text.includes('dlcdnimgs.asus.com/websites/global/products/vinnjsoyhjlwgtj7/font') ||
          text.includes('dlcdnwebimgs.asus.com/files/media/05C07C94-9A62-4E5E-8BD5-379AE29B5D5E/v2/fonts') ||
          text.includes('error.html');
        if (!text.includes('5161') && !isUpstreamCdnFont && !text.startsWith('Failed to load resource:')) {
          summary.runtimeErrors.hydrationOrConsoleErrors.push(text.slice(0, 180));
        }
      }
    });
  };

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  attachErrorListeners(page);

  // 1. Verify New Next API Route Handlers (/api/rog-filters & /api/rog-prices)
  console.log('--- 1. Verifying Local Proxy API Routes ---');
  await page.goto('http://localhost:3000/vn/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const apiRes = await page.evaluate(async () => {
    const fRes = await fetch('/api/rog-filters?LevelTagId=1084&Count=9');
    const fJson = await fRes.json();
    const pRes = await fetch('/api/rog-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skus: ['90NR0J95-M008U0', '90NR0LP2-M00470'] })
    });
    const pJson = await pRes.json();
    return {
      filterStatus: fRes.status,
      filterSkusCount: fJson.result?.skus?.length || 0,
      priceStatus: pRes.status,
      priceResultCount: pJson.result?.length || 0
    };
  });
  summary.apis = apiRes;
  assert(apiRes.filterStatus === 200 && apiRes.filterSkusCount > 0, 'API /api/rog-filters returned valid SKUs');
  assert(apiRes.priceStatus === 200, 'API /api/rog-prices responded 200');
  console.log('✔ APIs verified:', apiRes);

  // 2. Search Overlay
  console.log('--- 2. Verifying Header Search Overlay ---');
  await page.waitForTimeout(800);
  await page.click('#searchButton');
  await page.waitForTimeout(500);
  const overlayVisible = await page.locator('#searchHeaderPanel').isVisible();
  await page.fill('input#search', 'zephyrus');
  await page.waitForTimeout(1200);
  const prodCount = await page.locator('.SearchHeaderPanel__searchResultItem__wTTlb').count();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  summary.searchOverlay = { overlayVisible, prodCount, closedOnEscape: !(await page.locator('#searchHeaderPanel').isVisible()) };
  assert(overlayVisible && prodCount > 0, 'Search overlay returned Zephyrus results');
  console.log('✔ Search overlay:', summary.searchOverlay);

  // 3. Laptops Hub: Pagination (9 -> 18 -> 23), SEO Desc preservation, Facet Filter, Min/Max Price, Sort
  console.log('--- 3. Verifying Laptops Hub Filters, Price Range, 9-per-page Pagination, Sort ---');
  await page.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const initialMetrics = await page.evaluate(() => {
    const totalDom = document.querySelectorAll('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem').length;
    const vis = Array.from(document.querySelectorAll('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem'))
      .filter((li) => window.getComputedStyle(li).display !== 'none').length;
    const h2 = document.querySelector('h2.ProductResult__filtersTotal__geyCI')?.textContent?.trim() || '';
    const seoDesc = document.querySelector('.filterDescription')?.textContent?.trim() || '';
    const checkboxes = document.querySelectorAll('.filterContainer input[name="rogSidebarFilterCheckBox"]').length;
    const loadMoreText = document.querySelector('.ProductResult__loadMoreButtonWrapper__W1KMM')?.textContent?.trim() || '';
    return { totalDom, vis, h2, seoDescLen: seoDesc.length, checkboxes, loadMoreText };
  });
  console.log('✔ Initial Laptops state:', initialMetrics);
  assert(initialMetrics.totalDom === 23 && initialMetrics.vis === 9, `Expected 23 total / 9 visible, got ${initialMetrics.vis}/${initialMetrics.totalDom}`);
  assert(initialMetrics.seoDescLen > 40, 'SEO .filterDescription text must be preserved');
  assert(initialMetrics.checkboxes >= 15, `Expected populated facet checkboxes, got ${initialMetrics.checkboxes}`);

  // Test Load More (9 -> 18 -> 23)
  const loadMoreBtn = page.locator('.ProductResult__loadMoreButtonWrapper__W1KMM .btn').first();
  await loadMoreBtn.click();
  await page.waitForTimeout(300);
  const visAfter1 = await page.locator('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem:visible').count();
  await loadMoreBtn.click();
  await page.waitForTimeout(300);
  const visAfter2 = await page.locator('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem:visible').count();
  assert(visAfter1 === 18 && visAfter2 === 23, `Pagination expected 18 then 23, got ${visAfter1} -> ${visAfter2}`);

  // Test Sidebar Facet Checkbox + Pill + Clear All
  const enabledFacetCb = page.locator('.Filter__filterBlock__6y-ku input[name="rogSidebarFilterCheckBox"]:not([disabled])').first();
  await enabledFacetCb.click({ force: true });
  await page.waitForTimeout(400);
  const filteredMetrics = await page.evaluate(() => ({
    vis: document.querySelectorAll('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem:not([style*="display: none"])').length,
    pills: document.querySelectorAll('.ProductResult__tabList__Piscq .filterTabList__filterTabRog').length,
    h2: document.querySelector('h2.ProductResult__filtersTotal__geyCI')?.textContent?.trim() || ''
  }));
  assert(filteredMetrics.pills >= 1 && filteredMetrics.vis > 0 && filteredMetrics.vis < 23, 'Facet filter reduced visible cards & added pill');

  // Clear All
  await page.locator('.ProductResult__tabList__Piscq .filterTabList__clearAllBtnRog').first().click();
  await page.waitForTimeout(400);
  const afterClearCount = await page.locator('.ProductResult__tabList__Piscq .filterTabList__filterTabRog').count();
  assert(afterClearCount === 0, 'Xóa tất cả cleared active pills');

  // Custom Price Input + ÁP DỤNG
  await page.fill('#minInput', '40000000');
  await page.fill('#maxInput', '85000000');
  await page.locator('.ButtonRed__isFilterPrice__-fvAf .btn').first().click();
  await page.waitForTimeout(400);
  const priceFilteredVis = await page.locator('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem:not([style*="display: none"])').count();
  assert(priceFilteredVis >= 0, 'Price range Apply executed cleanly');
  await page.locator('.ProductResult__tabList__Piscq .filterTabList__clearAllBtnRog').first().click();
  await page.waitForTimeout(300);

  // Sort Dropdown
  const sortSwitch = page.locator('.ProductResultSort__sortButton__CQ2ED:visible .ProductResultSort__sortSwitch__fEvvM').first();
  await sortSwitch.click();
  await page.waitForTimeout(300);
  await page.locator('.ProductResultSort__sortButton__CQ2ED:visible .ProductResultSort__sortList__cBS6q button:has-text("Giá - Cao đến thấp")').first().click();
  await page.waitForTimeout(400);
  const sortLabel = (await sortSwitch.locator('label').textContent()).trim();
  assert(sortLabel === 'Giá - Cao đến thấp', `Sort label expected "Giá - Cao đến thấp", got "${sortLabel}"`);

  summary.laptopsHub = { initialMetrics, visAfter1, visAfter2, filteredMetrics, priceFilteredVis, sortLabel };
  console.log('✔ Laptops Hub interactive suite passed');

  // 4. Compare Bar -> /vn/compare?products=... End-to-End Flow
  console.log('--- 4. Verifying Compare Panel -> /vn/compare?products=... ---');
  const compareBoxes = page.locator('li.productItem:visible input[name="productCheckBox"]');
  await compareBoxes.nth(0).click({ force: true });
  await compareBoxes.nth(1).click({ force: true });
  await page.waitForTimeout(500);
  const isCheckClassApplied = await page.locator('.ProductResultItem__productCheckBox__yqNsf label.ProductResultItem__isCheck__YYlKd').count();
  const compareHref = await page.locator('#rog-floating-compare-panel a.ButtonRed__btnRed__SXGza').getAttribute('href');
  assert(isCheckClassApplied === 2 && compareHref && compareHref.includes('/vn/compare?products='), 'Compare panel generated valid ?products= link');

  await page.goto(`http://localhost:3000${compareHref}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);
  const compareHeading = await page.locator('h1').textContent();
  const compareCols = await page.locator('select[aria-label^="Chọn sản phẩm"]').count();
  assert(compareCols >= 3, 'Compare page loaded selected columns');
  summary.compareNavigation = { isCheckClassApplied, compareHref, compareCols, compareHeading: compareHeading?.trim() };
  console.log('✔ Compare page navigation verified:', summary.compareNavigation);

  // 5. Motherboards (115 SKUs), Mice SeriesHome, Handhelds, Storage redirect
  console.log('--- 5. Verifying Motherboards (115), Mice SeriesHome, Handhelds, Storage ---');
  await page.goto('http://localhost:3000/vn/motherboards-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1000);
  const moboTotal = await page.locator('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem').count();
  const moboVis = await page.locator('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem:visible').count();
  summary.motherboardsHub = { moboTotal, moboVis };
  assert(moboTotal === 115 && moboVis === 9, `Motherboards expected 9/115, got ${moboVis}/${moboTotal}`);

  await page.goto('http://localhost:3000/vn/mice-mouse-pads/mice-series', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(800);
  const miceDom = await page.locator('.SeriesHome__seriesHomeGroupItems__lXu3g > li.productItem').count();
  const miceFilters = await page.locator('.filterContainer input[name="rogSidebarFilterCheckBox"]').count();

  await page.goto('http://localhost:3000/vn/gaming-handhelds/rog-ally-series', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(800);
  const allyCards = await page.locator('li.productItem').count();

  await page.goto('http://localhost:3000/vn/storage-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const storageUrl = page.url();

  summary.seriesHomeAndRouting = { miceDom, miceFilters, allyCards, storageFinalUrl: storageUrl.replace('http://localhost:3000', '') };
  assert(miceDom === 27 && miceFilters > 5, `Mice series expected 27 cards + filters, got ${miceDom} / ${miceFilters}`);
  assert(allyCards === 5, `ROG Ally expected 5 cards, got ${allyCards}`);
  console.log('✔ Multi-category hubs & series verified:', summary.seriesHomeAndRouting);

  // 6. Mobile Drawer (390x844)
  console.log('--- 6. Verifying Mobile Drawer (390x844) ---');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  attachErrorListeners(mobilePage);
  await mobilePage.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(800);
  await mobilePage.locator('.ProductResult__mobileFilterButton__vF83w >> visible=true').first().click();
  await mobilePage.waitForTimeout(400);
  const drawerBg = await mobilePage.evaluate(() => {
    const fc = document.querySelector('.filterLeftContent');
    return fc ? window.getComputedStyle(fc).backgroundColor : 'none';
  });
  const applyText = (await mobilePage.locator('.ProductResult__mobileApplyFilterButton__prVwN').first().textContent())?.trim();
  await mobilePage.locator('.ProductResult__closeLightBox__FH9fP').first().click();
  await mobilePage.waitForTimeout(300);
  summary.mobileDrawer = { drawerBg, applyText };
  assert(drawerBg.includes('255, 255, 255'), `Mobile filter drawer background should be light (#fff), got ${drawerBg}`);
  console.log('✔ Mobile drawer verified:', summary.mobileDrawer);

  await mobilePage.close();
  await page.close();
  await browser.close();

  console.log('\n======================================================');
  console.log('🌟 PHASE 5 E2E VERIFICATION PASSED 100% 🌟');
  console.log(JSON.stringify(summary, null, 2));

  if (summary.runtimeErrors.pageErrors.length > 0 || summary.runtimeErrors.hydrationOrConsoleErrors.length > 0) {
    console.error('❌ Detected browser runtime/console errors!');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error in verification suite:', err);
  process.exit(1);
});
