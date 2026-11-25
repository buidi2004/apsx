import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const pageRemote = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pageLocal = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Loading remote catalog...');
  await pageRemote.goto('https://rog.asus.com/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 45000 });
  await pageRemote.waitForSelector('li.productItem', { timeout: 15000 });

  console.log('Loading local catalog...');
  await pageLocal.goto('http://localhost:3000/vn/laptops-group/allmodels', { waitUntil: 'networkidle', timeout: 30000 });
  await pageLocal.waitForSelector('li.productItem', { timeout: 15000 });

  // 1. Dump Card HTML
  const remoteCardHtml = await pageRemote.evaluate(() => {
    const c = document.querySelector('ul.ProductResult__productResultGroupItems__g7jzg > li');
    return c ? c.outerHTML : '';
  });
  const localCardHtml = await pageLocal.evaluate(() => {
    const c = document.querySelector('ul.ProductResult__productResultGroupItems__g7jzg > li');
    return c ? c.outerHTML : '';
  });
  fs.writeFileSync('.cache/ui-diff/remote-first-card.html', remoteCardHtml);
  fs.writeFileSync('.cache/ui-diff/local-first-card.html', localCardHtml);
  console.log('Wrote remote-first-card.html and local-first-card.html');

  // 2. Inspect filter sidebar on remote
  const remoteFilterInfo = await pageRemote.evaluate(() => {
    // Find all sidebar elements
    const sidebars = Array.from(document.querySelectorAll('aside, [class*="Filter_"], [class*="filter_"], [class*="ProductFilter"]')).map(el => ({
      tag: el.tagName,
      className: el.className,
      id: el.id,
      textPreview: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 150)
    }));
    return sidebars;
  });
  console.log('Remote sidebars:', JSON.stringify(remoteFilterInfo, null, 2));

  // 3. Inspect detail page on remote
  console.log('Loading detail pages...');
  const detailUrl = 'vn/laptops/rog-zephyrus/rog-zephyrus-g16-2024-gu605/';
  await pageRemote.goto('https://rog.asus.com/' + detailUrl, { waitUntil: 'networkidle', timeout: 45000 });
  await pageLocal.goto('http://localhost:3000/' + detailUrl, { waitUntil: 'networkidle', timeout: 30000 });

  const remoteDetailInfo = await pageRemote.evaluate(() => {
    const title = document.title;
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const stickyEls = Array.from(document.querySelectorAll('*')).filter(el => {
      const pos = window.getComputedStyle(el).position;
      return pos === 'sticky' || pos === 'fixed';
    }).map(el => ({
      tag: el.tagName,
      id: el.id,
      className: el.className,
      position: window.getComputedStyle(el).position,
      top: window.getComputedStyle(el).top,
      height: el.offsetHeight,
      text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 100)
    })).filter(x => x.height > 0);

    return { title, h1, stickyEls };
  });

  const localDetailInfo = await pageLocal.evaluate(() => {
    const title = document.title;
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const stickyEls = Array.from(document.querySelectorAll('*')).filter(el => {
      const pos = window.getComputedStyle(el).position;
      return pos === 'sticky' || pos === 'fixed';
    }).map(el => ({
      tag: el.tagName,
      id: el.id,
      className: el.className,
      position: window.getComputedStyle(el).position,
      top: window.getComputedStyle(el).top,
      height: el.offsetHeight,
      text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 100)
    })).filter(x => x.height > 0);

    return { title, h1, stickyEls };
  });

  console.log('Remote detail sticky els:', JSON.stringify(remoteDetailInfo, null, 2));
  console.log('Local detail sticky els:', JSON.stringify(localDetailInfo, null, 2));

  await browser.close();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
