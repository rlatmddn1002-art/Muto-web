import { cacheLife } from "next/cache";

export type BlogPost = {
  title: string;
  link: string;
  category: string | null;
  excerpt: string;
  date: string; // ISO
};

export const BLOG_ID = process.env.NAVER_BLOG_ID || "nevereverdaily";
export const BLOG_URL = `https://blog.naver.com/${BLOG_ID}`;

function unwrap(s: string | undefined) {
  if (!s) return "";
  return s.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function textOf(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(item: string, name: string) {
  const m = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return unwrap(m?.[1]);
}

export function parseNaverRss(xml: string): BlogPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.map((it) => {
    const link = tag(it, "link").replace(/\?fromRss=true.*$/, "");
    const d = new Date(tag(it, "pubDate"));
    const excerpt = textOf(tag(it, "description"));
    return {
      title: textOf(tag(it, "title")),
      link,
      category: tag(it, "category") || null,
      excerpt: excerpt.length > 110 ? excerpt.slice(0, 110) + "…" : excerpt,
      date: isNaN(+d) ? "" : d.toISOString(),
    };
  });
}

/** 네이버 블로그 RSS에서 최근 글을 가져와요. 몇 분마다 새로 읽어요. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  "use cache";
  cacheLife("minutes");
  if (process.env.NAVER_DEMO === "1") return demoPosts();
  try {
    const res = await fetch(`https://rss.blog.naver.com/${BLOG_ID}.xml`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MUTO-site/1.0)" },
    });
    if (!res.ok) throw new Error(`RSS ${res.status}`);
    return parseNaverRss(await res.text());
  } catch (e) {
    console.error("naver rss", e);
    return [];
  }
}

/** 블로그 아이디를 넣기 전 미리보기용 — 화면에 '예시'로 표시돼요 */
function demoPosts(): BlogPost[] {
  const d = (s: string) => new Date(s).toISOString();
  return [
    { title: "예시 — 최신 글 제목이 여기에 표시돼요", link: "", category: "우리가 사는 공간의 비밀", excerpt: "글의 첫 문장이 짧게 이어져요.", date: d("2026-11-08") },
    { title: "예시 — 연재 글은 카테고리와 함께 쌓여요", link: "", category: "공간미학(국내)", excerpt: "블로그에 글을 쓰면 몇 분 안에 홈페이지에도 기록돼요.", date: d("2026-11-03") },
    { title: "예시 — 해외 공간도 함께 기록돼요", link: "", category: "공간미학(해외)", excerpt: "카테고리별로 걸러 볼 수도 있어요.", date: d("2026-10-27") },
  ];
}
