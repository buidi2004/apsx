const { chromium } = require('playwright');
const fs = require('fs');

async function scanPage() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to Ally page...');
  await page.goto('http://localhost:3000/vn/gaming-handhelds/rog-ally/rog-ally-2023', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(2000);

  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log('Page total height:', totalHeight);

  const blackVisions = [];

  for (let y = 0; y <= totalHeight; y += 2000) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(400);

    const shotPath = `/tmp/scan-ally-${y}.png`;
    await page.screenshot({ path: shotPath });
    const stat = fs.statSync(shotPath);

    // PNG with 1440x900 of solid black is usually around 20,323 bytes (under 25KB)
    if (stat.size < 35000) {
      blackVisions.push({ y, size: stat.size });
    }
  }

  console.log('=== Black Spots Detected (< 35KB) ===');
  console.log(blackVisions);

  await browser.close();
}

scanPage().catch(console.error);

