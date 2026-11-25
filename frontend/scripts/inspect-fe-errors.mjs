import { chromium } from "playwright";

const FE_URL = "http://localhost:3000";

const fePages = [
  { url: `${FE_URL}/vn`, name: "Trang Chủ" },
  { url: `${FE_URL}/vn/backend-status`, name: "Backend Status" },
  { url: `${FE_URL}/vn/store`, name: "Store" },
  { url: `${FE_URL}/vn/search?q=scar`, name: "Search" },
  { url: `${FE_URL}/vn/support`, name: "Support" },
  { url: `${FE_URL}/vn/where-to-buy`, name: "Where To Buy" },
  { url: `${FE_URL}/vn/downloads`, name: "Downloads" },
  { url: `${FE_URL}/vn/innovations`, name: "Innovations" },
  { url: `${FE_URL}/vn/events`, name: "Events" },
  { url: `${FE_URL}/vn/about-rog`, name: "About ROG" },
  { url: `${FE_URL}/vn/cart`, name: "Cart" },
  { url: `${FE_URL}/vn/checkout`, name: "Checkout" },
  { url: `${FE_URL}/vn/account/login`, name: "Login" },
  { url: `${FE_URL}/vn/account/register`, name: "Register" },
  { url: `${FE_URL}/vn/laptops/rog-strix/rog-strix-scar-18-2026`, name: "PDP Scar 18" },
  { url: `${FE_URL}/vn/gaming-handhelds/rog-ally/rog-ally-2023`, name: "PDP Ally" },
  { url: `${FE_URL}/vn/phones/rog-phone-7`, name: "PDP Phone 7" },
];

async function run() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/microsoft-edge-stable",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push({ url: page.url(), text: msg.text() });
    }
  });

  page.on("pageerror", (err) => {
    errors.push({ url: page.url(), text: `[PAGEERROR] ${err.message}` });
  });

  page.on("requestfailed", (req) => {
    if (!req.url().includes("favicon.ico")) {
      errors.push({ url: page.url(), text: `[NETFAIL] ${req.url()} - ${req.failure()?.errorText}` });
    }
  });

  console.log("Navigating pages...");
  for (const p of fePages) {
    errors.length = 0; // reset per page
    try {
      const res = await page.goto(p.url, { waitUntil: "networkidle", timeout: 8000 });
      const status = res?.status();
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 100).replace(/\n/g, " "));
      console.log(`\nPage: ${p.name} (${p.url}) -> Status ${status}`);
      console.log(`Preview: ${bodyText}`);
      if (errors.length > 0) {
        console.log(`  Errors (${errors.length}):`);
        errors.forEach(e => console.log(`   - ${e.text.slice(0, 150)}`));
      } else {
        console.log(`  No console/network errors!`);
      }
    } catch (e) {
      console.log(`\nPage: ${p.name} (${p.url}) -> FAILED: ${e.message}`);
      if (errors.length > 0) {
        console.log(`  Errors during navigation:`);
        errors.forEach(err => console.log(`   - ${err.text.slice(0, 150)}`));
      }
    }
  }

  await browser.close();
}

run();
