import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  let skusCsv = "";
  try {
    const body = await request.json();
    const raw = body?.skuWebPathName ?? body?.skus ?? "";
    skusCsv = Array.isArray(raw) ? raw.join(",") : String(raw);
  } catch {
    return NextResponse.json({ result: [] }, { status: 400 });
  }

  if (!skusCsv.trim()) {
    return NextResponse.json({ result: [] });
  }

  try {
    const res = await fetch(
      "https://api-rog.asus.com/api/nc/v4/NoCache/SkuPrice?systemCode=rog",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
          Referer: "https://rog.asus.com/vn/",
        },
        body: JSON.stringify({ websiteCode: "vn", skuWebPathName: skusCsv }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.result) && json.result.length > 0) {
        return NextResponse.json(json);
      }
    }
  } catch {
    // Fall back to local cache
  }

  try {
    const cacheFile = path.join(process.cwd(), ".cache", "all-sku-prices.json");
    if (fs.existsSync(cacheFile)) {
      const map = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      const wanted = skusCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const result = wanted.map((k) => map[k]).filter(Boolean);
      return NextResponse.json({ result, source: "cache" });
    }
  } catch {}

  return NextResponse.json({ result: [] });
}
