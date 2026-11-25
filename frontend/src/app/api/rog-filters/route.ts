import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const levelTagId = searchParams.get("levelTagId") || searchParams.get("LevelTagId") || "";
  const itemIds = searchParams.get("itemId") || searchParams.get("itemIds") || "";
  const page = searchParams.get("page") || searchParams.get("Page") || "1";
  const count = searchParams.get("count") || searchParams.get("Count") || "9";
  const sort = searchParams.get("sort") || searchParams.get("Sort") || "date";
  const cat = searchParams.get("cat") || "";

  // First try local cached facet-map when requesting category tree
  if (cat && !itemIds) {
    try {
      const facetPath = path.join(process.cwd(), ".cache", "rog-filters", "facet-map.json");
      if (fs.existsSync(facetPath)) {
        const facetData = JSON.parse(fs.readFileSync(facetPath, "utf8"));
        const catFacet = facetData.byCategory?.[cat];
        if (catFacet) {
          return NextResponse.json({ result: catFacet, source: "cache" });
        }
      }
    } catch {}
  }

  if (!levelTagId) {
    return NextResponse.json({ result: { skus: [], skuCount: 0 } });
  }

  try {
    const qs = new URLSearchParams({
      Page: page,
      Count: count,
      WebsiteCode: "vn",
      LevelTagId: levelTagId,
      Sort: sort,
      systemCode: "rog",
    });
    if (itemIds) {
      qs.set("itemId", itemIds);
    }

    const res = await fetch(
      `https://api-rog.asus.com/recent-data/api/v8/Filters?${qs.toString()}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
          Referer: "https://rog.asus.com/vn/",
        },
        next: { revalidate: 3600 },
      }
    );

    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }
  } catch {}

  // Offline cache fallback for levelTagId
  try {
    const dir = path.join(process.cwd(), ".cache", "rog-filters");
    if (fs.existsSync(dir)) {
      const match = fs.readdirSync(dir).find((f) => f.endsWith(`_${levelTagId}.json`));
      if (match) {
        const cached = JSON.parse(fs.readFileSync(path.join(dir, match), "utf8"));
        return NextResponse.json(cached);
      }
    }
  } catch {}

  return NextResponse.json({ result: { skus: [], skuCount: 0 } });
}
