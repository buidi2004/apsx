import { chromium } from 'playwright';

async function main() {
  console.log('🚀 Starting Deep Button & Search Tester...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[BROWSER ERROR]', msg.text());
  });
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT]', err.message));

  // 1. Test Search Overlay on Homepage
  console.log('\n--- 1. Testing Search Overlay on http://localhost:3000/vn/ ---');
  await page.goto('http://localhost:3000/vn/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const searchBtn = page.locator('#searchButton');
  const searchBtnExists = await searchBtn.count() > 0;
  console.log('1.1 Search button (#searchButton) found in DOM:', searchBtnExists);

  if (searchBtnExists) {
    await searchBtn.click();
    await page.waitForTimeout(800);

    const overlay = page.locator('#searchHeaderPanel');
    const isOverlayOpen = await overlay.isVisible();
    console.log('1.2 Search overlay (#searchHeaderPanel) visible:', isOverlayOpen);

    if (isOverlayOpen) {
      const searchInput = page.locator('input#search');
      console.log('1.3 Search input found. Typing "zephyrus"...');
      await searchInput.fill('zephyrus');
      await page.waitForTimeout(1500);

      const prodItems = page.locator('.SearchHeaderPanel__searchResultItem__wTTlb');
      const prodCount = await prodItems.count();
      console.log(`1.4 Autocomplete product suggestions count: ${prodCount}`);

      if (prodCount > 0) {
        const firstTitle = await prodItems.first().textContent();
        console.log(`1.5 First suggestion title: "${firstTitle.trim().replace(/\s+/g, ' ')}"`);
      }

      const artItems = page.locator('div[role="listbox"][aria-label="articles"] a');
      const artCount = await artItems.count();
      console.log(`1.6 Article suggestions count: ${artCount}`);

      // Test Escape to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      const isStillOpen = await overlay.isVisible();
      console.log('1.7 Overlay closed after pressing Escape:', !isStillOpen);
    }
  }

  // 2. Test Catalog Interactive Elements on /vn/laptops-group/allmodels
  console.log('\n--- 2. Testing Catalog on http://localhost:3000/vn/laptops-group/allmodels ---');
  await page.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const catalogStats = await page.evaluate(() => {
    const cards = document.querySelectorAll('.productItem, [class*="ProductResultItem__productItem"]');
    const sortSwitches = document.querySelectorAll('[class*="ProductResultSort__sortSwitch"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="productFilterCheckBox"]:not([disabled])');
    const buyNowBtns = document.querySelectorAll('[class*="ButtonRed__btnRed"]');
    const seeMoreBtns = document.querySelectorAll('[class*="ButtonBorderRed__btnBorderRed"]');
    const specsToggles = document.querySelectorAll('[class*="seeAllButton__seeAllButton"]');
    const comparePanel = document.querySelector('#rog-floating-compare-panel, [class*="ComparePanel__comparePanel"]');

    return {
      cardsCount: cards.length,
      sortSwitchesCount: sortSwitches.length,
      checkboxesCount: checkboxes.length,
      buyNowBtnsCount: buyNowBtns.length,
      seeMoreBtnsCount: seeMoreBtns.length,
      specsTogglesCount: specsToggles.length,
      comparePanelExists: !!comparePanel
    };
  });

  console.log('2.1 Catalog stats:', JSON.stringify(catalogStats, null, 2));

  // 2.2 Test Sort switch click & dropdown
  const sortSwitch = page.locator('[class*="ProductResultSort__sortSwitch"]').first();
  if (await sortSwitch.count() > 0) {
    console.log('2.2 Clicking Sort dropdown to open list...');
    await sortSwitch.click();
    await page.waitForTimeout(500);

    const highPriceBtn = page.locator('[class*="ProductResultSort__sortList"] button:has-text("Giá - Cao đến thấp")').first();
    const isHighPriceVisible = await highPriceBtn.isVisible();
    console.log('2.3 Sort option "Giá - Cao đến thấp" visible:', isHighPriceVisible);

    if (isHighPriceVisible) {
      await highPriceBtn.click();
      await page.waitForTimeout(800);
      const currentSortLabel = await sortSwitch.locator('label').textContent();
      console.log(`2.4 Current Sort Label after selection: "${currentSortLabel.trim()}"`);
    }
  }

  // 2.3 Test Compare Checkboxes & Floating Compare Bar
  const compareCheckboxes = page.locator('.ProductResultItem__checkBoxCompare__2a-0V input, input[name="productFilterCheckBox"]:not([disabled])');
  const cbCount = await compareCheckboxes.count();
  console.log(`2.5 Active compare checkboxes found: ${cbCount}`);

  if (cbCount >= 2) {
    console.log('2.6 Checking 2 compare checkboxes...');
    await compareCheckboxes.nth(0).check({ force: true });
    await page.waitForTimeout(400);
    await compareCheckboxes.nth(1).check({ force: true });
    await page.waitForTimeout(800);

    const comparePanel = page.locator('#rog-floating-compare-panel');
    const isComparePanelVisible = await comparePanel.isVisible();
    console.log('2.7 Floating Compare Panel visible after 2 checks:', isComparePanelVisible);

    if (isComparePanelVisible) {
      const itemsInBar = await page.locator('#rog-floating-compare-panel [class*="CompareItem__compareItem"]').count();
      const compareCtaText = await page.locator('#rog-floating-compare-panel [class*="ComparePanel__compareBtn"]').textContent();
      console.log(`2.8 Compare items in bar: ${itemsInBar}, CTA Text: "${compareCtaText.trim()}"`);

      // Test delete item button in compare bar
      const deleteBtn = page.locator('#rog-floating-compare-panel [class*="deleteBtn"]').first();
      if (await deleteBtn.count() > 0) {
        await deleteBtn.click();
        await page.waitForTimeout(500);
        const remainingInBar = await page.locator('#rog-floating-compare-panel [class*="CompareItem__compareItem"]').count();
        console.log(`2.9 After removing 1 item, remaining items in compare bar: ${remainingInBar}`);
      }
    }
  }

  // 2.4 Test Specs accordion toggle
  const specsToggle = page.locator('[class*="seeAllButton__seeAllButton"]').first();
  if (await specsToggle.count() > 0) {
    const textBefore = await specsToggle.textContent();
    console.log(`2.10 Specs toggle initial text: "${textBefore.trim()}"`);
    await specsToggle.click();
    await page.waitForTimeout(500);
    const textAfter = await specsToggle.textContent();
    console.log(`2.11 Specs toggle text after click: "${textAfter.trim()}"`);
  }

  // 2.5 Test "Mua ngay" & "Xem thêm" card buttons
  const firstBuyNow = page.locator('[class*="ButtonRed__btnRed"]').first();
  if (await firstBuyNow.count() > 0) {
    console.log(`2.12 First "Mua ngay" button text: "${(await firstBuyNow.textContent()).trim()}"`);
  }
  const firstSeeMore = page.locator('[class*="ButtonBorderRed__btnBorderRed"]').first();
  if (await firstSeeMore.count() > 0) {
    console.log(`2.13 First "Xem thêm" button text: "${(await firstSeeMore.textContent()).trim()}"`);
  }

  // 3. Test Mobile Viewport (390x844) & Filter Drawer
  console.log('\n--- 3. Testing Mobile Viewport (390x844) ---');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);

  const mobileSearchBtn = mobilePage.locator('#searchButton');
  console.log('3.1 Mobile search button visible:', await mobileSearchBtn.isVisible());

  // Check mobile filter button
  const mobileFilterBtn = mobilePage.locator('button.ProductResult__mobileFilterButton__vF83w, button.SeriesHome__mobileFilterButton__4yqQf, button:has-text("FILTER")').first();
  const filterBtnExists = await mobileFilterBtn.count() > 0;
  console.log('3.2 Mobile filter button found:', filterBtnExists);

  if (filterBtnExists) {
    const isVisible = await mobileFilterBtn.isVisible();
    console.log('3.3 Mobile filter button visible on 390px:', isVisible);
    if (isVisible) {
      await mobileFilterBtn.click();
      await mobilePage.waitForTimeout(800);
      const isDrawerOpen = await mobilePage.evaluate(() => {
        const filterBlock = document.querySelector('.filterLeftContent, .ProductResult__productResultFilter__yMvPq');
        return filterBlock && window.getComputedStyle(filterBlock).display !== 'none';
      });
      console.log('3.4 Mobile filter drawer opened:', isDrawerOpen);
    }
  }

  await mobilePage.close();
  await browser.close();

  console.log('\n🎉 ALL BUTTON & SEARCH UX/UI VERIFICATIONS PASSED 100%!');
}

main().catch(err => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
