import { chromium } from 'playwright';

async function inspect(url) {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(3000);

  const res = await page.evaluate(() => {
    // find all nav/subbar like elements
    const elements = Array.from(document.querySelectorAll('header, nav, [class*="sub"], [class*="Sub"], [class*="nav"], [class*="Nav"], [class*="bar"], [class*="Bar"]'))
      .map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.innerText ? el.innerText.trim().replace(/\s+/g, ' ').slice(0, 100) : '',
        id: el.id
      }))
      .filter(item => item.text.includes('TÍNH NĂNG') || item.text.includes('THÔNG SỐ') || item.text.includes('LỰA CHỌN') || item.text.includes('ZEPHYRUS') || item.text.includes('G16'));

    const h1 = document.querySelector('h1')?.innerText?.trim() || '';
    const bodyStyles = window.getComputedStyle(document.body);
    const fonts = Array.from(document.fonts).map(f => f.family);

    // Get all top-level main sections or direct children of main
    const mainChildren = Array.from(document.querySelectorAll('main > *, [role="main"] > *, #__next > div > *')).map(el => ({
      tag: el.tagName,
      className: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
      id: el.id,
      height: el.getBoundingClientRect().height
    })).filter(x => x.height > 10);

    return {
      title: document.title,
      h1,
      fontFamily: bodyStyles.fontFamily,
      bgColor: bodyStyles.backgroundColor,
      matchingNavElements: elements.slice(0, 10),
      mainChildren: mainChildren.slice(0, 15)
    };
  });

  await browser.close();
  return res;
}

async function run() {
  console.log('--- Inspecting ASUS ROG Remote ---');
  const remote = await inspect('https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/');
  console.log('REMOTE:', JSON.stringify(remote, null, 2));

  console.log('\n--- Inspecting Localhost ---');
  const local = await inspect('http://localhost:3000/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/');
  console.log('LOCAL:', JSON.stringify(local, null, 2));
}

run().catch(console.error);
