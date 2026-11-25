import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { RogApi } from "@/lib/api-client";
import RogCustomProductView from "./RogCustomProductView";
import RogCatalogInteractive from "./RogCatalogInteractive";
import RogDetailInteractive, { type RogExtractedScript } from "./RogDetailInteractive";
import rogArticleThumbsRaw from "./rog-article-thumbs.json";

const ARTICLE_THUMBS = rogArticleThumbsRaw as Record<string, string>;

interface Props {
  slug: string[];
}

const SKIP_DETAIL_SCRIPT_RE =
  /\/(?:dist\/overview\/js|nuxtStatic\/js)\/overview\.js|googletagmanager|googleadservices|doubleclick|connect\.facebook|bv\.js|brand-assistant|webMcp\.js|alert-info\.js|locationreminder|promotionbanner|subscribeform|mPulse/i;

function rewriteRootRelativeAssets(html: string, productCdnBase = ""): string {
  let out = html
    // Unwrap corrupted double-prefixed CDN URLs baked into legacy scrapes (e.g. keris-wireless, delta-s)
    .replace(
      /https?:\/\/dlcdn(?:web)?imgs\.asus\.com\/files\/media\/[A-Za-z0-9-]+(https?:\/\/)/gi,
      "$1"
    )
    .replace(
      /(src|data-src|poster)=["']\/(?!vn\/|\/|sites\/)([^"']+)["']/gi,
      '$1="https://rog.asus.com/$2"'
    )
    .replace(/srcset=["']([^"']+)["']/gi, (full, srcsetVal: string) => {
      const updated = srcsetVal.replace(
        /(^|,\s*)\/(?!vn\/|\/|sites\/)([^\s,]+)/g,
        "$1https://rog.asus.com/$2"
      );
      return `srcset="${updated}"`;
    })
    .replace(
      /(src|data-src|poster)=["']\.?\/?(websites\/global\/[^"']+)["']/gi,
      '$1="https://rog.asus.com/$2"'
    )
    .replace(/url\((["']?)\.(https?:\/\/)/gi, "url($1$2")
    .replace(
      /url\((["']?)(?:\/(?!vn\/|\/|sites\/)|\.?\/?(?=websites\/global\/))([^)"']+)\1\)/gi,
      'url($1https://rog.asus.com/$2$1)'
    );

  if (productCdnBase) {
    const productCdnRoot = productCdnBase.replace(/\/[Vv]\d+$/, "");
    out = out
      .replace(
        /(src|data-src|poster)=["']\.?\/?((?:v\d+|V\d+)\/(?:img|images|video|videos|audio|assets|js|css)\/[^"']+)["']/gi,
        `$1="${productCdnRoot}/$2"`
      )
      .replace(
        /url\(\s*(["']?)\.?\/?((?:v\d+|V\d+)\/(?:img|images|video|videos|audio|assets|js|css)\/[^)"']+)\1\s*\)/gi,
        `url($1${productCdnRoot}/$2$1)`
      )
      .replace(
        /(src|data-src|poster)=["']\.?\/?((?:img|images)\/[^"']+)["']/gi,
        `$1="${productCdnBase}/$2"`
      )
      .replace(
        /url\(\s*(["']?)\.?\/?((?:img|images)\/[^)"']+)\1\s*\)/gi,
        `url($1${productCdnBase}/$2$1)`
      );
  }

  // Proxy cross-origin ASUS caption tracks (.vtt/.srt) via same-origin endpoint so Chrome allows <track>
  out = out.replace(
    /<track\b([^>]*?)\bsrc=["'](https:\/\/(?:dlcdnwebimgs|dlcdnimgs|mediawebimg)\.asus\.com\/[^"']+\.(?:vtt|srt)(?:\?[^"']*)?)["']([^>]*)>/gi,
    (_m, pre: string, trackUrl: string, post: string) =>
      `<track${pre}src="/api/rog-asset?url=${encodeURIComponent(trackUrl)}"${post}>`
  );

  // Sanitize broken SVG path comment injections and empty <rect width="">
  out = out
    .replace(/\sd="([^"]*?)<!--[\s\S]*?-->([^"]*)"/gi, ' d="$1$2"')
    .replace(/(<rect\b[^>]*?\swidth=)["']["']/gi, '$1"0"')
    .replace(/(<rect\b[^>]*?\sheight=)["']["']/gi, '$1"0"');

  return out
    .replace(/<img\b([^>]*)>/gi, (_m, attrs: string) => {
      let next = attrs;
      const dsMatch = next.match(/data-src=["']([^"']+)["']/i);
      const srcVal = next.match(/(?:^|\s)src=["']([^"']*)["']/i)?.[1] ?? "";
      const hasRealSrc =
        srcVal.length > 0 &&
        srcVal !== "/" &&
        !srcVal.includes("blank.gif") &&
        !srcVal.startsWith("data:image/gif;base64,R0lGOD");
      if (dsMatch && !hasRealSrc) {
        next = next.replace(/(?:^|\s)src=["'][^"']*["']/gi, "");
        next += ` src="${dsMatch[1]}"`;
      }
      // Replace upstream-missing /small/1x/animation/s1/bg.webp with verified /large/1x asset
      if (next.includes("/images/small/1x/animation/s1/bg.webp")) {
        next = next.replace(
          /\/images\/small\/1x\/animation\/s1\/bg\.webp/gi,
          "/images/large/1x/animation/s1/bg.webp"
        );
      }
      const dssMatch = next.match(/data-srcset=["']([^"']+)["']/i);
      if (dssMatch && !/(?:^|\s)srcset=["'][^"']+["']/i.test(next)) {
        let srcsetVal = dssMatch[1];
        // Resolve relative /images/... against full CDN asset directory when data-src includes /images/
        const mediaBase = dsMatch?.[1]?.match(/^(https?:\/\/[^"']+)\/images\//i)?.[1];
        if (mediaBase && /(?:^|,\s*)\/images\//i.test(srcsetVal)) {
          srcsetVal = srcsetVal.replace(/(^|,\s*)\/(images\/[^\s,]+)/gi, `$1${mediaBase}/$2`);
        }
        next += ` srcset="${srcsetVal}"`;
      }
      if (!dsMatch && !hasRealSrc) {
        const anySrcset = next.match(/(?:^|\s)srcset=["']([^"']+)["']/i)?.[1];
        const firstUrl = anySrcset?.trim().split(/[\s,]+/)[0];
        if (firstUrl && firstUrl.startsWith("http")) {
          next = next.replace(/(?:^|\s)src=["'][^"']*["']/gi, "");
          next += ` src="${firstUrl}"`;
        } else if (/(?:^|\s)src=["']["']/i.test(next)) {
          next = next.replace(
            /(^|\s)src=["']["']/i,
            '$1src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"'
          );
        }
      }
      return `<img${next}>`;
    })
    .replace(/<source\b([^>]*)>/gi, (_m, attrs: string) => {
      let next = attrs;
      const dssMatch = next.match(/data-srcset=["']([^"']+)["']/i);
      if (dssMatch && !/(?:^|\s)srcset=["'][^"']+["']/i.test(next)) {
        next += ` srcset="${dssMatch[1]}"`;
      }
      return `<source${next}>`;
    });
}

function balanceDivTags(html: string): string {
  // Mirror HTML5 landmark container scoping: </section>, </main>, etc. auto-close unclosed inner <div>s,
  // while comments are ignored so phantom <div> tags never close outer React containers.
  const tokenRe =
    /<!--[\s\S]*?-->|<(\/?)(div|section|article|aside|nav|header|footer|main)\b[^>]*>/gi;
  const stack: string[] = [];
  let out = "";
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(html)) !== null) {
    if (match[0].startsWith("<!--")) {
      continue;
    }
    const isClose = match[1] === "/";
    const tag = match[2].toLowerCase();
    if (!isClose) {
      stack.push(tag);
    } else {
      const idx = stack.lastIndexOf(tag);
      if (idx >= 0) {
        stack.length = idx;
      } else if (tag === "div") {
        // Drop unmatched extra closing </div> that would close outer React containers prematurely
        out += html.slice(lastIdx, match.index);
        lastIdx = match.index + match[0].length;
      }
    }
  }
  out += html.slice(lastIdx);
  const remainingDivs = stack.filter((t) => t === "div").length;
  if (remainingDivs > 0) {
    const closeDivs = "</div>".repeat(remainingDivs);
    const mainCloseMatch = out.match(/<\/main>\s*$/i);
    if (mainCloseMatch && typeof mainCloseMatch.index === "number") {
      out = out.slice(0, mainCloseMatch.index) + closeDivs + out.slice(mainCloseMatch.index);
    } else {
      out += closeDivs;
    }
  }
  return out;
}

function prepareOverviewAssets(
  rawMainHtml: string,
  baseCssLinks: string[],
  baseStyles: string[]
) {
  const extraCssLinks: string[] = [];
  const extraStyles: string[] = [];
  const extractedScripts: RogExtractedScript[] = [];

  const productCdnBase =
    rawMainHtml.match(
      /https:\/\/(?:dlcdn(?:web)?imgs|mediawebimg)\.asus\.com\/(?:files\/media\/(?:\d{6}\/)?[A-Za-z0-9-]+(?:\/[Vv]\d+)?|websites\/global\/products\/[A-Za-z0-9]+)/i
    )?.[0] || "";

  let cleaned = rewriteRootRelativeAssets(rawMainHtml, productCdnBase);

  // Extract Webflow metadata from embedded nested <html> before stripping document wrapper
  const wfPage = cleaned.match(/<html[^>]*\bdata-wf-page=["']([^"']+)["']/i)?.[1] || "";
  const wfSite = cleaned.match(/<html[^>]*\bdata-wf-site=["']([^"']+)["']/i)?.[1] || "";

  // Clean pasted font <link> comments inside SVG <path d="..."> attributes (e.g. rtx5090) & extract inline stylesheets
  cleaned = cleaned
    .replace(
      /(<path\b[^>]*\sd=["'][^"']*?)\s*<link\b[^>]*cdn\.fonts\.net[^>]*>[\s\S]{0,600}?<!--\s*END FONT\s*-->\s*/gi,
      "$1 "
    )
    .replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi, (tag) => {
      extraCssLinks.push(tag);
      return "";
    });

  cleaned = cleaned.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_m, cssBody: string) => {
    if (cssBody && cssBody.trim()) {
      extraStyles.push(rewriteRootRelativeAssets(cssBody));
    }
    return "";
  });

  // Normalize malformed vendor closing tags (</script-->), double opening (<script><script src=...>), and unclosed featuresRun <script> blocks before HTML containers
  cleaned = cleaned
    .replace(/<\/script\s*--+>\s*/gi, "</script>")
    .replace(/<script\b[^>]*>\s*(?=<script\b)/gi, "")
    .replace(
      /(<script\b[^>]*>\s*window\.featuresRun\s*=\s*function\s*\(\)\s*\{[\s\S]{0,600}?\}\s*)(?=<\/?(?:div|section|main)\b)/gi,
      "$1</script>"
    );

  // Extract executable scripts so React doesn't discard or fail hydration on <script>
  cleaned = cleaned.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs: string, code: string) => {
    const typeMatch = attrs.match(/\btype=["']([^"']+)["']/i);
    const scriptType = (typeMatch?.[1] || "").trim().toLowerCase();
    // Preserve importmap & non-JS data blocks in DOM instead of trying to eval them as JS
    if (scriptType === "importmap") {
      return full;
    }
    if (
      scriptType &&
      scriptType !== "text/javascript" &&
      scriptType !== "application/javascript" &&
      scriptType !== "module"
    ) {
      return "";
    }
    const isModule = scriptType === "module";
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    if (srcMatch) {
      let src = srcMatch[1].replace(/&amp;/g, "&");
      if (src.startsWith("/") && !src.startsWith("//") && !src.startsWith("/sites/")) {
        src = `https://rog.asus.com${src}`;
      } else if (src.startsWith("//")) {
        src = `https:${src}`;
      }
      if (!SKIP_DETAIL_SCRIPT_RE.test(src)) {
        extractedScripts.push(isModule ? { src, isModule } : { src });
      }
    } else if (code && code.trim().length > 0) {
      extractedScripts.push(isModule ? { inline: code.trim(), isModule } : { inline: code.trim() });
    }
    return "";
  });

  // Strip scrape-time ScrollReveal state & embedded document-level tags (<!DOCTYPE>, <html>, <head>, <meta>, <title>, icon <link>, <body>)
  cleaned = cleaned
    .replace(/\sdata-sr-id=["'][^"']*["']/gi, "")
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<\/?html\b[^>]*>/gi, "")
    .replace(/<\/?head\b[^>]*>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "")
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<body\b([^>]*)>/gi, (_m, bodyAttrs: string) => {
      const clsMatch = bodyAttrs.match(/class=["']([^"']+)["']/i);
      return clsMatch ? `<div class="${clsMatch[1]}">` : "";
    })
    .replace(/<\/body>/gi, (_m, _offset: number, fullStr: string) => {
      // Only emit closing </div> if we replaced <body class="..."> with an opening <div>
      return /<body\b[^>]*class=/i.test(rawMainHtml) && fullStr ? "</div>" : "";
    });

  cleaned = balanceDivTags(cleaned);

  // If SSR subbar contains a non-empty eStore price, ensure showPrice state replaces noPrice
  const moneyMatch = cleaned.match(/ProductTabBar__productMoney__[^>]*>([^<]+)</i);
  if (moneyMatch && moneyMatch[1].trim().length > 0) {
    cleaned = cleaned.replace(
      /ProductTabBar__noPrice__wQ7fE/g,
      "ProductTabBar__showPrice__cUx1E"
    );
  }

  // Hydrate empty SSR article card thumbnails (<div class="ActionFourItem__articleContentImage__vnocA"><!----></div>)
  cleaned = cleaned.replace(
    /(<a[^>]+href=["']\/vn\/(articles\/[^"']+)["'][^>]*>[\s\S]{0,600}?ActionFourItem__articleContentImage__[^>]*>)\s*(?:<!---->)?\s*(<\/div>)/gi,
    (_m, prefix: string, artRelPath: string, suffix: string) => {
      const cleanKey = artRelPath.replace(/\/+$/, "").replace(/\//g, "_").toLowerCase();
      const thumb = ARTICLE_THUMBS[cleanKey];
      if (!thumb) return `${prefix}${suffix}`;
      return `${prefix}<img src="${thumb}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" />${suffix}`;
    }
  );

  return {
    sanitizedMainHtml: cleaned,
    allCssLinks: [...baseCssLinks, ...extraCssLinks],
    allStyles: [...baseStyles, ...extraStyles],
    extractedScripts,
    wfPage,
    wfSite,
  };
}

const CACHE_DIR = path.join(process.cwd(), ".cache", "rog-catalog");

export async function fetchRogPage(slugPath: string): Promise<{
  title: string;
  cssLinks: string[];
  styles: string[];
  mainHtml: string;
} | null> {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch {
    // ignore
  }

  const cleanSlugPath = slugPath.replace(/^\/+|\/+$/g, "");
  const baseKey = cleanSlugPath.replace(/[^a-zA-Z0-9-_]/g, "_");

  const candidates = [
    baseKey,
    `${baseKey}-model`,
    baseKey.replace(/-2025-/, "-2026-"),
    baseKey.replace(/_rog-hyperion_/, "_"),
    baseKey.replace(/_rog-rapture_/, "_"),
    baseKey.replace(/-pro$/, "-model"),
    baseKey.replace(/-gr701$/, "-gr701-model"),
    baseKey.replace(/cases_rog-hyperion_rog-hyperion-gr701/, "cases_rog-hyperion-gr701-model"),
    baseKey.replace(/networking_rog-rapture_rog-rapture-gt-be98-pro/, "networking_rog-rapture-gt-be98-model"),
  ];

  for (const c of candidates) {
    const cacheFile = path.join(CACHE_DIR, `${c}.json`);
    if (fs.existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
        return cached;
      } catch {
        // cache corrupted
      }
    }
  }

  // Attempt fetch from rog.asus.com/vn/
  const targetUrl = `https://rog.asus.com/vn/${cleanSlugPath}/`;
  let res: Response;
  try {
    res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      next: { revalidate: 86400 },
    });
  } catch {
    return null;
  }

  if (!res.ok) {
    return null;
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

  // 3. Extract inline style tags
  const styleMatches = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  const styles = styleMatches.map((m) => m[1]);

  // 4. Extract Main Product Content
  const mainStart = text.indexOf("<main");
  const mainEnd = text.lastIndexOf("</main>");
  let mainHtml = "";
  if (mainStart !== -1 && mainEnd !== -1) {
    mainHtml = text.slice(mainStart, mainEnd + 7);
  } else {
    // Fallback: look for productOverview or layout
    const overviewIdx = text.indexOf('class="productOverview"');
    if (overviewIdx !== -1) {
      const startTag = text.lastIndexOf("<div", overviewIdx);
      const footerIdx = text.indexOf("<footer");
      mainHtml = text.slice(startTag, footerIdx !== -1 ? footerIdx : undefined);
    }
  }

  if (!mainHtml) {
    return null;
  }

  // 5. Rewrite root-relative media assets to https://rog.asus.com/
  mainHtml = mainHtml.replace(
    /(src|data-src|poster)=["']\/(?!\/)([^"']+)["']/gi,
    '$1="https://rog.asus.com/$2"'
  );
  mainHtml = mainHtml.replace(
    /(src|data-src|poster)=["']\/\/(dlcdn[^\s"'>]+)["']/gi,
    '$1="https://$2"'
  );

  // Preserve local /vn/ links for internal navigation ("Xem thêm", "Thông số kỹ thuật", "Chi tiết", "Nơi mua", v.v.)
  mainHtml = mainHtml.replace(
    /href=["']https:\/\/rog\.asus\.com\/vn\/([^"']+)["']/gi,
    'href="/vn/$1"'
  );
  mainHtml = mainHtml.replace(
    /href=["']\/(?!vn\/)(?!\/)([^"']+)["']/gi,
    'href="https://rog.asus.com/$1"'
  );

  // Promote lazy-load images to real src
  mainHtml = mainHtml.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    const lazyMatch = attrs.match(/data-src=["']([^"']+)["']/i);
    if (lazyMatch && (!attrs.includes('src=') || attrs.includes('src=""') || attrs.includes('blank.gif'))) {
      newAttrs = newAttrs.replace(/src=["'][^"']*["']/i, '');
      newAttrs += ` src="${lazyMatch[1]}"`;
    }
    return `<img ${newAttrs}>`;
  });

  // Ensure videos have autoplay & muted
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

  try {
    const primaryCacheFile = path.join(CACHE_DIR, `${baseKey}.json`);
    fs.writeFileSync(primaryCacheFile, JSON.stringify(result));
  } catch {
    // ignore
  }

  return result;
}

export default async function RogUniversalProductOverview({ slug }: Props) {
  const slugPath = slug.join("/");

  // 1. Prioritize official ASUS ROG presentation
  const data = await fetchRogPage(slugPath);

  // 2. If no official page exists, check Admin Backend for custom-created products
  if (!data) {
    let dbProduct = null;
    try {
      dbProduct = await RogApi.getProductItem(slugPath);
    } catch {
      // not in db
    }

    if (dbProduct) {
      return <RogCustomProductView product={dbProduct} />;
    }

    notFound();
  }

  const isCatalogListing =
    data.mainHtml.includes("ProductResult__") ||
    data.mainHtml.includes("ProductResultItem__") ||
    (data.mainHtml.includes("SeriesHome__") && !data.mainHtml.includes("productOverview"));

  const { sanitizedMainHtml, allCssLinks, allStyles, extractedScripts, wfPage, wfSite } =
    prepareOverviewAssets(data.mainHtml, data.cssLinks, data.styles);

  const seenCss = new Set<string>();
  const resolvedCssLinks = allCssLinks
    .map((linkStr) => {
      const hrefMatch = linkStr.match(/href=["']([^"']+)["']/i);
      if (!hrefMatch) return null;
      let href = hrefMatch[1].replace(/&amp;/g, "&");
      if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/sites/")) {
        href = `https://rog.asus.com${href}`;
      } else if (href.startsWith("//")) {
        href = `https:${href}`;
      }
      if (href.includes("fontHQ.css")) {
        href = "/sites/rog-asus/fonts/fontHQ.css";
      }
      // Drop dead legacy 2B37C5BC CDN CSS links that now 404 upstream & CORS-blocked legacy font.css
      if (
        href.includes("2B37C5BC-FC31-4697-925A-6622E78C5CF9/dist/overview/css/overview.css") ||
        href.includes("2B37C5BC-FC31-4697-925A-6622E78C5CF9/v4/css/features.css") ||
        href.includes("vinnjsoyhjlwgtj7/css/font.css")
      ) {
        return null;
      }
      if (seenCss.has(href)) return null;
      seenCss.add(href);
      return href;
    })
    .filter((u): u is string => Boolean(u));

  const combinedInlineCss = allStyles.filter((s) => s && s.trim().length > 0).join("\n");

  return (
    <div
      className={`rog-page rog-universal-page ${isCatalogListing ? "rog-catalog-light" : ""}`}
      style={{
        backgroundColor: isCatalogListing ? "#ffffff" : "#000",
        color: isCatalogListing ? "#181818" : "#fff",
        minHeight: "100vh",
      }}
      suppressHydrationWarning
    >
      {/* 1. Official ROG Header */}
      <RogNavbar />

      {/* 2. Official Product Stylesheets (React 19 hoisted cleanly via precedence) */}
      {resolvedCssLinks.map((href) => (
        <link
          key={href}
          rel="stylesheet"
          href={href}
          precedence="rog"
        />
      ))}

      {/* 3. Inline Styles */}
      {combinedInlineCss ? (
        <style
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: combinedInlineCss }}
        />
      ) : null}

      {/* 4. Product Main Content */}
      <div
        className="rog-universal-main-container"
        dangerouslySetInnerHTML={{ __html: sanitizedMainHtml }}
        suppressHydrationWarning
      />

      {/* 5. Official ROG Footer */}
      <RogFooter />

      {/* 6. ROG AI Chat Widget */}
      <RogChatWidget />

      {/* 7. Client Interactive Controllers (Catalog vs Product Detail Runtime) */}
      {isCatalogListing ? (
        <RogCatalogInteractive />
      ) : (
        <RogDetailInteractive
          scripts={extractedScripts}
          slugPath={slugPath}
          wfPage={wfPage}
          wfSite={wfSite}
        />
      )}
    </div>
  );
}
