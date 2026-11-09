import { getBlogPosts } from "@/lib/naver";

function fmt(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export async function Journal({ limit = 20 }: { limit?: number }) {
  const posts = (await getBlogPosts()).slice(0, limit);
  const blogUrl = process.env.NAVER_BLOG_ID ? `https://blog.naver.com/${process.env.NAVER_BLOG_ID}` : null;
  return (
    <section>
      <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
        <div className="cell md:col-span-4 md:text-right">
          {blogUrl ? (
            <a href={blogUrl} target="_blank" rel="noreferrer" className="label ulink">
              무토의 공간미학 — 블로그에서 전체 보기 →
            </a>
          ) : (
            <p className="label">무토의 공간미학 · 네이버 블로그</p>
          )}
        </div>
      </div>
      {posts.length === 0 && (
        <div className="grid-frame -mt-px">
          <div className="cell py-16 text-center sub">블로그에 쓴 글이 이곳에 자동으로 기록됩니다.</div>
        </div>
      )}
      {posts.map((p, i) => {
        const body = (
          <>
            <div className="cell">
              <p className="label tabular-nums">{fmt(p.date)}</p>
            </div>
            <div className="cell md:col-span-2">
              <h3 className="serif text-[16px] leading-snug md:text-[18px]">{p.title}</h3>
              {p.excerpt && <p className="sub mt-2 max-w-[520px] leading-5">{p.excerpt}</p>}
            </div>
            <div className="cell col-span-2 md:col-span-1 md:text-right">
              {p.category && <span className="sub">{p.category}</span>}
            </div>
          </>
        );
        return p.link ? (
          <a
            key={i}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="grid-frame -mt-px grid-cols-[96px_1fr] transition-opacity hover:opacity-60 md:grid-cols-4"
          >
            {body}
          </a>
        ) : (
          <div key={i} className="grid-frame -mt-px grid-cols-[96px_1fr] md:grid-cols-4">
            {body}
          </div>
        );
      })}
    </section>
  );
}
