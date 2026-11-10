/**
 * 네이버 블로그 사진 중계
 * 네이버는 외부 사이트에서 사진을 직접 불러오는 걸 막는 경우가 있어서,
 * 홈페이지 서버가 대신 받아와서 보여줘요. 네이버 사진 주소만 허용해요.
 */
const ALLOWED = /(^|\.)(pstatic\.net|naver\.net|naver\.com)$/i;

export async function GET(request: Request) {
  const u = new URL(request.url).searchParams.get("u");
  if (!u) return new Response("missing", { status: 400 });
  let target: URL;
  try {
    target = new URL(u);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") return new Response("bad url", { status: 400 });
  if (!ALLOWED.test(target.hostname)) return new Response("not allowed", { status: 403 });
  target.protocol = "https:";

  const res = await fetch(target, {
    headers: {
      Referer: "https://blog.naver.com/",
      "User-Agent": "Mozilla/5.0 (compatible; MUTO-site/1.0)",
    },
  }).catch(() => null);
  if (!res || !res.ok) return new Response("not found", { status: 404 });
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) return new Response("not image", { status: 415 });

  return new Response(res.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
