import { getPublicActivities, getPublicMilestones } from "@/lib/data";
import type { Activity } from "@/lib/types";
import { getBlogPosts, type BlogPost } from "@/lib/naver";
import { SERIES_CATEGORIES, WORKS_CATEGORIES, inCategories, workOwner, workTitle } from "@/lib/series";
import { BlogImage } from "./BlogImage";
import Link from "next/link";

const statusLabel = (s: Activity["status"]) =>
  ({ 예정: "Planned", 진행: "Ongoing", 검토: "In review", 완료: "Published" })[s];

function Header({ id, title, note }: { id: string; title: string; note?: string }) {
  return (
    <div id={id} className="grid-frame -mt-px scroll-mt-6 grid-cols-2 md:grid-cols-4">
      <div className="cell pt-10 md:pt-14">
        <p className="text-[13px] font-medium"><span className="accent-bar" />{title}.</p>
      </div>
      <div className="cell pt-10 md:col-span-3 md:pt-14 text-right">
        {note && <p className="label">{note}</p>}
      </div>
    </div>
  );
}

function Row({ a, i, posts }: { a: Activity; i: number; posts?: BlogPost[] }) {
  if (a.image_url) return <ImageRow a={a} i={i} />;
  return (
    <div className="grid-frame -mt-px grid-cols-[56px_1fr] md:grid-cols-4">
      <div className="cell">
        <p className="label tabular-nums">{String(i + 1).padStart(2, "0")}</p>
        <p className="sub mt-1 hidden md:block">{a.where_label}</p>
      </div>
      <div className="cell md:col-span-2">
        <h3 className="text-[15px] font-medium leading-snug md:text-[16px]">{a.title}</h3>
        {a.summary && <p className="sub mt-2 max-w-[460px] leading-5">{a.summary}</p>}
        <p className="sub mt-2 md:hidden">{a.where_label}</p>
        {posts && posts.length > 0 && (
          <ul className="mt-5 space-y-1.5 border-t border-line pt-4">
            {posts.slice(0, 3).map((p, k) =>
              <li key={k} className="flex gap-4 text-[12px]">
                <span className="sub w-16 shrink-0 tabular-nums">{p.date.slice(0, 10).replace(/-/g, ".")}</span>
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="ulink truncate">{p.title}</a>
                ) : (
                  <span className="truncate">{p.title}</span>
                )}
              </li>
            )}
          </ul>
        )}
      </div>
      <div className="cell col-span-2 flex items-start justify-between gap-3 md:col-span-1 md:flex-col md:items-end">
        <span className={`tag ${a.status === "진행" ? "tag-on" : ""}`}>{statusLabel(a.status)}</span>
        {posts && (
          <span className="sub tabular-nums">최근 {posts.length}편</span>
        )}
        {a.link && (
          <a href={a.link} target="_blank" rel="noreferrer" className="label ulink">View →</a>
        )}
      </div>
    </div>
  );
}

/** 사진이 있는 프로젝트 — 레퍼런스처럼 큰 사진 + 옆에 짧은 설명 */
function ImageRow({ a, i }: { a: Activity; i: number }) {
  return (
    <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
      <div className="cell flex flex-col justify-between gap-8">
        <div>
          <p className="label tabular-nums">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-6 text-[15px] font-medium leading-snug">{a.title}</h3>
          <p className="sub mt-1">{a.where_label}</p>
        </div>
        <div className="space-y-3">
          {a.summary && <p className="text-[12px] leading-[1.8] text-ink/80">{a.summary}</p>}
          {a.link && (
            <a href={a.link} target="_blank" rel="noreferrer" className="label ulink">View →</a>
          )}
        </div>
      </div>
      <div className="cell md:col-span-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.image_url!} alt={a.title} className="ml-auto aspect-[4/3] w-full max-w-[360px] object-cover" loading="lazy" />
      </div>
    </div>
  );
}

function Block({ id, title, note, items, postsFor }: { id: string; title: string; note?: string; items: Activity[]; postsFor?: (a: Activity) => BlogPost[] | undefined }) {
  if (!items.length) return null;
  return (
    <section>
      <Header id={id} title={title} note={note} />
      {items.map((a, i) => (
        <Row key={a.id} a={a} i={i} posts={postsFor?.(a)} />
      ))}
    </section>
  );
}

async function workData() {
  const all = await getPublicActivities();
  const by = (area: string) => all.filter((a) => a.area === area);
  return { by };
}

function fmtDate(iso: string) {
  return iso ? iso.slice(0, 10).replace(/-/g, ".") : "";
}

