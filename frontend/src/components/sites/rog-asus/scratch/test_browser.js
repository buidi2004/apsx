const { chromium } = require('playwright');

async function test() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });
  console.log('Browser launched successfully!');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Test both pages
  for (const url of [
    'http://localhost:3000/vn/gaming-handhelds/rog-ally/rog-ally-2023',
    'http://localhost:3000/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605'
  ]) {
    console.log(`Navigating to ${url}...`);
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Status: ${res.status()}`);
    
    // Check console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`[Browser Console Error] ${msg.text()}`);
      }
    });

    const slug = url.includes('ally') ? 'ally' : 'g16';
    await page.screenshot({ path: `/tmp/${slug}-view-0.png`, fullPage: false });
    
    // Scroll down 1500px and take another screenshot
    await page.evaluate(() => window.scrollBy(0, 1500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `/tmp/${slug}-view-1500.png`, fullPage: false });
    
    // Scroll down 4000px and take another screenshot
    await page.evaluate(() => window.scrollBy(0, 2500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `/tmp/${slug}-view-4000.png`, fullPage: false });
    console.log(`Screenshots saved for ${slug}!`);
  }

  await browser.close();
}

test().catch(err => {
  console.error('Error in Playwright test:', err);
  process.exit(1);
});

