"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/naver";
import { SERIES_CATEGORIES, inCategories } from "@/lib/series";
import { BlogImage } from "./BlogImage";

const FILTERS: { label: string; cats: string[] | null }[] = [
  { label: "전체", cats: null },
  ...Object.entries(SERIES_CATEGORIES).flatMap(([name, cats]) =>
    cats.length > 1 ? cats.map((c) => ({ label: c, cats: [c] })) : [{ label: name, cats }]
  ),
];

function fmt(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function JournalList({ posts }: { posts: BlogPost[] }) {
  const [f, setF] = useState(0);
  const cats = FILTERS[f].cats;
  const shown = cats ? posts.filter((p) => inCategories(p.category, cats)) : posts;
  return (
    <>
      <div className="grid-frame -mt-px grid-cols-1">
        <div className="cell flex flex-wrap gap-x-5 gap-y-2 text-[11px]">
          {FILTERS.map((x, i) => (
            <button key={x.label} onClick={() => setF(i)} className={i === f ? "underline underline-offset-4" : "text-muted hover:text-ink"}>
              {x.label}
            </button>
          ))}
        </div>
      </div>
      {shown.length === 0 && (
        <div className="grid-frame -mt-px">
          <div className="cell sub py-12 text-center">최근 글 중에는 이 연재의 글이 없어요.</div>
        </div>
      )}
      {shown.map((p, i) => {
        const body = (
          <>
            <div className="cell">
              <p className="label tabular-nums">{fmt(p.date)}</p>
            </div>
            <div className="cell flex gap-5 md:col-span-2">
              {p.image && (
                <div className="w-24 shrink-0 md:w-32">
                  <BlogImage src={p.image} alt="" className="aspect-[4/3] w-full" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="serif text-[16px] leading-snug md:text-[18px]">{p.title}</h3>
                {p.excerpt && <p className="sub mt-2 line-clamp-2 max-w-[520px] leading-5 md:line-clamp-3">{p.excerpt}</p>}
              </div>
            </div>
            <div className="cell col-span-2 md:col-span-1 md:text-right">
              {p.category && <span className="sub">{p.category}</span>}
            </div>
          </>
        );
        const cls = "grid-frame -mt-px grid-cols-[96px_1fr] md:grid-cols-4";
        return p.link ? (
          <a key={i} href={p.link} target="_blank" rel="noreferrer" className={`${cls} transition-opacity hover:opacity-60`}>
            {body}
          </a>
        ) : (
          <div key={i} className={cls}>
            {body}
          </div>
        );
      })}
    </>
  );
}
