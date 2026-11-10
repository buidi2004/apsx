const { chromium } = require('playwright');

async function testFixed() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:3000/vn/gaming-handhelds/rog-ally/rog-ally-2023...');
  await page.goto('http://localhost:3000/vn/gaming-handhelds/rog-ally/rog-ally-2023', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(2000);

  const heights = [0, 1000, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 8000];
  for (const y of heights) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `/tmp/fixed-ally-pos-${y}.png` });
  }

  await browser.close();
  console.log('Finished capturing all positions!');
}

testFixed().catch(console.error);

