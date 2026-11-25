import { chromium } from 'playwright';
import fs from 'fs';

async function prepareCleanView(page) {
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    // Scroll slightly to trigger any lazy images in first 9 cards, then reset to top
    window.scrollTo(0, 600);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    // Dismiss cookie/location banners if present so screenshots compare product UI fairly
    document.querySelectorAll('#cookie-policy-info, .cc-window, [class*="locationreminder"], #locationreminder').forEach((el) => {
      el.style.display = 'none';
    });
  });
  await page.waitForTimeout(500);
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
  });

  const pageRemote = await context.newPage();
  const pageLocal = await context.newPage();

  fs.mkdirSync('.cache/visual-audit', { recursive: true });

  console.log('Capturing /vn/laptops-group/allmodels desktop screenshots...');
  await Promise.all([
    pageRemote.goto('https://rog.asus.com/vn/laptops-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 35000 }),
    pageLocal.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 30000 })
  ]);
  await Promise.all([prepareCleanView(pageRemote), prepareCleanView(pageLocal)]);

  await pageRemote.screenshot({ path: '.cache/visual-audit/catalog-remote.png', clip: { x: 0, y: 240, width: 1440, height: 1000 } });
  await pageLocal.screenshot({ path: '.cache/visual-audit/catalog-local.png', clip: { x: 0, y: 240, width: 1440, height: 1000 } });

  const remoteCards = pageRemote.locator('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem');
  const localCards = pageLocal.locator('ul.ProductResult__productResultGroupItems__g7jzg > li.productItem');
  if ((await remoteCards.count()) > 1 && (await localCards.count()) > 1) {
    await remoteCards.nth(1).screenshot({ path: '.cache/visual-audit/card-remote.png' });
    await localCards.nth(1).screenshot({ path: '.cache/visual-audit/card-local.png' });
  }

  console.log('Capturing /vn/mice-mouse-pads/mice-series screenshots...');
  await Promise.all([
    pageRemote.goto('https://rog.asus.com/vn/mice-mouse-pads/mice-series', { waitUntil: 'domcontentloaded', timeout: 35000 }),
    pageLocal.goto('http://localhost:3000/vn/mice-mouse-pads/mice-series', { waitUntil: 'domcontentloaded', timeout: 30000 })
  ]);
  await Promise.all([prepareCleanView(pageRemote), prepareCleanView(pageLocal)]);
  await pageRemote.screenshot({ path: '.cache/visual-audit/mice-remote.png', clip: { x: 0, y: 260, width: 1440, height: 900 } });
  await pageLocal.screenshot({ path: '.cache/visual-audit/mice-local.png', clip: { x: 0, y: 260, width: 1440, height: 900 } });

  console.log('Capturing /vn/laptops/rog-zephyrus/rog-zephyrus-g14-2024 detail subbar...');
  await Promise.all([
    pageRemote.goto('https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2024/', { waitUntil: 'domcontentloaded', timeout: 35000 }),
    pageLocal.goto('http://localhost:3000/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2024', { waitUntil: 'domcontentloaded', timeout: 30000 })
  ]);
  await Promise.all([prepareCleanView(pageRemote), prepareCleanView(pageLocal)]);

  const remoteSubbar = pageRemote.locator('#productTabBarContainer, [class*="ProductTabBar"]').first();
  const localSubbar = pageLocal.locator('#productTabBarContainer, [class*="ProductTabBar"]').first();
  if ((await remoteSubbar.count()) > 0 && (await localSubbar.count()) > 0) {
    await remoteSubbar.screenshot({ path: '.cache/visual-audit/subbar-remote.png' });
    await localSubbar.screenshot({ path: '.cache/visual-audit/subbar-local.png' });
  }

  // Mobile 390x844 capture + Compare drawer
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mobileCtx.newPage();
  await mPage.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mPage.waitForTimeout(1500);
  await mPage.locator('.ProductResult__mobileFilterButton__vF83w >> visible=true').first().click();
  await mPage.waitForTimeout(600);
  await mPage.screenshot({ path: '.cache/visual-audit/mobile-filter-drawer-local.png' });
  await mobileCtx.close();

  const { PNG } = await import('pngjs');
  const pixelmatch = (await import('pixelmatch')).default;

  const compareImages = (img1Path, img2Path, diffOutPath) => {
    if (!fs.existsSync(img1Path) || !fs.existsSync(img2Path)) return null;
    const img1 = PNG.sync.read(fs.readFileSync(img1Path));
    const img2 = PNG.sync.read(fs.readFileSync(img2Path));
    const width = Math.min(img1.width, img2.width);
    const height = Math.min(img1.height, img2.height);
    const c1 = new PNG({ width, height });
    const c2 = new PNG({ width, height });
    PNG.bitblt(img1, c1, 0, 0, width, height, 0, 0);
    PNG.bitblt(img2, c2, 0, 0, width, height, 0, 0);
    const diff = new PNG({ width, height });
    const mismatched = pixelmatch(c1.data, c2.data, diff.data, width, height, { threshold: 0.15 });
    fs.writeFileSync(diffOutPath, PNG.sync.write(diff));
    const total = width * height;
    const matchPercent = (((total - mismatched) / total) * 100).toFixed(2);
    return { width, height, mismatched, total, matchPercent };
  };

  console.log('\n=== VISUAL DIFF COMPARISON RESULTS ===');
  console.log('Catalog Grid Similarity:', compareImages('.cache/visual-audit/catalog-remote.png', '.cache/visual-audit/catalog-local.png', '.cache/visual-audit/catalog-diff.png'));
  console.log('Product Card Similarity:', compareImages('.cache/visual-audit/card-remote.png', '.cache/visual-audit/card-local.png', '.cache/visual-audit/card-diff.png'));
  console.log('Mice Series Similarity:', compareImages('.cache/visual-audit/mice-remote.png', '.cache/visual-audit/mice-local.png', '.cache/visual-audit/mice-diff.png'));
  console.log('Subbar Similarity:', compareImages('.cache/visual-audit/subbar-remote.png', '.cache/visual-audit/subbar-local.png', '.cache/visual-audit/subbar-diff.png'));

  await browser.close();
}

main().catch(e => {
  console.error('Fatal in capture-visual-audit:', e);
  process.exit(1);
});
