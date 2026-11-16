import { BLOG_ID, type BlogPost } from "@/lib/naver";
import { TRACKED_CATEGORIES } from "@/lib/tracked";
import { inCategories } from "@/lib/series";

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";
const headers = { "User-Agent": UA, Referer: `https://m.blog.naver.com/${BLOG_ID}` };

async function json(url: string) {
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** 응답 모양이 조금 달라도 찾을 수 있게, 조건에 맞는 배열을 깊이 찾아요 */
function findArray(v: unknown, test: (x: Record<string, unknown>) => boolean): Record<string, unknown>[] {
  if (Array.isArray(v)) {
    if (v.length && typeof v[0] === "object" && v[0] && test(v[0] as Record<string, unknown>)) return v as Record<string, unknown>[];
    for (const x of v) {
      const r = findArray(x, test);
      if (r.length) return r;
    }
  } else if (v && typeof v === "object") {
    for (const x of Object.values(v)) {
      const r = findArray(x, test);
      if (r.length) return r;
    }
  }
  return [];
}

const clean = (s: unknown) =>
  String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function toDate(v: unknown) {
  if (typeof v === "number") return new Date(v).toISOString();
  const s = String(v ?? "");
  const m = s.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  return m ? new Date(`${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}T00:00:00+09:00`).toISOString() : "";
}

/** 블로그의 예전 글을 카테고리별로 모두 읽어와요 (네이버 모바일 화면이 쓰는 목록) */
export async function GET() {
  try {
    const catData = await json(`https://m.blog.naver.com/api/blogs/${BLOG_ID}/category-list`);
    const cats = findArray(catData, (x) => "categoryNo" in x && "categoryName" in x).filter((c) =>
      inCategories(String(c.categoryName), TRACKED_CATEGORIES)
    );
    if (!cats.length) return Response.json({ ok: false, error: "카테고리를 찾지 못했어요", posts: [] });

    const posts: BlogPost[] = [];
    for (const c of cats) {
      for (let page = 1; page <= 30; page++) {
        const data = await json(
          `https://m.blog.naver.com/api/blogs/${BLOG_ID}/post-list?categoryNo=${c.categoryNo}&itemCount=30&page=${page}`
        );
        const items = findArray(data, (x) => "logNo" in x);
        if (!items.length) break;
        for (const it of items) {
          posts.push({
            title: clean(it.titleWithInspectMessage ?? it.title),
            link: `https://blog.naver.com/${BLOG_ID}/${it.logNo}`,
            category: String(c.categoryName),
            excerpt: clean(it.briefContents ?? it.contents).slice(0, 160),
            date: toDate(it.addDate),
            image: (it.thumbnailUrl as string) || null,
          });
        }
        if (items.length < 30) break;
      }
    }
    return Response.json({ ok: true, posts });
  } catch (e) {
    return Response.json({ ok: false, error: String(e), posts: [] });
  }
}
