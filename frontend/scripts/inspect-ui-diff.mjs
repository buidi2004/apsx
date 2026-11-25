import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const pageRemote = await context.newPage();
  const pageLocal = await context.newPage();

  console.log('Navigating to Remote and Local catalogs...');
  await Promise.all([
    pageRemote.goto('https://rog.asus.com/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('Remote load note:', e.message)),
    pageLocal.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 30000 })
  ]);

  // Wait for product cards on both
  await pageRemote.waitForSelector('li.productItem, [class*="ProductResultItem__productItem"]', { timeout: 15000 }).catch(() => console.log('Remote card wait timeout'));
  await pageLocal.waitForSelector('li.productItem, [class*="ProductResultItem__productItem"]', { timeout: 15000 }).catch(() => console.log('Local card wait timeout'));

  // Compare first card computed styles
  const getCardStyles = async (page, name) => {
    return await page.evaluate((name) => {
      const card = document.querySelector('ul.ProductResult__productResultGroupItems__g7jzg > li, li.productItem');
      if (!card) return { name, error: 'Card not found' };
      const cs = window.getComputedStyle(card);
      const title = card.querySelector('[class*="productTitle"], h2, h3, [class*="Title"]');
      const titleCs = title ? window.getComputedStyle(title) : null;
      const price = card.querySelector('[class*="price"], [class*="Price"]');
      const priceCs = price ? window.getComputedStyle(price) : null;
      const img = card.querySelector('img');
      const compareBox = card.querySelector('input[type="checkbox"], [class*="compare"]');

      return {
        name,
        cardTag: card.tagName,
        cardClasses: card.className,
        width: cs.width,
        height: cs.height,
        background: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        border: cs.border,
        boxShadow: cs.boxShadow,
        display: cs.display,
        titleText: title ? title.textContent.trim() : null,
        titleFont: titleCs ? titleCs.fontFamily : null,
        titleSize: titleCs ? titleCs.fontSize : null,
        titleColor: titleCs ? titleCs.color : null,
        priceText: price ? price.textContent.trim() : null,
        priceFont: priceCs ? priceCs.fontFamily : null,
        priceColor: priceCs ? priceCs.color : null,
        hasImg: !!img,
        imgSrc: img ? img.src : null,
        hasCompareBox: !!compareBox
      };
    }, name);
  };

  const remoteCardStyles = await getCardStyles(pageRemote, 'remote');
  const localCardStyles = await getCardStyles(pageLocal, 'local');

  console.log('\n=== CARD COMPUTED STYLES COMPARISON ===');
  console.log('Remote Card:', JSON.stringify(remoteCardStyles, null, 2));
  console.log('Local Card:', JSON.stringify(localCardStyles, null, 2));

  // Compare Filter Sidebar structure
  const getFilterStyles = async (page, name) => {
    return await page.evaluate((name) => {
      const sidebar = document.querySelector('[class*="Filter__filter"], [class*="ProductFilter"]');
      if (!sidebar) return { name, error: 'Sidebar not found' };
      const groups = document.querySelectorAll('[class*="filterGroup"], [class*="FilterGroup"]');
      const checkBoxes = sidebar.querySelectorAll('input[type="checkbox"], [class*="checkbox"], [class*="Checkbox"]');
      const firstGroup = groups[0];
      const title = firstGroup ? firstGroup.querySelector('[class*="Title"], [class*="title"], h3, h4') : null;
      return {
        name,
        sidebarFound: true,
        groupCount: groups.length,
        checkboxCount: checkBoxes.length,
        firstGroupTitle: title ? title.textContent.trim() : null
      };
    }, name);
  };

  const remoteFilter = await getFilterStyles(pageRemote, 'remote');
  const localFilter = await getFilterStyles(pageLocal, 'local');

  console.log('\n=== FILTER SIDEBAR COMPARISON ===');
  console.log('Remote Filter:', JSON.stringify(remoteFilter, null, 2));
  console.log('Local Filter:', JSON.stringify(localFilter, null, 2));

  // Screenshots of cards & filter
  fs.mkdirSync('frontend/.cache/ui-diff', { recursive: true });

  const cardRemoteEl = await pageRemote.$('ul.ProductResult__productResultGroupItems__g7jzg > li, li.productItem');
  if (cardRemoteEl) {
    await cardRemoteEl.screenshot({ path: 'frontend/.cache/ui-diff/card-remote.png' });
    console.log('Saved card-remote.png');
  }
  const cardLocalEl = await pageLocal.$('ul.ProductResult__productResultGroupItems__g7jzg > li, li.productItem');
  if (cardLocalEl) {
    await cardLocalEl.screenshot({ path: 'frontend/.cache/ui-diff/card-local.png' });
    console.log('Saved card-local.png');
  }

  // Also full catalog screenshot at top
  await pageRemote.screenshot({ path: 'frontend/.cache/ui-diff/catalog-remote.png', clip: { x: 0, y: 0, width: 1440, height: 1200 } });
  await pageLocal.screenshot({ path: 'frontend/.cache/ui-diff/catalog-local.png', clip: { x: 0, y: 0, width: 1440, height: 1200 } });
  console.log('Saved catalog-remote.png and catalog-local.png');

  // Now Detail Page Comparison
  console.log('\nNavigating to Detail pages...');
  const detailUrl = 'vn/laptops/rog-zephyrus/rog-zephyrus-g16-2024-gu605/';
  await Promise.all([
    pageRemote.goto('https://rog.asus.com/' + detailUrl, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('Remote detail note:', e.message)),
    pageLocal.goto('http://localhost:3000/' + detailUrl, { waitUntil: 'networkidle', timeout: 30000 })
  ]);

  const getSubbarStyles = async (page, name) => {
    return await page.evaluate((name) => {
      const subbar = document.querySelector('#productTabBarContainer, [class*="ProductTabBar"]');
      if (!subbar) return { name, error: 'Subbar not found' };
      const cs = window.getComputedStyle(subbar);
      const tabs = Array.from(subbar.querySelectorAll('a, button, li')).map(t => t.textContent.trim()).filter(Boolean);
      return {
        name,
        subbarFound: true,
        display: cs.display,
        position: cs.position,
        top: cs.top,
        zIndex: cs.zIndex,
        tabs: tabs.slice(0, 8)
      };
    }, name);
  };

  const remoteSubbar = await getSubbarStyles(pageRemote, 'remote');
  const localSubbar = await getSubbarStyles(pageLocal, 'local');
  console.log('\n=== SUBBAR COMPARISON ===');
  console.log('Remote Subbar:', JSON.stringify(remoteSubbar, null, 2));
  console.log('Local Subbar:', JSON.stringify(localSubbar, null, 2));

  await pageRemote.screenshot({ path: 'frontend/.cache/ui-diff/detail-remote.png', clip: { x: 0, y: 0, width: 1440, height: 1200 } });
  await pageLocal.screenshot({ path: 'frontend/.cache/ui-diff/detail-local.png', clip: { x: 0, y: 0, width: 1440, height: 1200 } });
  console.log('Saved detail-remote.png and detail-local.png');

  await browser.close();
}

main().catch(err => {
  console.error('Fatal error in inspect-ui-diff:', err);
  process.exit(1);
});
