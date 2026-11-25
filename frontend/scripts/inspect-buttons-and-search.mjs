import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to official ASUS ROG Vietnam home page...');
  await page.goto('https://rog.asus.com/vn/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  // 1. Inspect Search Button and Search UI
  const searchButtonInfo = await page.evaluate(async () => {
    // Find search button in header
    const searchBtn = document.querySelector('button[aria-label*="search" i], button[aria-label*="Search" i], [class*="search" i], [id*="search" i]');
    const allSearchButtons = Array.from(document.querySelectorAll('button, a')).filter(el => {
      const label = (el.getAttribute('aria-label') || el.className || el.id || '').toLowerCase();
      return label.includes('search') || el.querySelector('svg[class*="search" i], [class*="Search"]');
    }).map(el => ({
      tag: el.tagName,
      id: el.id,
      className: el.className,
      ariaLabel: el.getAttribute('aria-label'),
      outerHtml: el.outerHTML.slice(0, 300)
    }));

    return { allSearchButtons };
  });

  console.log('Search Buttons found in header:', JSON.stringify(searchButtonInfo, null, 2));

  // Try clicking search button to see what modal/input opens
  const searchClickResult = await page.evaluate(async () => {
    const searchTrigger = document.querySelector('button[aria-label="Search"], [class*="Header__searchBtn"], [class*="searchButton"]');
    if (searchTrigger) {
      searchTrigger.click();
      await new Promise(r => setTimeout(r, 1000));
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Tìm" i], input[placeholder*="Search" i], [class*="searchInput"]');
      const searchModal = document.querySelector('[class*="searchModal"], [class*="SearchModal"], [class*="searchOverlay"], [class*="SearchOverlay"], [class*="searchBox"], [class*="SearchBox"]');
      return {
        clicked: true,
        inputFound: !!searchInput,
        inputHtml: searchInput ? searchInput.outerHTML : null,
        modalFound: !!searchModal,
        modalClass: searchModal ? searchModal.className : null,
        modalHtml: searchModal ? searchModal.outerHTML.slice(0, 1000) : null
      };
    }
    return { clicked: false };
  });

  console.log('Search Click Result:', JSON.stringify(searchClickResult, null, 2));

  // If search input exists, type "zephyrus" and inspect autocomplete/suggestions
  if (searchClickResult.inputFound) {
    await page.fill('input[type="search"], input[placeholder*="Tìm" i], input[placeholder*="Search" i], [class*="searchInput"]', 'zephyrus');
    await page.waitForTimeout(2000);
    const searchSuggestions = await page.evaluate(() => {
      const suggestItems = Array.from(document.querySelectorAll('[class*="suggest" i], [class*="searchResult" i], [class*="autocomplete" i], [class*="SearchItem"]')).map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80)
      }));
      return suggestItems.slice(0, 10);
    });
    console.log('Search Suggestions for "zephyrus":', JSON.stringify(searchSuggestions, null, 2));
  }

  // 2. Now navigate to catalog page to inspect all buttons
  console.log('\nNavigating to catalog page to inspect all buttons...');
  await page.goto('https://rog.asus.com/vn/laptops-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  const catalogButtons = await page.evaluate(() => {
    // Collect all distinct button types on catalog page
    const buttons = Array.from(document.querySelectorAll('button, a.btn, [role="button"]')).map(btn => {
      const cs = window.getComputedStyle(btn);
      return {
        tag: btn.tagName,
        className: btn.className,
        role: btn.getAttribute('role'),
        text: btn.textContent.trim().replace(/\s+/g, ' ').slice(0, 40),
        width: cs.width,
        height: cs.height,
        background: cs.backgroundColor,
        color: cs.color,
        border: cs.border,
        borderRadius: cs.borderRadius,
        clipPath: cs.clipPath,
        cursor: cs.cursor
      };
    });

    // Deduplicate by className
    const unique = {};
    for (const b of buttons) {
      if (b.className && !unique[b.className]) {
        unique[b.className] = b;
      }
    }
    return Object.values(unique);
  });

  console.log('\n=== ALL UNIQUE BUTTON STYLES ON CATALOG PAGE ===');
  console.table(catalogButtons);

  // 3. Test Compare Bar (when 2 checkboxes are checked)
  console.log('\nTesting Compare Checkbox and Compare Bar...');
  const compareBarInfo = await page.evaluate(async () => {
    const checkboxes = document.querySelectorAll('input[name="productFilterCheckBox"], input[name="productCheckBox"], .checkBoxCompare');
    if (checkboxes.length >= 2) {
      checkboxes[0].click();
      checkboxes[1].click();
      await new Promise(r => setTimeout(r, 1000));
      const compareBar = document.querySelector('[class*="compareBar"], [class*="CompareBar"], [class*="compareContent"], [class*="CompareContent"], [class*="productCompare"]');
      return {
        checked2: true,
        compareBarFound: !!compareBar,
        compareBarClass: compareBar ? compareBar.className : null,
        compareBarHtml: compareBar ? compareBar.outerHTML.slice(0, 800) : null
      };
    }
    return { error: 'Not enough checkboxes' };
  });

  console.log('Compare Bar Result:', JSON.stringify(compareBarInfo, null, 2));

  // 4. Test Sort Dropdown
  const sortInfo = await page.evaluate(() => {
    const sortBtn = document.querySelector('[class*="sortSwitch"], [class*="SortSwitch"], select[name*="sort"]');
    const sortOptions = Array.from(document.querySelectorAll('select[name*="sort"] option, [class*="sortItem"], [class*="SortItem"]')).map(o => o.textContent.trim());
    return {
      sortFound: !!sortBtn,
      sortClass: sortBtn ? sortBtn.className : null,
      sortOptions
    };
  });
  console.log('Sort Dropdown Info:', JSON.stringify(sortInfo, null, 2));

  await browser.close();
}

main().catch(e => {
  console.error('Fatal in inspect-buttons-and-search:', e);
  process.exit(1);
});
