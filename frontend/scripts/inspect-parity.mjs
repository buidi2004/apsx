import { chromium } from 'playwright';

const testUrls = [
  // Detail flagship
  { name: 'Detail - G16 2025', path: '/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/' },
  // Detail SCAR 18
  { name: 'Detail - SCAR 18 2026', path: '/vn/laptops/rog-strix/rog-strix-scar-18-2026/' },
  // Detail Phone 9 Pro
  { name: 'Detail - Phone 9 Pro', path: '/vn/phones/rog-phone-9-pro/' },
  // Detail Monitor PG34WCDN
  { name: 'Detail - PG34WCDN', path: '/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/' },
  // Spec page
  { name: 'Spec - G16 2025', path: '/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/spec/' },
  // Gallery page
  { name: 'Gallery - G16 2025', path: '/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/gallery/' },
  // Xem them - Laptops allmodels
  { name: 'Xem thêm - Laptops Allmodels', path: '/vn/laptops-group/allmodels/' },
  // Xem them - Zephyrus Series
  { name: 'Xem thêm - Zephyrus Series', path: '/vn/laptops/rog-zephyrus-series/' },
  // Xem them - Graphics Cards Series
  { name: 'Xem thêm - Graphics Cards', path: '/vn/graphics-cards/graphics-cards-series/' }
];

async function inspectPage(page, url) {
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(2500);

    const data = await page.evaluate(() => {
      const nav = document.querySelector('header, nav, [class*="Header"], [class*="header"]');
      const subbar = document.querySelector('#productTabBarContainer, [class*="productTabBar"], [class*="ProductTabBar"], [class*="TabBar"], [class*="tabBar"], [class*="SubBar"], [class*="subBar"], [class*="subbar"], [class*="Subbar"], [class*="ProductNav"], [class*="navBar"]');
      const footer = document.querySelector('footer, [class*="Footer"], [class*="footer"]');
      const cards = document.querySelectorAll('.productCard, [class*="ProductResultItem"], [class*="productItem"], [class*="card"]');
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText?.trim() || '';
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const bodyFont = window.getComputedStyle(document.body).fontFamily;

      // Extract subbar links
      let subbarLinks = [];
      if (subbar) {
        subbarLinks = Array.from(subbar.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href')
        }));
      }

      // Check key sections
      const sections = Array.from(document.querySelectorAll('section, main > div')).map(s => {
        const cls = s.className ? (typeof s.className === 'string' ? s.className : '') : '';
        return cls.split(' ').slice(0, 2).join(' ');
      }).filter(Boolean).slice(0, 10);

      return {
        title,
        h1,
        bodyBg,
        bodyFont,
        hasNav: !!nav,
        hasSubbar: !!subbar,
        subbarText: subbar?.innerText?.replace(/\s+/g, ' ').slice(0, 100) || '',
        subbarLinks,
        hasFooter: !!footer,
        cardCount: cards.length,
        sectionsCount: document.querySelectorAll('section').length,
        firstSections: sections,
        totalImages: document.querySelectorAll('img').length,
        totalVideos: document.querySelectorAll('video').length,
      };
    });

    return { status: res?.status() || 0, ...data };
  } catch (err) {
    return { status: 'ERROR', error: err.message };
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const pageOrig = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pageLocal = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('------------------------------------------------------------------------');
  console.log('SO SÁNH ĐỐI CHIẾU TRỰC TIẾP: ASUS ROG VN (GỐC) vs LOCALHOST (BẢN CLONE)');
  console.log('------------------------------------------------------------------------\n');

  for (const item of testUrls) {
    console.log(`\n========================================================================`);
    console.log(`🔍 [${item.name}] URL: ${item.path}`);
    console.log(`========================================================================`);

    const origUrl = `https://rog.asus.com${item.path}`;
    const localUrl = `http://localhost:3000${item.path}`;

    const [origRes, localRes] = await Promise.all([
      inspectPage(pageOrig, origUrl),
      inspectPage(pageLocal, localUrl)
    ]);

    console.log(`BẢN GỐC (rog.asus.com):`);
    console.log(`  - Status: ${origRes.status}`);
    console.log(`  - Title: ${origRes.title}`);
    console.log(`  - Has Subbar: ${origRes.hasSubbar} | Subbar Links: ${origRes.subbarLinks?.length || 0}`);
    if (origRes.subbarLinks?.length > 0) {
      console.log(`    Links: ${origRes.subbarLinks.map(l => `${l.text} (${l.href})`).join(' | ')}`);
    }
    console.log(`  - Sections: ${origRes.sectionsCount} | Cards: ${origRes.cardCount} | Images: ${origRes.totalImages} | Videos: ${origRes.totalVideos}`);

    console.log(`BẢN LOCAL (localhost:3000):`);
    console.log(`  - Status: ${localRes.status}`);
    console.log(`  - Title: ${localRes.title}`);
    console.log(`  - Has Subbar: ${localRes.hasSubbar} | Subbar Links: ${localRes.subbarLinks?.length || 0}`);
    if (localRes.subbarLinks?.length > 0) {
      console.log(`    Links: ${localRes.subbarLinks.map(l => `${l.text} (${l.href})`).join(' | ')}`);
    }
    console.log(`  - Sections: ${localRes.sectionsCount} | Cards: ${localRes.cardCount} | Images: ${localRes.totalImages} | Videos: ${localRes.totalVideos}`);

    // Diff highlights
    const diffs = [];
    if (origRes.hasSubbar !== localRes.hasSubbar) {
      diffs.push(`⚠️ Subbar lệch: Gốc ${origRes.hasSubbar ? 'CÓ' : 'KHÔNG'}, Local ${localRes.hasSubbar ? 'CÓ' : 'KHÔNG'}`);
    }
    if (Math.abs((origRes.cardCount || 0) - (localRes.cardCount || 0)) > 2) {
      diffs.push(`⚠️ Số lượng Card sản phẩm lệch: Gốc ${origRes.cardCount}, Local ${localRes.cardCount}`);
    }
    if (Math.abs((origRes.subbarLinks?.length || 0) - (localRes.subbarLinks?.length || 0)) > 0) {
      diffs.push(`⚠️ Số link trên Subbar lệch: Gốc ${origRes.subbarLinks?.length || 0}, Local ${localRes.subbarLinks?.length || 0}`);
    }
    if (diffs.length > 0) {
      console.log(`🚨 PHÁT HIỆN LỆCH (DIFFERENCE):`);
      diffs.forEach(d => console.log(`   ${d}`));
    } else {
      console.log(`✅ Khớp cấu trúc chính!`);
    }
  }

  await browser.close();
}

main().catch(console.error);
