"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/lib/naver";
import { TRACKED_CATEGORIES } from "@/lib/tracked";

type Row = BlogPost & { updated_at?: string };

function fmt(iso: string | null) {
  return iso ? iso.slice(0, 10).replace(/-/g, ".") : "날짜 없음";
}

/** 관리 앱 · 블로그 보관함 — RSS에서 밀려나도 홈페이지에 남도록 글을 쌓아둬요 */
export function BlogArchive({ db, flash: flashProp }: { db: SupabaseClient | null; flash: (m: string) => void }) {
  const flashRef = useRef(flashProp);
  flashRef.current = flashProp;
  const flash = useCallback((m: string) => flashRef.current(m), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState("");
  const [links, setLinks] = useState("");
  const [cat, setCat] = useState(TRACKED_CATEGORIES[0]);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    if (!db) return;
    const { data } = await db.from("blog_posts").select("*").order("date", { ascending: false, nullsFirst: false }).limit(2000);
    setRows((data as Row[]) ?? []);
  }, [db]);

  const save = useCallback(
    async (posts: BlogPost[]) => {
      if (!db || !posts.length) return 0;
      const clean = posts.map((p) => ({ ...p, date: p.date || null, updated_at: new Date().toISOString() }));
      const { data, error } = await db.from("blog_posts").upsert(clean, { onConflict: "link" }).select("link");
      if (error) {
        flash(error.message.includes("blog_posts") ? "Supabase에 보관함 표가 아직 없어요 — SQL을 먼저 실행해 주세요" : error.message);
        return -1;
      }
      if (!data?.length) {
        flash("저장되지 않았어요 — 관리자 권한을 확인해 주세요");
        return -1;
      }
      return data.length;
    },
    [db, flash]
  );

  // 열 때마다 RSS 최근 글을 보관함에 옮겨 담아요
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/blog-feed").then((x) => x.json());
        await save(r.posts ?? []);
      } catch {}
      await load();
    })();
  }, [load, save]);

  async function backfill() {
    setBusy("예전 글을 찾는 중…");
    try {
      const r = await fetch("/api/blog-backfill").then((x) => x.json());
      if (!r.ok || !r.posts?.length) {
        flash("블로그에서 자동으로 읽어오지 못했어요 — 아래에 글 주소를 붙여넣어 추가해 주세요");
      } else {
        const n = await save(r.posts);
        if (n > 0) flash(`${n}편을 보관했어요`);
      }
    } finally {
      setBusy("");
      load();
    }
  }

  async function addLinks() {
    const list = links.split(/\s+/).filter((l) => /blog\.naver\.com/.test(l));
    if (!list.length) return flash("네이버 블로그 글 주소를 넣어 주세요");
    const posts: BlogPost[] = [];
    let i = 0;
    for (const u of list) {
      setBusy(`글 읽는 중… ${++i}/${list.length}`);
      const r = await fetch(`/api/blog-meta?u=${encodeURIComponent(u)}`).then((x) => x.json()).catch(() => null);
      if (r?.ok) posts.push({ ...r.post, category: cat });
    }
    const n = await save(posts);
    setBusy("");
    if (n > 0) {
      flash(`${n}편을 추가했어요${n < list.length ? ` · ${list.length - n}편은 읽지 못했어요` : ""}`);
      setLinks("");
    }
    load();
  }

  async function remove(r: Row) {
    if (!db || !confirm(`"${r.title}"을 보관함에서 뺄까요? (블로그 글은 그대로예요)`)) return;
    await db.from("blog_posts").delete().eq("link", r.link);
    load();
  }

  const shown = filter ? rows.filter((r) => r.category === filter) : rows;
  const count = (c: string) => rows.filter((r) => r.category === c).length;

  return (
    <div className="mt-6 space-y-8">
      <section className="border border-line bg-white p-5">
        <p className="text-[13px] font-medium">보관함 {rows.length}편</p>
        <p className="mt-1 text-[11px] leading-5 text-muted">
          RSS는 최근 약 30편만 보여줘서, 여기 쌓아둔 글로 홈페이지 목록을 채워요. 이 화면을 열 때마다 새 글이 자동으로 담겨요.
        </p>
        <button className="btn btn-dark mt-4" disabled={!!busy} onClick={backfill}>
          예전 글 모두 가져오기
        </button>
        {busy && <span className="ml-3 text-[11px] text-muted">{busy}</span>}
      </section>

      <section className="border border-line bg-white p-5">
        <p className="text-[13px] font-medium">글 주소로 직접 추가</p>
        <textarea
          className="input mt-3 h-28 font-mono text-[11px]"
          placeholder={"https://blog.naver.com/nevereverdaily/2240...\n한 줄에 하나씩 붙여넣어요"}
          value={links}
          onChange={(e) => setLinks(e.target.value)}
        />
        <div className="mt-3 flex gap-2">
          <select className="input !w-auto" value={cat} onChange={(e) => setCat(e.target.value)}>
            {TRACKED_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button className="btn btn-dark" disabled={!!busy} onClick={addLinks}>
            추가
          </button>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px]">
          <button onClick={() => setFilter("")} className={!filter ? "underline underline-offset-4" : "text-muted"}>전체 {rows.length}</button>
          {TRACKED_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={filter === c ? "underline underline-offset-4" : "text-muted"}>
              {c} {count(c)}
            </button>
          ))}
        </div>
        <ul className="mt-4">
          {shown.map((r) => (
            <li key={r.link} className="-mt-px flex items-center gap-3 border border-line bg-white px-4 py-3">
              <div className="min-w-0 flex-1">
                <a href={r.link} target="_blank" rel="noreferrer" className="block truncate text-[13px]">{r.title}</a>
                <p className="text-[11px] text-muted">{r.category} · {fmt(r.date)}</p>
              </div>
              <button className="text-[11px] text-muted hover:text-ink" onClick={() => remove(r)}>빼기</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
