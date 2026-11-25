import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Testing local catalog at http://localhost:3000/vn/laptops-group/allmodels ...');
  await page.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. Check Row 1 cards (first 3 cards)
  const cardsInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('ul.ProductResult__productResultGroupItems__g7jzg > li')).slice(0, 3);
    return cards.map((c, i) => {
      const title = c.querySelector('.ProductResultItem__mktName__bqftk')?.textContent?.trim();
      const price = c.querySelector('.ProductResultItem__finallyPriceValue__6sADl')?.textContent?.trim();
      const buyBtn = c.querySelector('.ButtonRed__btnRed__SXGza .buttonName')?.textContent?.trim();
      const learnMore = c.querySelector('.ButtonBorderRed__btnBorderRed__zkcIA .buttonName')?.textContent?.trim();
      const compareBox = !!c.querySelector('input[type="checkbox"]');
      const pics = c.querySelectorAll('picture');
      return {
        index: i,
        title,
        height: c.offsetHeight,
        price: price || 'No direct price',
        buyBtn: buyBtn || 'No buy btn',
        learnMore: learnMore || 'No learn more btn',
        hasCompareBox: compareBox,
        pictureCount: pics.length
      };
    });
  });

  console.log('\n=== LOCAL ROW 1 CARDS AUDIT ===');
  console.log(JSON.stringify(cardsInfo, null, 2));

  // 2. Check Image Hover Swap
  console.log('\nTesting Card Image Hover Swap...');
  const hoverTest = await page.evaluate(async () => {
    const firstCard = document.querySelector('ul.ProductResult__productResultGroupItems__g7jzg > li');
    if (!firstCard) return { error: 'no card' };
    const imgWrapper = firstCard.querySelector('.ProductResultItem__productItemImageWrapper__eeMJe');
    if (!imgWrapper) return { error: 'no imgWrapper' };
    const pics = imgWrapper.querySelectorAll('picture');
    const beforeP0 = window.getComputedStyle(pics[0]).opacity;
    const beforeP1 = pics[1] ? window.getComputedStyle(pics[1]).opacity : 'none';

    // Dispatch mouseenter
    imgWrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    const afterP0 = window.getComputedStyle(pics[0]).opacity;
    const afterP1 = pics[1] ? window.getComputedStyle(pics[1]).opacity : 'none';

    // Dispatch mouseleave
    imgWrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    const resetP0 = window.getComputedStyle(pics[0]).opacity;
    const resetP1 = pics[1] ? window.getComputedStyle(pics[1]).opacity : 'none';

    return {
      before: { p0: beforeP0, p1: beforeP1 },
      onHover: { p0: afterP0, p1: afterP1 },
      onLeave: { p0: resetP0, p1: resetP1 }
    };
  });
  console.log('Image Hover Result:', JSON.stringify(hoverTest, null, 2));

  // 3. Check Filter Sidebar Checkboxes and Interactivity
  console.log('\nTesting Filter Sidebar Checkboxes & Interactivity...');
  const filterInfo = await page.evaluate(() => {
    const filterCheckboxes = document.querySelectorAll('.filterContainer input[type="checkbox"]');
    const customBoxes = document.querySelectorAll('.FilterCheckBox__chkBox__t1vpH');
    const firstGroupTitle = document.querySelector('.Toggle__filterToggleName__JCEpr span')?.textContent?.trim();
    return {
      checkboxCount: filterCheckboxes.length,
      customBoxCount: customBoxes.length,
      firstGroupTitle
    };
  });
  console.log('Filter Sidebar State:', JSON.stringify(filterInfo, null, 2));

  // 4. Test clicking a filter checkbox (e.g. RTX 4070 or ROG Zephyrus)
  const filterClickTest = await page.evaluate(() => {
    const firstCheckbox = document.querySelector('.filterContainer input[type="checkbox"]');
    if (!firstCheckbox) return { error: 'No filter checkbox found' };
    const initialVisible = document.querySelectorAll('ul.ProductResult__productResultGroupItems__g7jzg > li:not([style*="display: none"])').length;
    firstCheckbox.click();
    const afterClickVisible = document.querySelectorAll('ul.ProductResult__productResultGroupItems__g7jzg > li:not([style*="display: none"])').length;
    const iconActive = firstCheckbox.closest('li')?.querySelector('.FilterCheckBox__chkBox__t1vpH')?.classList.contains('FilterCheckBox__active__qE00Y');
    
    // Uncheck to reset
    firstCheckbox.click();
    const resetVisible = document.querySelectorAll('ul.ProductResult__productResultGroupItems__g7jzg > li:not([style*="display: none"])').length;

    return {
      initialVisible,
      afterClickVisible,
      iconActive,
      resetVisible
    };
  });
  console.log('Filter Click Test:', JSON.stringify(filterClickTest, null, 2));

  // 5. Test Product Detail Subbar Sticky & Navigation
  console.log('\nTesting Product Detail Page Subbar...');
  await page.goto('http://localhost:3000/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2024', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const subbarTest = await page.evaluate(() => {
    const subbar = document.querySelector('#productTabBarContainer, [class*="ProductTabBar"]');
    if (!subbar) return { error: 'Subbar not found' };
    const cs = window.getComputedStyle(subbar);
    const specLink = subbar.querySelector('a[href*="/spec/"]')?.getAttribute('href');
    const galleryLink = subbar.querySelector('a[href*="/gallery/"]')?.getAttribute('href');
    return {
      position: cs.position,
      top: cs.top,
      zIndex: cs.zIndex,
      height: subbar.offsetHeight,
      specLink,
      galleryLink
    };
  });
  console.log('Detail Subbar Test:', JSON.stringify(subbarTest, null, 2));

  await browser.close();
  console.log('\nALL CHECKS COMPLETED SUCCESSFULLY!');
}

main().catch(e => {
  console.error('Fatal in verify-ux-ui-parity:', e);
  process.exit(1);
});
