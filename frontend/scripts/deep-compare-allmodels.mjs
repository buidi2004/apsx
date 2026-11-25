import { chromium } from 'playwright';

async function inspect(url) {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(3000);

  const res = await page.evaluate(() => {
    const title = document.title;
    const bodyStyles = window.getComputedStyle(document.body);
    
    // Find filter container, sort bar, cards
    const filterEl = document.querySelector('[class*="Filter"], [class*="filter"]');
    const sortEl = document.querySelector('[class*="Sort"], [class*="sort"], [class*="Order"], [class*="order"]');
    const cards = Array.from(document.querySelectorAll('.productCard, [class*="ProductResultItem"], [class*="productItem"], [class*="ProductCard"], [class*="Card"]'));

    const sampleCard = cards[0];
    let sampleCardData = null;
    if (sampleCard) {
      const img = sampleCard.querySelector('img');
      const titleEl = sampleCard.querySelector('h2, h3, [class*="Title"], [class*="name"], [class*="Name"]');
      const specs = Array.from(sampleCard.querySelectorAll('[class*="Spec"], [class*="spec"], li, p')).map(p => p.innerText.trim()).filter(Boolean).slice(0, 5);
      const buttons = Array.from(sampleCard.querySelectorAll('button, a')).map(b => b.innerText.trim()).filter(Boolean);
      sampleCardData = {
        cardClass: sampleCard.className,
        title: titleEl?.innerText?.trim() || '',
        imgSrc: img?.src || '',
        specs,
        buttons
      };
    }

    return {
      title,
      fontFamily: bodyStyles.fontFamily,
      bgColor: bodyStyles.backgroundColor,
      filterClass: filterEl?.className || '',
      sortClass: sortEl?.className || '',
      totalCards: cards.length,
      sampleCard: sampleCardData
    };
  });

  await browser.close();
  return res;
}

async function run() {
  console.log('--- Inspecting ASUS ROG Remote allmodels ---');
  const remote = await inspect('https://rog.asus.com/vn/laptops-group/allmodels/');
  console.log('REMOTE:', JSON.stringify(remote, null, 2));

  console.log('\n--- Inspecting Localhost allmodels ---');
  const local = await inspect('http://localhost:3000/vn/laptops-group/allmodels/');
  console.log('LOCAL:', JSON.stringify(local, null, 2));
}

run().catch(console.error);
