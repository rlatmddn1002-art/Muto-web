import { getBlogPosts } from "@/lib/naver";
import { TRACKED_CATEGORIES } from "@/lib/tracked";
import { inCategories } from "@/lib/series";

/** 관리 앱이 RSS 최근 글을 보관함에 옮겨 담을 때 써요 */
export async function GET() {
  const posts = (await getBlogPosts()).filter((p) => p.link && inCategories(p.category, TRACKED_CATEGORIES));
  return Response.json({ posts });
}
