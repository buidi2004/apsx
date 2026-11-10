const { chromium } = require('playwright');

async function captureOfficial() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to official ASUS ROG Ally page...');
  await page.goto('https://rog.asus.com/vn/gaming-handhelds/rog-ally/rog-ally-2023/', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Let animations settle
  await page.waitForTimeout(3000);

  const domInfo = await page.evaluate(() => {
    const totalHeight = document.body.scrollHeight;
    
    // Check all sections
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
        opacity: style.opacity
      };
    });

    return { totalHeight, sections };
  });

  console.log('Official Total Height:', domInfo.totalHeight);
  console.log('Official Sections:');
  domInfo.sections.forEach(s => console.log('  ', JSON.stringify(s)));

  for (let y = 0; y <= Math.min(domInfo.totalHeight, 8000); y += 1000) {
    await page.evaluate((scrollPos) => {
      window.scrollTo(0, scrollPos);
    }, y);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `/tmp/official-ally-pos-${y}.png` });
  }

  await browser.close();
  console.log('Official capture complete!');
}

captureOfficial().catch(console.error);

