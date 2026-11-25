import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const localCard2 = page.locator('ul.ProductResult__productResultGroupItems__g7jzg > li').nth(1);
  if (await localCard2.count() > 0) {
    await localCard2.screenshot({ path: '.cache/visual-audit/card-local.png' });
    console.log('Saved updated card-local.png');
  }

  await page.screenshot({ path: '.cache/visual-audit/catalog-local.png', clip: { x: 0, y: 350, width: 1440, height: 1000 } });
  console.log('Saved updated catalog-local.png');

  await browser.close();
}

main().catch(console.error);
