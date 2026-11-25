import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outDir = path.join(process.cwd(), 'public', 'screenshots-audit');
  fs.mkdirSync(outDir, { recursive: true });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Capture Search Overlay
  console.log('Capturing Search Overlay screenshot...');
  await page.goto('http://localhost:3000/vn/', { waitUntil: 'networkidle' });
  await page.click('#searchButton');
  await page.waitForTimeout(600);
  await page.fill('input#search', 'zephyrus');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '01-search-overlay-autocomplete.png') });

  // 2. Capture Catalog with Floating Compare Panel
  console.log('Capturing Catalog with Compare Panel screenshot...');
  await page.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const cbs = page.locator('input[id^="checkbox-"]');
  await cbs.nth(0).click();
  await page.waitForTimeout(400);
  await cbs.nth(1).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '02-catalog-floating-compare-panel.png') });

  // 3. Capture Mobile Filter Drawer
  console.log('Capturing Mobile Filter Drawer screenshot...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);
  const filterBtn = mobilePage.locator('button.ProductResult__mobileFilterButton__vF83w, button.SeriesHome__mobileFilterButton__4yqQf, button:has-text("FILTER")').first();
  if (await filterBtn.isVisible()) {
    await filterBtn.click();
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: path.join(outDir, '03-mobile-filter-drawer.png') });
  }

  await mobilePage.close();
  await browser.close();
  console.log('✔ All screenshots saved to public/screenshots-audit/');
}

main().catch(console.error);