/** 블로그 works 글 한 줄 — 사진이 있으면 크게 */
function BlogWorkRow({ p, i }: { p: BlogPost; i: number }) {
  const owner = workOwner(p.title);
  const title = workTitle(p.title);
  const info = (
    <div className="cell flex flex-col justify-between gap-8">
      <div>
        <div className="flex items-center justify-between">
          <p className="label tabular-nums">{String(i + 1).padStart(2, "0")}</p>
          <span className={`tag ${owner === "MUTO" ? "tag-on" : ""}`}>{owner}</span>
        </div>
        <h3 className="mt-6 text-[15px] font-medium leading-snug">{title}</h3>
        <p className="sub mt-1 tabular-nums">{fmtDate(p.date)}</p>
      </div>
      <div className="space-y-3">
        {p.excerpt && <p className="text-[12px] leading-[1.8] text-ink/75">{p.excerpt}</p>}
        {p.link && (
          <a href={p.link} target="_blank" rel="noreferrer" className="label ulink">블로그에서 보기 →</a>
        )}
      </div>
    </div>
  );
  return (
    <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
      {info}
      <div className="cell md:col-span-3">
        {p.image && <div className="ml-auto max-w-[360px]"><BlogImage src={p.image} alt={title} className="aspect-[4/3] w-full" /></div>}
      </div>
    </div>
  );
}

/** 건축 — 설계 · 연구 · 도구 */
export async function ArchitectureSections() {
  const { by } = await workData();
  const works = (await getBlogPosts()).filter((p) => inCategories(p.category, WORKS_CATEGORIES));
  const muto = works.filter((p) => workOwner(p.title) === "MUTO").length;
  return (
    <>
      {works.length > 0 && (
        <section>
          <Header id="projects" title="Projects" note={`블로그 works에서 자동 기록 · MUTO ${muto} · YKH ${works.length - muto}`} />
          {works.map((p, i) => (
            <BlogWorkRow key={p.link || i} p={p} i={i} />
          ))}
        </section>
      )}
      <Block id="projects-more" title={works.length ? "More" : "Projects"} note="설계 · 프로젝트" items={by("건축")} />
      <Block id="research" title="Research" note="대학원 · 연구" items={by("대학원")} />
      <Block id="tools" title="Tools" note="도구 · 서비스" items={by("서비스")} />
      <Block id="vision" title="Vision" note="스테이 · 카페" items={by("비전")} />
    </>
  );
}

/** 출판 — 연재 · 전자책 */
export async function PublishingSections() {
  const { by } = await workData();
  const blog = await getBlogPosts();
  const postsFor = (a: Activity) => {
    const cats = SERIES_CATEGORIES[a.title];
    return cats ? blog.filter((p) => inCategories(p.category, cats)) : undefined;
  };
  return (
    <>
      <Block id="series" title="Series" note="블로그 연재 · 새 글은 자동으로 기록돼요" items={by("콘텐츠")} postsFor={postsFor} />
      <div className="grid-frame -mt-px grid-cols-1">
        <div className="cell text-right"><Link href="/journal" className="label ulink">Journal에서 모든 글 보기 →</Link></div>
      </div>
      <Block id="books" title="Books" note="전자책 · 출판" items={by("출판")} />
    </>
  );
}

/** Work 첫 화면에 보여줄 개수 */
export async function WorkCounts() {
  const { by } = await workData();
  const works = (await getBlogPosts()).filter((p) => inCategories(p.category, WORKS_CATEGORIES)).length;
  return {
    architecture: works + ["건축", "대학원", "서비스", "비전"].reduce((n, a) => n + by(a).length, 0),
    publishing: by("콘텐츠").length + by("출판").length,
  };
}

export async function PublicTimeline() {
  const ms = await getPublicMilestones();
  if (!ms.length) return null;
  return (
    <section>
      <Header id="timeline" title="Timeline" />
      {ms.map((m) => (
        <div key={m.id} className="grid-frame -mt-px grid-cols-[96px_1fr] md:grid-cols-4">
          <div className="cell label tabular-nums">{m.when_label}</div>
          <div className="cell md:col-span-3">{m.label}</div>
        </div>
      ))}
    </section>
  );
}

export function SectionsFallback() {
  return (
    <div className="grid-frame -mt-px grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="cell h-40 animate-pulse" />
      ))}
    </div>
  );
}

export async function Channels() {
  const all = await getPublicActivities();
  const channels = all.filter((a) => a.area === "채널");
  if (!channels.length) return null;
  return (
        <section>
          <Header id="channels" title="Channels" note="MUTO를 만나는 곳" />
          <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
            {channels.map((c) => {
              const inner = (
                <>
                  <p className="sub">{c.where_label}</p>
                  <p className="mt-8 text-[14px] font-medium">{c.title}</p>
                </>
              );
              return c.link ? (
                <a key={c.id} href={c.link} target="_blank" rel="noreferrer" className="cell block transition-colors hover:bg-[#f6f6f6]">
                  {inner}
                </a>
              ) : (
                <div key={c.id} className="cell">{inner}</div>
              );
            })}
            {Array.from({ length: (4 - (channels.length % 4)) % 4 }).map((_, i) => (
              <div key={`f${i}`} className="cell hidden md:block" />
            ))}
          </div>
        </section>
  );
}
