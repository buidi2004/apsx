const { chromium } = require('playwright');

async function diagnose() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  const failedRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(`[PageError] ${err.toString()}`);
  });

  page.on('requestfailed', req => {
    failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  console.log('Navigating to Ally page...');
  await page.goto('http://localhost:3000/vn/gaming-handhelds/rog-ally/rog-ally-2023', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  console.log('=== Console Errors (' + errors.length + ') ===');
  errors.forEach(e => console.log('  ', e));

  console.log('=== Failed Requests (' + failedRequests.length + ') ===');
  failedRequests.forEach(f => console.log('  ', f));

  // Inspect DOM around y=4000
  const domInfo = await page.evaluate(() => {
    const totalHeight = document.body.scrollHeight;
    
    // Check element at scroll y=4000
    window.scrollTo(0, 4000);
    const elementAtCenter = document.elementFromPoint(720, 450);
    
    let path = [];
    let curr = elementAtCenter;
    while (curr && curr !== document.body) {
      path.push(`${curr.tagName.toLowerCase()}${curr.id ? '#' + curr.id : ''}${curr.className ? '.' + Array.from(curr.classList).join('.') : ''}`);
      curr = curr.parentElement;
    }

    // Find all sections inside #ASUS-features or ally container
    const sections = Array.from(document.querySelectorAll('section, .section, [id^="section-"]')).map(s => {
      const rect = s.getBoundingClientRect();
      const style = window.getComputedStyle(s);
      return {
        id: s.id,
        className: s.className,
        top: rect.top + window.scrollY,
        height: rect.height,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        background: style.backgroundColor
      };
    });

    // Check images with data-src or lazyload
    const lazyImages = Array.from(document.querySelectorAll('img[data-src], img.lazyload, figure.lazyLoad')).map(img => {
      const rect = img.getBoundingClientRect();
      const style = window.getComputedStyle(img);
      return {
        tag: img.tagName,
        class: img.className,
        src: img.getAttribute('src'),
        dataSrc: img.getAttribute('data-src'),
        bgImage: style.backgroundImage,
        rect: { top: rect.top + window.scrollY, height: rect.height, width: rect.width }
      };
    }).slice(0, 20);

    return {
      totalHeight,
      elementAtCenterAt4000: path.join(' > '),
      sections,
      lazyCount: document.querySelectorAll('[data-src], .lazyload, .lazyLoad').length,
      sampleLazy: lazyImages
    };
  });

  console.log('=== Page Info ===');
  console.log('Total height:', domInfo.totalHeight);
  console.log('Element at 4000px center:', domInfo.elementAtCenterAt4000);
  console.log('Total lazy elements:', domInfo.lazyCount);
  console.log('Sections:');
  domInfo.sections.forEach(s => console.log('  ', JSON.stringify(s)));
  console.log('Sample lazy elements:');
  domInfo.sampleLazy.forEach(l => console.log('  ', JSON.stringify(l)));

  // Scroll down step by step and take screenshots at 1000, 2000, 3000, 4000, 5000, 6000
  for (let y = 0; y <= Math.min(domInfo.totalHeight, 8000); y += 1000) {
    await page.evaluate((scrollPos) => {
      window.scrollTo(0, scrollPos);
    }, y);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `/tmp/ally-pos-${y}.png` });
  }

  await browser.close();
  console.log('Done diagnosis!');
}

diagnose().catch(console.error);

