const { chromium } = require('/home/buidi/Tài liệu/apsx/ai-website-cloner-template/.agents/skills/playwright-skill/node_modules/playwright');

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  const pagesToTest = [
    { name: 'Home Page', url: 'http://localhost:3000/vn/' },
    { name: 'Store (Live Pricing)', url: 'http://localhost:3000/vn/store' },
    { name: 'Where to Buy (Dealers)', url: 'http://localhost:3000/vn/where-to-buy' },
    { name: 'Support (Warranty Check)', url: 'http://localhost:3000/vn/support' },
    { name: 'Compare Matrix', url: 'http://localhost:3000/vn/compare' },
    { name: 'Search Catalog', url: 'http://localhost:3000/vn/search?q=scar' },
  ];

  console.log('=== PLAYWRIGHT END-TO-END PERFORMANCE AUDIT ===\n');

  for (const item of pagesToTest) {
    const t0 = Date.now();
    let apiCalls = 0;
    
    page.on('request', req => {
      if (req.url().includes('/api/be/')) apiCalls++;
    });

    await page.goto(item.url, { waitUntil: 'networkidle', timeout: 20000 });
    const loadTime = Date.now() - t0;

    // Evaluate Performance Timing API
    const timing = await page.evaluate(() => {
      const perf = window.performance.getEntriesByType('navigation')[0];
      return perf ? {
        dns: Math.round(perf.domainLookupEnd - perf.domainLookupStart),
        tcp: Math.round(perf.connectEnd - perf.connectStart),
        ttfb: Math.round(perf.responseStart - perf.requestStart),
        domReady: Math.round(perf.domContentLoadedEventEnd - perf.fetchStart),
        complete: Math.round(perf.loadEventEnd - perf.fetchStart)
      } : null;
    });

    console.log(`[PASS] ${item.name.padEnd(28)} | Load: ${loadTime}ms | TTFB: ${timing?.ttfb || 0}ms | DOM Ready: ${timing?.domReady || 0}ms | BE Calls: ${apiCalls}`);
  }

  // Live test: Warrant lookup on Support page
  console.log('\n=== TESTING LIVE WARRANTY LOOKUP ===');
  await page.goto('http://localhost:3000/vn/support', { waitUntil: 'networkidle' });
  const serialInput = page.locator('input[placeholder*="serial" i], input[type="text"]').first();
  await serialInput.fill('R4NRCX0001');
  
  const submitBtn = page.locator('button:has-text("Tra cứu"), button:has-text("Kiểm tra")').first();
  const tCheck0 = Date.now();
  await submitBtn.click();
  
  await page.waitForSelector('text=Còn hạn bảo hành chính hãng', { timeout: 5000 });
  const checkDuration = Date.now() - tCheck0;
  console.log(`[PASS] Real-time Warranty Lookup: ${checkDuration}ms (Found: 'Còn hạn bảo hành chính hãng')`);

  // Take screenshot of optimized warranty & store verification
  const screenshotPath = '/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/verify-optimized-fe-be-audit.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\nScreenshot saved: ${screenshotPath}`);

  console.log(`Total console errors across all pages: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await browser.close();
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
