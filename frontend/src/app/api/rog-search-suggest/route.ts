import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ result: { obj: [] } });
  }

  try {
    const url = `https://api-rog.asus.com/recent-data/search-api/v1/SuggestionV1/vn/product,campaign,faq,article/5,5,5,5?SearchKey=${encodeURIComponent(
      q.trim()
    )}&systemCode=rog`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: "https://rog.asus.com/vn/",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ result: { obj: [] } });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ result: { obj: [] }, error: String(err) });
  }
}
