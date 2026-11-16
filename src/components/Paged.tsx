"use client";

import { useState, type ReactNode } from "react";

/** 긴 목록을 몇 개씩 나눠 보여주는 페이지 넘김 */
export function Paged({ items, per = 4, id }: { items: ReactNode[]; per?: number; id?: string }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(items.length / per);
  const go = (p: number) => {
    setPage(p);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <>
      {items.slice(page * per, page * per + per)}
      {pages > 1 && (
        <div className="grid-frame -mt-px grid-cols-[1fr_auto_1fr] md:grid-cols-4">
          <div className="cell">
            <button onClick={() => go(page - 1)} disabled={page === 0} className="label ulink disabled:invisible">← Prev</button>
          </div>
          <div className="cell flex items-center justify-center gap-4 text-[11px] tabular-nums md:col-span-2">
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => go(i)} className={i === page ? "underline underline-offset-4" : "text-muted hover:text-ink"}>
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <div className="cell text-right">
            <button onClick={() => go(page + 1)} disabled={page === pages - 1} className="label ulink disabled:invisible">Next →</button>
          </div>
        </div>
      )}
    </>
  );
}
