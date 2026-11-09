import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { WorkCounts } from "@/components/Sections";
import { PageTitle, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Work" };

const PARTS = [
  { href: "/work/architecture", key: "architecture", en: "Architecture", ko: "건축", note: "설계 · 연구 · 도구 · 비전" },
  { href: "/work/publishing", key: "publishing", en: "Publishing", ko: "출판", note: "연재 · 전자책" },
] as const;

async function Count({ k }: { k: "architecture" | "publishing" }) {
  const c = await WorkCounts();
  return <>{c[k]}</>;
}

export default function WorkPage() {
  return (
    <Shell>
      <SiteHeader current="/work" />
      <PageTitle no="03" en="Work" ko="건축 · 출판" />
      <nav className="grid-frame -mt-px grid-cols-1 md:grid-cols-2">
        {PARTS.map((p, i) => (
          <Link key={p.href} href={p.href} className="cell group flex min-h-[260px] flex-col justify-between transition-colors hover:bg-[#f6f6f6] md:min-h-[360px]">
            <span className="flex justify-between">
              <span className="label tabular-nums">03.{i + 1}</span>
              <span className="sub tabular-nums">
                <Suspense fallback="—">
                  <Count k={p.key} />
                </Suspense>
                개
              </span>
            </span>
            <span>
              <span className="serif block text-[36px] leading-none md:text-[48px]">{p.en}</span>
              <span className="sub mt-3 flex justify-between">
                {p.ko} — {p.note}
                <span className="text-ink transition-transform group-hover:translate-x-1">→</span>
              </span>
            </span>
          </Link>
        ))}
      </nav>
      <SiteFooter />
    </Shell>
  );
}
