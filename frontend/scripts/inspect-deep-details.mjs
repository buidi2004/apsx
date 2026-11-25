import { chromium } from 'playwright';

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

  console.log('Loading catalogs...');
  await Promise.all([
    pageRemote.goto('https://rog.asus.com/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('Remote note:', e.message)),
    pageLocal.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 30000 })
  ]);

  await pageRemote.waitForSelector('li.productItem', { timeout: 15000 });
  await pageLocal.waitForSelector('li.productItem', { timeout: 15000 });

  // A. Compare first card inner HTML / child elements
  const inspectCard = async (page, name) => {
    return await page.evaluate((name) => {
      const card = document.querySelector('ul.ProductResult__productResultGroupItems__g7jzg > li, li.productItem');
      if (!card) return { name, error: 'No card' };
      const children = Array.from(card.children).map(c => ({
        tag: c.tagName,
        className: c.className,
        height: c.offsetHeight,
        textPreview: c.textContent.trim().slice(0, 100)
      }));
      return {
        name,
        cardTotalHeight: card.offsetHeight,
        childCount: children.length,
        children,
        fullHtmlPreview: card.innerHTML.slice(0, 800)
      };
    }, name);
  };

  const remoteCard = await inspectCard(pageRemote, 'remote');
  const localCard = await inspectCard(pageLocal, 'local');
  console.log('\n--- REMOTE CARD STRUCTURE ---');
  console.log(JSON.stringify(remoteCard, null, 2));
  console.log('\n--- LOCAL CARD STRUCTURE ---');
  console.log(JSON.stringify(localCard, null, 2));

  // B. Filter sidebar inspect
  const inspectFilter = async (page, name) => {
    return await page.evaluate((name) => {
      const filterContainer = document.querySelector('[class*="Filter"], [class*="filter"]');
      if (!filterContainer) return { name, error: 'No filter container' };
      const allLabels = Array.from(filterContainer.querySelectorAll('label, [class*="option"], [class*="Item"], button')).map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.textContent.trim().replace(/\s+/g, ' ')
      })).filter(x => x.text.length > 0 && x.text.length < 50);

      return {
        name,
        filterClass: filterContainer.className,
        allLabels: allLabels.slice(0, 20)
      };
    }, name);
  };

  const remoteFilter = await inspectFilter(pageRemote, 'remote');
  const localFilter = await inspectFilter(pageLocal, 'local');
  console.log('\n--- REMOTE FILTER LABELS ---');
  console.log(JSON.stringify(remoteFilter, null, 2));
  console.log('\n--- LOCAL FILTER LABELS ---');
  console.log(JSON.stringify(localFilter, null, 2));

  // C. Detail page subbar inspect
  console.log('\nInspecting detail page subbar...');
  const detailUrl = 'vn/laptops/rog-zephyrus/rog-zephyrus-g16-2024-gu605/';
  await Promise.all([
    pageRemote.goto('https://rog.asus.com/' + detailUrl, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('Remote detail note:', e.message)),
    pageLocal.goto('http://localhost:3000/' + detailUrl, { waitUntil: 'networkidle', timeout: 30000 })
  ]);

  const inspectDetailPage = async (page, name) => {
    return await page.evaluate((name) => {
      // Find any navigation bar or subbar on page
      const navElements = Array.from(document.querySelectorAll('nav, [class*="nav"], [class*="TabBar"], [class*="tabBar"], [class*="subBar"], [class*="menu"], [class*="Menu"]'))
        .map(el => ({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          offsetHeight: el.offsetHeight,
          text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80)
        })).filter(x => x.text.length > 5);

      return {
        name,
        navElements: navElements.slice(0, 10)
      };
    }, name);
  };

  const remoteDetail = await inspectDetailPage(pageRemote, 'remote');
  const localDetail = await inspectDetailPage(pageLocal, 'local');
  console.log('\n--- REMOTE DETAIL NAV/SUBBAR ---');
  console.log(JSON.stringify(remoteDetail, null, 2));
  console.log('\n--- LOCAL DETAIL NAV/SUBBAR ---');
  console.log(JSON.stringify(localDetail, null, 2));

  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
