import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

interface Props {
  slug: string[];
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

  const cacheFile = path.join(
    CACHE_DIR,
    `${slugPath.replace(/[^a-zA-Z0-9-_]/g, "_")}.json`
  );

  if (fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      return cached;
    } catch {
      // cache corrupted, refetch
    }
  }

  // Attempt fetch from rog.asus.com/vn/
  const targetUrl = `https://rog.asus.com/vn/${slugPath}/`;
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
    fs.writeFileSync(cacheFile, JSON.stringify(result));
  } catch {
    // ignore
  }

  return result;
}

export default async function RogUniversalProductOverview({ slug }: Props) {
  const slugPath = slug.join("/");
  const data = await fetchRogPage(slugPath);

  if (!data) {
    notFound();
  }

  return (
    <div className="rog-page rog-universal-page" style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* 1. Official ROG Header */}
      <RogNavbar />

      {/* 2. Official Product Stylesheets */}
      {data.cssLinks.map((linkStr, i) => {
        const hrefMatch = linkStr.match(/href=["']([^"']+)["']/i);
        if (!hrefMatch) return null;
        return (
          <link
            key={i}
            rel="stylesheet"
            href={hrefMatch[1]}
            suppressHydrationWarning
          />
        );
      })}

      {/* 3. Inline Styles */}
      {data.styles.map((styleStr, i) => (
        <style
          key={`style-${i}`}
          dangerouslySetInnerHTML={{ __html: styleStr }}
        />
      ))}

      {/* 4. Product Main Content */}
      <div
        className="rog-universal-main-container"
        dangerouslySetInnerHTML={{ __html: data.mainHtml }}
        suppressHydrationWarning
      />

      {/* 5. Official ROG Footer */}
      <RogFooter />

      {/* 6. ROG AI Chat Widget */}
      <RogChatWidget />
    </div>
  );
}
