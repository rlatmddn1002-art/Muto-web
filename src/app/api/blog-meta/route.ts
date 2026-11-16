import { BLOG_ID } from "@/lib/naver";

/** 글 주소 하나로 제목·사진·요약·날짜를 읽어와요 (관리 앱에서 직접 추가할 때) */
export async function GET(req: Request) {
  const u = new URL(req.url).searchParams.get("u") ?? "";
  const m = u.match(/blog\.naver\.com\/([^/?#]+)\/(\d+)/) ?? u.match(/blogId=([^&]+).*logNo=(\d+)/);
  if (!m) return Response.json({ ok: false, error: "네이버 블로그 글 주소가 아니에요" });
  const [, id, logNo] = m;
  try {
    const res = await fetch(`https://m.blog.naver.com/${id}/${logNo}`, {
      headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148" },
      cache: "no-store",
    });
    const html = await res.text();
    const meta = (p: string) =>
      (html.match(new RegExp(`<meta[^>]+property=["']${p}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ??
        html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${p}["']`, "i"))?.[1] ??
        "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    const d = html.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.\s*\d{1,2}:\d{2}/);
    const image = meta("og:image");
    return Response.json({
      ok: true,
      post: {
        title: meta("og:title").replace(/\s*:\s*네이버 블로그$/, ""),
        link: `https://blog.naver.com/${id || BLOG_ID}/${logNo}`,
        excerpt: meta("og:description").slice(0, 160),
        image: image && !/blog_profile|og_default|noimg/i.test(image) ? image : null,
        date: d ? new Date(`${d[1]}-${d[2].padStart(2, "0")}-${d[3].padStart(2, "0")}T00:00:00+09:00`).toISOString() : null,
      },
    });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) });
  }
}
