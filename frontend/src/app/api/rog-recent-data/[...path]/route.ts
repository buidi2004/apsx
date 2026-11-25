import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPSTREAM_HOSTS = [
  "https://api-rog.asus.com/recent-data",
  "https://rog.asus.com/recent-data",
];

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await context.params;
  const relPath = (pathSegments || []).join("/");

  if (!relPath || !/^[a-zA-Z0-9/_.-]+$/.test(relPath) || relPath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const reqUrl = new URL(request.url);
  const qs = reqUrl.searchParams.toString();
  const suffix = qs ? `${relPath}?${qs}` : relPath;

  for (const base of UPSTREAM_HOSTS) {
    try {
      const upstream = await fetch(`${base}/${suffix}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
          Referer: "https://rog.asus.com/vn/",
        },
        next: { revalidate: 3600 },
      });
      if (upstream.ok) {
        const data = await upstream.json();
        return NextResponse.json(data);
      }
    } catch {
      // Try next upstream host or local cache fallback
    }
  }

  // Fallback to cached Filters JSON if offline
  const levelTagId =
    reqUrl.searchParams.get("LevelTagId") || reqUrl.searchParams.get("levelTagId") || "";
  if (relPath.toLowerCase().includes("filters") && levelTagId) {
    try {
      const dir = path.join(process.cwd(), ".cache", "rog-filters");
      if (fs.existsSync(dir)) {
        const match = fs.readdirSync(dir).find((f) => f.endsWith(`_${levelTagId}.json`));
        if (match) {
          return NextResponse.json(JSON.parse(fs.readFileSync(path.join(dir, match), "utf8")));
        }
      }
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ result: null }, { status: 502 });
}
