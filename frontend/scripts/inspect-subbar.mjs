import { chromium } from 'playwright';

async function inspectSubbar() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const urls = [
    'https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/',
    'https://rog.asus.com/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/',
    'https://rog.asus.com/vn/laptops/rog-zephyrus-series/',
    'https://rog.asus.com/vn/laptops-group/allmodels/'
  ];

  for (const url of urls) {
    console.log(`\n======================================================`);
    console.log(`URL: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const info = await page.evaluate(() => {
      // Look for subnav elements
      const allNavs = Array.from(document.querySelectorAll('nav, [class*="nav"], [class*="Nav"], [class*="subBar"], [class*="SubBar"], [class*="menu"], [class*="Menu"]'));
      
      const subbars = allNavs.filter(el => {
        const text = el.innerText || '';
        return text.includes('Tính năng') || text.includes('Thông số') || text.includes('Thư viện') || text.includes('Tổng quan');
      });

      const subbarData = subbars.map(s => ({
        tag: s.tagName,
        className: s.className,
        text: s.innerText.replace(/\s+/g, ' ').slice(0, 150),
        links: Array.from(s.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href')
        }))
      }));

      // Find series cards or filter items
      const seriesCards = document.querySelectorAll('[class*="Series"], [class*="series"], [class*="productCard"], [class*="ProductCard"], [class*="ProductResultItem"]');

      return {
        title: document.title,
        subbarData,
        seriesCardCount: seriesCards.length,
        firstSeriesCardClass: seriesCards[0]?.className?.toString() || 'none'
      };
    });

    console.log(`Title: ${info.title}`);
    console.log(`Subbar matches (${info.subbarData.length}):`);
    info.subbarData.forEach((s, idx) => {
      console.log(`  [${idx}] Class: ${s.className}`);
      console.log(`      Text: ${s.text}`);
      console.log(`      Links (${s.links.length}): ${s.links.map(l => `${l.text} -> ${l.href}`).join(' | ')}`);
    });
    console.log(`Series/Product Cards found: ${info.seriesCardCount} (Sample class: ${info.firstSeriesCardClass})`);
  }

  await browser.close();
}

inspectSubbar().catch(console.error);
