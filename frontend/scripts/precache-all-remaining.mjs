import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "rog-catalog");
fs.mkdirSync(CACHE_DIR, { recursive: true });

// Read sitemap
const xml = fs.readFileSync(".cache/product1.xml", "utf8");
const allUrls = [...xml.matchAll(/<loc>https:\/\/rog\.asus\.com\/vn\/([^<]+)\/<\/loc>/g)].map(
  (m) => m[1]
);

const subPageSet = new Set([
  "spec",
  "award",
  "gallery",
  "wtb",
  "helpdesk",
  "review",
  "compatible-list",
]);

const baseProducts = allUrls.filter((u) => {
  const parts = u.split("/");
  return !subPageSet.has(parts[parts.length - 1]);
});

async function cacheUrl(slugPath) {
  const cleanKey = slugPath.replace(/[^a-zA-Z0-9-_]/g, "_");
  const cacheFile = path.join(CACHE_DIR, `${cleanKey}.json`);

  if (fs.existsSync(cacheFile)) {
    return { slug: slugPath, status: "ALREADY_CACHED" };
  }

  const targetUrl = `https://rog.asus.com/vn/${slugPath}/`;
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!res.ok) {
      return { slug: slugPath, status: `HTTP_${res.status}` };
    }

    const text = await res.text();

    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "ASUS Republic of Gamers";

    const cssMatches = [...text.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)];
    const cssLinks = cssMatches.map((m) => {
      let link = m[0];
      link = link.replace(/href=["']\/(?!\/)/g, 'href="https://rog.asus.com/');
      link = link.replace(/href=["']\/\/(dlcdn[^\s"'>]+)/g, 'href="https://$1');
      return link;
    });

    const styleMatches = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
    const styles = styleMatches.map((m) => m[1]);

    const mainStart = text.indexOf("<main");
    const mainEnd = text.lastIndexOf("</main>");
    let mainHtml = "";
    if (mainStart !== -1 && mainEnd !== -1) {
      mainHtml = text.slice(mainStart, mainEnd + 7);
    } else {
      const overviewIdx = text.indexOf('class="productOverview"');
      if (overviewIdx !== -1) {
        const startTag = text.lastIndexOf("<div", overviewIdx);
        const footerIdx = text.indexOf("<footer");
        mainHtml = text.slice(startTag, footerIdx !== -1 ? footerIdx : undefined);
      }
    }

    if (!mainHtml) {
      return { slug: slugPath, status: "NO_MAIN" };
    }

    // Media rewriting
    mainHtml = mainHtml.replace(
      /(src|data-src|poster)=["']\/(?!\/)([^"']+)["']/gi,
      '$1="https://rog.asus.com/$2"'
    );
    mainHtml = mainHtml.replace(
      /(src|data-src|poster)=["']\/\/(dlcdn[^\s"'>]+)["']/gi,
      '$1="https://$2"'
    );

    // Link rewriting
    mainHtml = mainHtml.replace(
      /href=["']https:\/\/rog\.asus\.com\/vn\/([^"']+)["']/gi,
      'href="/vn/$1"'
    );
    mainHtml = mainHtml.replace(
      /href=["']\/(?!vn\/)(?!\/)([^"']+)["']/gi,
      'href="https://rog.asus.com/$1"'
    );

    // Lazy load
    mainHtml = mainHtml.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
      let newAttrs = attrs;
      const lazyMatch = attrs.match(/data-src=["']([^"']+)["']/i);
      if (lazyMatch && (!attrs.includes("src=") || attrs.includes('src=""') || attrs.includes("blank.gif"))) {
        newAttrs = newAttrs.replace(/src=["'][^"']*["']/i, "");
        newAttrs += ` src="${lazyMatch[1]}"`;
      }
      return `<img ${newAttrs}>`;
    });

    const result = { title, cssLinks, styles, mainHtml };
    fs.writeFileSync(cacheFile, JSON.stringify(result));
    return { slug: slugPath, status: "CACHED", sizeKb: Math.round(mainHtml.length / 1024) };
  } catch (err) {
    return { slug: slugPath, status: "ERROR", error: err.message };
  }
}

// Find uncached base products
const cachedFiles = new Set(fs.readdirSync(CACHE_DIR).map((f) => f.replace(/\.json$/, "")));
const uncachedBaseProducts = baseProducts.filter(
  (p) => !cachedFiles.has(p.replace(/[^a-zA-Z0-9-_]/g, "_"))
);

console.log(`Uncached base products: ${uncachedBaseProducts.length}`);

// We can target specific categories or take the first N products
const targetCategories = process.argv.slice(2);
let toProcess = uncachedBaseProducts;

if (targetCategories.length > 0) {
  toProcess = uncachedBaseProducts.filter((p) =>
    targetCategories.some((cat) => p.startsWith(cat + "/"))
  );
  console.log(`Filtering by categories [${targetCategories.join(", ")}]: ${toProcess.length} products`);
}

async function processQueue(items, concurrency = 6) {
  let index = 0;
  let successCount = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      const p = items[currentIndex];

      // Cache overview
      const resOverview = await cacheUrl(p);
      // Cache spec
      const resSpec = await cacheUrl(`${p}/spec`);

      if (resOverview.status === "CACHED" || resOverview.status === "ALREADY_CACHED") {
        successCount++;
        process.stdout.write(`[${currentIndex + 1}/${items.length}] OK: ${p}\n`);
      } else {
        process.stdout.write(`[${currentIndex + 1}/${items.length}] FAIL: ${p} (${resOverview.status})\n`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  console.log(`\nCompleted! Successfully cached ${successCount}/${items.length} products.`);
}

processQueue(toProcess);

