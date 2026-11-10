import { getBlogPosts } from "@/lib/naver";

/** 블로그 연동 상태 확인용 (공개 글 정보만) */
export async function GET() {
  const posts = await getBlogPosts();
  let probe: string | null = null;
  const m = posts[0]?.link.match(/blog\.naver\.com\/([^/?#]+)\/(\d+)/);
  if (m) {
    const r = await fetch(`https://m.blog.naver.com/${m[1]}/${m[2]}`, {
      headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148" },
    }).catch((e) => e as Error);
    if (r instanceof Error) probe = `error ${r.message}`;
    else {
      const t = await r.text();
      probe = `status ${r.status}; og=${t.match(/og:image[^>]*>/i)?.[0]?.slice(0, 200) ?? "none"}; len=${t.length}`;
    }
  }
  return Response.json({
    count: posts.length,
    withImage: posts.filter((p) => p.image).length,
    sample: posts.slice(0, 3).map((p) => ({ title: p.title, link: p.link, image: p.image })),
    probe,
  });
}
