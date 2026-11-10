import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "rog-catalog");
fs.mkdirSync(CACHE_DIR, { recursive: true });

async function cachePage(slugPath) {
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
      console.warn(`[NO MAIN] ${targetUrl}`);
      return false;
    }

    mainHtml = mainHtml.replace(
      /(src|data-src|poster)=["']\/(?!\/)([^"']+)["']/gi,
      '$1="https://rog.asus.com/$2"'
    );
    mainHtml = mainHtml.replace(
      /(src|data-src|poster)=["']\/\/(dlcdn[^\s"'>]+)["']/gi,
      '$1="https://$2"'
    );

    mainHtml = mainHtml.replace(
      /href=["']https:\/\/rog\.asus\.com\/vn\/([^"']+)["']/gi,
      'href="/vn/$1"'
    );
    mainHtml = mainHtml.replace(
      /href=["']\/(?!vn\/)(?!\/)([^"']+)["']/gi,
      'href="https://rog.asus.com/$1"'
    );

    mainHtml = mainHtml.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
      let newAttrs = attrs;
      const lazyMatch = attrs.match(/data-src=["']([^"']+)["']/i);
      if (lazyMatch && (!attrs.includes("src=") || attrs.includes('src=""') || attrs.includes("blank.gif"))) {
        newAttrs = newAttrs.replace(/src=["'][^"']*["']/i, "");
        newAttrs += ` src="${lazyMatch[1]}"`;
      }
      return `<img ${newAttrs}>`;
    });

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

const CATALOG_SLUGS = [
  "laptops-group/allmodels",
  "motherboards-group/allmodels",
  "monitors-group/allmodels",
  "phones-group/allmodels",
  "desktops-group/allmodels",
  "power-supply-units-group/allmodels",
  "external-graphics-docks-group/allmodels",
  "networking-group/allmodels",
  "cases-group/allmodels",
  "streaming-kits-group/allmodels",
  "controllers-group/allmodels",
  "keyboards/keyboards-series",
  "cooling/cpu-liquid-coolers-series",
  "mice-mouse-pads/mice-series",
  "headsets-audio/headsets-series",
  "apparel-bags-gear/bags-series",
  "docks-chargers-and-cables/chargers-series",
  "gaming-handhelds/accessories-series",
  "graphics-cards/graphics-cards-series",
  "protection-and-gadgets/cases-and-protection-series",
  // additional major series listings
  "keyboards/keyboards/aura-rgb-series",
  "keyboards/keyboards/compact-series",
  "keyboards/keyboards/pbt-keycaps-series",
  "motherboards/rog-maximus-series",
  "motherboards/rog-strix-series",
  "motherboards/rog-crosshair-series",
  "graphics-cards/graphics-cards/rog-strix-series",
  "cooling/cpu-liquid-coolers/rog-ryujin-series",
  "cooling/cpu-liquid-coolers/rog-strix-lc-series",
  "monitors/27-to-31-5-inches-series",
  "monitors/32-to-34-inches-series",
  "power-supply-units/rog-thor-series",
  "apparel-bags-gear/rog-slash-series",
];

async function main() {
  console.log(`Caching ${CATALOG_SLUGS.length} catalog/listing pages...`);
  let count = 0;
  for (const slug of CATALOG_SLUGS) {
    const ok = await cachePage(slug);
    if (ok) count++;
    await new Promise((r) => setTimeout(r, 150));
  }
  console.log(`Finished caching ${count} catalogs.`);
}

main();

