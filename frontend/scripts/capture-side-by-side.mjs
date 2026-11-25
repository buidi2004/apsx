import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('diff-reports/side-by-side');
fs.mkdirSync(OUT_DIR, { recursive: true });

const pagesToCompare = [
  {
    name: '01_G16_Detail',
    remote: 'https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/',
    local: 'http://localhost:3000/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/'
  },
  {
    name: '02_PG34WCDN_Monitor',
    remote: 'https://rog.asus.com/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/',
    local: 'http://localhost:3000/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/'
  },
  {
    name: '03_Laptops_Allmodels',
    remote: 'https://rog.asus.com/vn/laptops-group/allmodels/',
    local: 'http://localhost:3000/vn/laptops-group/allmodels/'
  },
  {
    name: '04_Zephyrus_Series',
    remote: 'https://rog.asus.com/vn/laptops/rog-zephyrus-series/',
    local: 'http://localhost:3000/vn/laptops/rog-zephyrus-series/'
  }
];

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const item of pagesToCompare) {
    console.log(`\n==============================================`);
    console.log(`Capturing: ${item.name}`);
    console.log(`Remote: ${item.remote}`);
    console.log(`Local:  ${item.local}`);
    console.log(`==============================================`);

    // Capture Remote
    const pRemote = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await pRemote.goto(item.remote, { waitUntil: 'networkidle', timeout: 40000 });
      await pRemote.waitForTimeout(3000);
      const remotePath = path.join(OUT_DIR, `${item.name}_remote.png`);
      await pRemote.screenshot({ path: remotePath, fullPage: false });
      console.log(`  -> Saved Remote: ${remotePath}`);
    } catch (e) {
      console.log(`  -> Remote error: ${e.message}`);
    } finally {
      await pRemote.close();
    }

    // Capture Local
    const pLocal = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await pLocal.goto(item.local, { waitUntil: 'networkidle', timeout: 30000 });
      await pLocal.waitForTimeout(2000);
      const localPath = path.join(OUT_DIR, `${item.name}_local.png`);
      await pLocal.screenshot({ path: localPath, fullPage: false });
      console.log(`  -> Saved Local:  ${localPath}`);
    } catch (e) {
      console.log(`  -> Local error: ${e.message}`);
    } finally {
      await pLocal.close();
    }
  }

  await browser.close();
  console.log('\nAll captures completed in:', OUT_DIR);
}

capture().catch(console.error);
