import { chromium } from 'playwright';

async function runTests() {
  console.log('🚀 Starting deep verification of UX/UI, search, and all interactive buttons...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    search: {},
    catalogButtons: {},
    productDetailButtons: {},
    mobileDrawer: {}
  };

  // -------------------------------------------------------------
  // TEST 1: Search Overlay & Autocomplete on Desktop
  // -------------------------------------------------------------
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    console.log('\n--- 1. Testing Search Overlay on http://localhost:3000/vn/ ---');
    await page.goto('http://localhost:3000/vn/', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2000);

    // Locate search button in header
    const searchBtn = page.locator('#searchButton, button[aria-label="Search"], .Header__searchButton__NyfWa').first();
    const isSearchBtnVisible = await searchBtn.isVisible();
    results.search.searchButtonVisible = isSearchBtnVisible;
    console.log('Search button visible in navbar:', isSearchBtnVisible);

    if (isSearchBtnVisible) {
      await searchBtn.click();
      await page.waitForTimeout(1000);

      // Verify overlay opened
      const overlay = page.locator('.SearchHeaderPanel__searchBoxContainer__fM3U3, .SearchHeaderPanel__searchHeaderPanel__fVnQW').first();
      const isOverlayVisible = await overlay.isVisible();
      results.search.overlayOpened = isOverlayVisible;
      console.log('Search overlay opened:', isOverlayVisible);

      // Verify search input focused & typing works
      const searchInput = page.locator('input#search, input.SearchHeaderPanel__input__1-m07').first();
      await searchInput.fill('zephyrus');
      await page.waitForTimeout(1500);

      // Check product suggestions
      const productSuggestions = await page.locator('.SearchProductList__item__287Z5, [class*="SearchProductList__item"]').count();
      results.search.productSuggestionsCount = productSuggestions;
      console.log(`Found ${productSuggestions} product suggestions for "zephyrus"`);

      // Check article or FAQ suggestions
      const otherSuggestions = await page.locator('.SearchArticleList__item__YqYw9, [class*="SearchArticleList__item"]').count();
      results.search.otherSuggestionsCount = otherSuggestions;
      console.log(`Found ${otherSuggestions} article/other suggestions`);

      // Check text of first suggestion
      if (productSuggestions > 0) {
        const firstText = await page.locator('.SearchProductList__title__1mG5L, [class*="SearchProductList__title"]').first().textContent();
        console.log('First product suggestion title:', firstText.trim());
      }

      // Test pressing Escape to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      const isOverlayClosed = !(await overlay.isVisible());
      results.search.overlayClosedOnEscape = isOverlayClosed;
      console.log('Overlay closed on Escape:', isOverlayClosed);
    }
  } catch (err) {
    console.error('Error in Test 1 (Search):', err.message);
    results.search.error = err.message;
  }

  // -------------------------------------------------------------
  // TEST 2: Catalog Page Buttons (Sort, Compare Bar, Specs Accordion, Mua ngay)
  // -------------------------------------------------------------
  try {
    console.log('\n--- 2. Testing Catalog Buttons on http://localhost:3000/vn/laptops-group/allmodels ---');
    await page.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2000);

    // 2.1 Test Sort Dropdown
    const sortSwitch = page.locator('.ProductResultSort__sortSwitch__fEvvM, [class*="sortSwitch"]').first();
    if (await sortSwitch.isVisible()) {
      console.log('Sort dropdown switch visible. Clicking...');
      await sortSwitch.click();
      await page.waitForTimeout(500);

      // Check options
      const sortOptions = await page.locator('.ProductResultSort__sortList__a4eB2 li, [class*="sortList"] li').allTextContents();
      console.log('Sort options found:', sortOptions);

      // Click "Giá - Cao đến thấp"
      const highPriceOpt = page.locator('.ProductResultSort__sortList__a4eB2 li:has-text("Giá - Cao đến thấp"), [class*="sortList"] li:has-text("Giá - Cao đến thấp")').first();
      if (await highPriceOpt.isVisible()) {
        await highPriceOpt.click();
        await page.waitForTimeout(1000);
        console.log('Selected "Giá - Cao đến thấp".');
        results.catalogButtons.sortWorked = true;
      }
    } else {
      console.log('Sort switch not found or hidden.');
    }

    // 2.2 Test Compare Checkboxes and Floating Compare Panel
    console.log('Testing Compare Checkboxes...');
    const compareCheckboxes = page.locator('input[type="checkbox"][name="productFilterCheckBox"], input[name="productCheckBox"], .ProductResultItem__checkBoxCompare__2a-0V input');
    const checkboxCount = await compareCheckboxes.count();
    console.log(`Found ${checkboxCount} compare checkboxes.`);

    if (checkboxCount >= 2) {
      await compareCheckboxes.nth(0).click();
      await page.waitForTimeout(500);
      await compareCheckboxes.nth(1).click();
      await page.waitForTimeout(1000);

      const comparePanel = page.locator('#rog-floating-compare-panel, .ComparePanel__comparePanel__BycQ3.ComparePanel__active__RqFfs');
      const isCompareVisible = await comparePanel.isVisible();
      console.log('Floating Compare Panel visible:', isCompareVisible);
      results.catalogButtons.comparePanelVisible = isCompareVisible;

      if (isCompareVisible) {
        const compareItemsCount = await page.locator('.CompareItem__compareItem__cv1AL, [class*="CompareItem__compareItem"]').count();
        const compareButtonText = await page.locator('.ComparePanel__compareBtn__379y4, [class*="ComparePanel__compareBtn"]').first().textContent();
        console.log(`Compare items in bar: ${compareItemsCount}, CTA button: "${compareButtonText.trim()}"`);
        results.catalogButtons.compareItemsCount = compareItemsCount;
        results.catalogButtons.compareButtonText = compareButtonText.trim();

        // Click remove button on one item
        const removeBtn = page.locator('.CompareItem__deleteBtn__1fLq_, [class*="deleteBtn"]').first();
        if (await removeBtn.isVisible()) {
          await removeBtn.click();
          await page.waitForTimeout(500);
          const updatedCount = await page.locator('.CompareItem__compareItem__cv1AL, [class*="CompareItem__compareItem"]').count();
          console.log(`After removing 1 item, remaining items in compare bar: ${updatedCount}`);
          results.catalogButtons.compareRemoveWorked = (updatedCount === compareItemsCount - 1);
        }
      }
    }

    // 2.3 Test Specs Accordion Toggle ("Rút gọn / Xem thêm thông số")
    console.log('Testing Specs Accordion Toggle...');
    const specsToggle = page.locator('.seeAllButton__seeAllButton__dIrKX, [class*="seeAllButton"]').first();
    if (await specsToggle.isVisible()) {
      const initialText = await specsToggle.textContent();
      console.log('Initial specs toggle text:', initialText.trim());
      await specsToggle.click();
      await page.waitForTimeout(500);
      const afterClickText = await specsToggle.textContent();
      console.log('After click specs toggle text:', afterClickText.trim());
      results.catalogButtons.specsToggleWorked = (initialText !== afterClickText);
    }

    // 2.4 Test "Mua ngay" & "Xem thêm" card buttons
    const buyNowBtns = await page.locator('.ButtonRed__btnRed__SXGza, [class*="ButtonRed__btnRed"]').count();
    const learnMoreBtns = await page.locator('.ButtonBorderRed__btnBorderRed__zkcIA, [class*="ButtonBorderRed__btnBorderRed"]').count();
    console.log(`Card action buttons found: ${buyNowBtns} "Mua ngay" buttons, ${learnMoreBtns} "Xem thêm" buttons.`);
    results.catalogButtons.buyNowButtonsCount = buyNowBtns;
    results.catalogButtons.learnMoreButtonsCount = learnMoreBtns;

  } catch (err) {
    console.error('Error in Test 2 (Catalog):', err.message);
    results.catalogButtons.error = err.message;
  }

  // -------------------------------------------------------------
  // TEST 3: Mobile Viewport (390x844) & Filter Drawer
  // -------------------------------------------------------------
  try {
    console.log('\n--- 3. Testing Mobile Viewport (390x844) & Filter Drawer ---');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await mobilePage.waitForTimeout(2000);

    // Look for mobile filter button ("LỌC" or "FILTER")
    const filterBtn = mobilePage.locator('button.filter, button[class*="filterBtn" i], button:has-text("FILTER"), button:has-text("Lọc")').first();
    const isFilterVisible = await filterBtn.isVisible();
    console.log('Mobile Filter button visible:', isFilterVisible);
    results.mobileDrawer.filterButtonVisible = isFilterVisible;

    if (isFilterVisible) {
      await filterBtn.click();
      await mobilePage.waitForTimeout(1000);

      // Check if filter drawer/sidebar opened
      const drawer = mobilePage.locator('.ProductResultFilter__drawerActive, [class*="filterActive"], [class*="drawerActive"], .filterMask').first();
      const isDrawerOpen = await drawer.isVisible();
      console.log('Filter drawer opened on mobile:', isDrawerOpen);
      results.mobileDrawer.drawerOpened = isDrawerOpen;
    }
    await mobilePage.close();
  } catch (err) {
    console.error('Error in Test 3 (Mobile):', err.message);
    results.mobileDrawer.error = err.message;
  }

  // -------------------------------------------------------------
  // TEST 4: Product Detail Page Buttons & Subnav
  // -------------------------------------------------------------
  try {
    console.log('\n--- 4. Testing Product Detail Page on http://localhost:3000/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2024 ---');
    await page.goto('http://localhost:3000/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2024', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2000);

    const detailButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a[class*="btn" i], a[class*="Button" i], [role="button"]')).map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40),
        href: el.getAttribute('href')
      })).filter(b => b.text.length > 0);
      return buttons.slice(0, 15);
    });

    console.log('Product Detail Interactive Elements found:', detailButtons);
    results.productDetailButtons.elements = detailButtons;

    // Check Subbar navigation links (Tổng quan, Thông số kỹ thuật, etc.)
    const subbarLinks = await page.locator('[class*="subBar" i] a, [class*="SubBar" i] a, [class*="subnav" i] a').allTextContents();
    console.log('Product Subbar Links:', subbarLinks.map(s => s.trim()).filter(Boolean));
    results.productDetailButtons.subbarLinks = subbarLinks;

  } catch (err) {
    console.error('Error in Test 4 (Detail):', err.message);
    results.productDetailButtons.error = err.message;
  }

  await browser.close();

  console.log('\n================ TEST SUMMARY ================');
  console.log(JSON.stringify(results, null, 2));
}

runTests().catch(e => {
  console.error('Fatal in test runner:', e);
  process.exit(1);
});
