import { BLOG_URL, getBlogPosts } from "@/lib/naver";
import { JournalList } from "./JournalList";
import { SERIES_CATEGORIES, inCategories } from "@/lib/series";

/** Journal에는 연재 카테고리 글만 보여요 */
const JOURNAL_CATEGORIES = Object.values(SERIES_CATEGORIES).flat();

export async function Journal({ limit = 30 }: { limit?: number }) {
  const posts = (await getBlogPosts()).filter((p) => inCategories(p.category, JOURNAL_CATEGORIES)).slice(0, limit);
  return (
    <section>
      <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
        <div className="cell md:col-span-4 md:text-right">
          <a href={BLOG_URL} target="_blank" rel="noreferrer" className="label ulink">
            무토의 공간미학 — 블로그에서 전체 보기 →
          </a>
        </div>
      </div>
      {posts.length === 0 ? (
        <div className="grid-frame -mt-px">
          <div className="cell sub py-16 text-center">블로그에 쓴 글이 이곳에 자동으로 기록됩니다.</div>
        </div>
      ) : (
        <JournalList posts={posts} />
      )}
    </section>
  );
}
