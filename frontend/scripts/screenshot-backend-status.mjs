import { createRequire } from 'module';

const require = createRequire('/home/buidi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');

async function snap() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/vn/backend-status', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(1000);

  const outPath = '/home/buidi/.gemini/antigravity/brain/a0cbecf5-76d8-4b30-8b61-7ff5c2c75201/screenshots/backend_connection_verified.png';
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved screenshot to:', outPath);

  await browser.close();
}

snap().catch(console.error);
