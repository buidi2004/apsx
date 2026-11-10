import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "rog-catalog");
fs.mkdirSync(CACHE_DIR, { recursive: true });

async function cacheProductPage(slugPath) {
  const cleanKey = slugPath.replace(/[^a-zA-Z0-9-_]/g, "_");
  const cacheFile = path.join(CACHE_DIR, `${cleanKey}.json`);

  if (fs.existsSync(cacheFile)) {
    console.log(`[ALREADY CACHED] ${slugPath}`);
    return true;
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
      console.warn(`[HTTP ${res.status}] ${targetUrl}`);
      return false;
    }

    const text = await res.text();

    // 1. Extract title
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "ASUS Republic of Gamers";

    // 2. Extract CSS links and rewrite URLs
    const cssMatches = [...text.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)];
    const cssLinks = cssMatches.map((m) => {
      let link = m[0];
      link = link.replace(/href=["']\/(?!\/)/g, 'href="https://rog.asus.com/');
      link = link.replace(/href=["']\/\/(dlcdn[^\s"'>]+)/g, 'href="https://$1');
      return link;
    });

    // 3. Extract inline styles
    const styleMatches = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
    const styles = styleMatches.map((m) => m[1]);

    // 4. Extract Main
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
      console.warn(`[NO MAIN] ${targetUrl}`);
      return false;
    }

    // Rewrite media
    mainHtml = mainHtml.replace(
      /(src|data-src|poster)=["']\/(?!\/)([^"']+)["']/gi,
      '$1="https://rog.asus.com/$2"'
    );
    mainHtml = mainHtml.replace(
      /(src|data-src|poster)=["']\/\/(dlcdn[^\s"'>]+)["']/gi,
      '$1="https://$2"'
    );

    // Rewrite links to local /vn/
    mainHtml = mainHtml.replace(
      /href=["']https:\/\/rog\.asus\.com\/vn\/([^"']+)["']/gi,
      'href="/vn/$1"'
    );
    mainHtml = mainHtml.replace(
      /href=["']\/(?!vn\/)(?!\/)([^"']+)["']/gi,
      'href="https://rog.asus.com/$1"'
    );

    // Promote lazy images
    mainHtml = mainHtml.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
      let newAttrs = attrs;
      const lazyMatch = attrs.match(/data-src=["']([^"']+)["']/i);
      if (lazyMatch && (!attrs.includes("src=") || attrs.includes('src=""') || attrs.includes("blank.gif"))) {
        newAttrs = newAttrs.replace(/src=["'][^"']*["']/i, "");
        newAttrs += ` src="${lazyMatch[1]}"`;
      }
      return `<img ${newAttrs}>`;
    });

    // Autoplay video
    mainHtml = mainHtml.replace(/<video\b([^>]*)>/gi, (match, attrs) => {
      if (!attrs.includes("muted")) attrs += " muted";
      if (!attrs.includes("playsinline")) attrs += " playsinline";
      if (!attrs.includes("autoplay")) attrs += " autoplay";
      if (!attrs.includes("loop")) attrs += " loop";
      return `<video ${attrs}>`;
    });

    const result = {
      title,
      cssLinks,
      styles,
      mainHtml,
    };

    fs.writeFileSync(cacheFile, JSON.stringify(result));
    console.log(`[SUCCESS] Cached ${slugPath} (${Math.round(mainHtml.length / 1024)} KB)`);
    return true;
  } catch (err) {
    console.error(`[ERROR] ${slugPath}:`, err.message);
    return false;
  }
}

async function main() {
  const content = fs.readFileSync(
    path.join(process.cwd(), "src/components/sites/rog-asus/RogProductHome.tsx"),
    "utf8"
  );
  const hrefs = [...new Set([...content.matchAll(/href:\s*"(\/vn\/[^"]+)"/g)].map((m) => m[1]))];

  const rogProductHrefs = hrefs.filter((h) => {
    if (h.includes("apple.com") || h.includes("samsung.com")) return false;
    if (h.includes("iphone") || h.includes("ipad") || h.includes("macbook") || h.includes("galaxy")) return false;
    if (h.includes("-group") || h.includes("-series")) return false;
    return true;
  });

  console.log(`Starting pre-cache for ${rogProductHrefs.length} products...`);

  let count = 0;
  for (const h of rogProductHrefs) {
    const slug = h.replace(/^\/vn\//, "").replace(/\/$/, "");
    if (!slug) continue;

    // Cache overview
    const ok = await cacheProductPage(slug);
    if (ok) count++;

    // Cache spec
    const specOk = await cacheProductPage(`${slug}/spec`);
    if (specOk) count++;

    // Small delay to be polite
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`Done! Cached ${count} pages into ${CACHE_DIR}`);
}

main();

