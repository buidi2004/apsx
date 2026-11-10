import { createRequire } from 'module';

const require = createRequire('/home/buidi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/microsoft-edge-stable",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to http://localhost:5161/admin/index.html...");
  await page.goto("http://localhost:5161/admin/index.html", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Fill in default admin credentials: admin / Admin@123
  await page.fill("#login-username", "admin");
  await page.fill("#login-password", "Admin@123");
  await page.click("button:has-text('Đăng nhập')");
  await page.waitForTimeout(1500);

  const title = await page.title();
  console.log("Admin title:", title);

  const currentArtifactDir = "/home/buidi/.gemini/antigravity/brain/a0cbecf5-76d8-4b30-8b61-7ff5c2c75201/screenshots";
  const fs = require('fs');
  if (!fs.existsSync(currentArtifactDir)) {
    fs.mkdirSync(currentArtifactDir, { recursive: true });
  }

  await page.screenshot({ path: `${currentArtifactDir}/verify-rogadmin-dashboard.png` });
  console.log(`Saved screenshot: ${currentArtifactDir}/verify-rogadmin-dashboard.png`);

  await browser.close();
}

run().catch((err) => {
  console.error("Admin verification error:", err);
  process.exit(1);
});
