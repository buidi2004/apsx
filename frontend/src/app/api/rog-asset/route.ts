import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "dlcdnwebimgs.asus.com",
  "dlcdnimgs.asus.com",
  "mediawebimg.asus.com",
]);

export async function GET(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url") || "";
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (
    parsed.protocol !== "https:" ||
    !ALLOWED_HOSTS.has(parsed.hostname) ||
    !/\.(?:vtt|srt)(?:$|\?)/i.test(parsed.pathname)
  ) {
    return NextResponse.json({ error: "Forbidden asset" }, { status: 403 });
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        Referer: "https://rog.asus.com/",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return new NextResponse("", { status: res.status });
    }
    const text = await res.text();
    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("", { status: 502 });
  }
}
