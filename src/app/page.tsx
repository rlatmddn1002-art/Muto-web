import { Suspense } from "react";
import Link from "next/link";
import { PublicSections, PublicTimeline, SectionsFallback } from "@/components/Sections";

const NAV = [
  ["Series", "#series"],
  ["Publications", "#books"],
  ["Works", "#works"],
  ["Channels", "#channels"],
];

export default function Home() {
  return (
    <main id="top" className="px-4 py-6 md:px-10 md:py-14">
      <div className="mx-auto max-w-[1200px]">
        <p className="eyebrow mb-6 md:mb-10">Index</p>

        {/* 01 · Masthead */}
        <section className="grid-frame grid-cols-2 md:grid-cols-4">
          <div className="cell md:h-72">
            <a href="#top" className="text-[14px] font-medium tracking-tight">MUTO</a>
          </div>
          <div className="cell md:h-72 flex flex-col justify-between">
            <ul className="space-y-0.5 text-[11px]">
              {NAV.map(([l, h]) => (
                <li key={l}><a href={h} className="ulink">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="cell hidden md:flex md:h-72 justify-end">
            <span aria-hidden className="mt-1 block h-[5px] w-5 border-y border-ink" />
          </div>
          <div className="cell hidden md:block md:h-72 text-right">
            <a href="#channels" className="label ulink">Contact</a>
          </div>
          <div className="cell col-span-2 md:col-span-4 border-t-0 py-10 md:py-14">
            <h1 className="serif fade-in text-[40px] leading-[1.02] md:text-[72px]">MUTO Associates</h1>
          </div>
        </section>

        {/* 02 · Sign + profile */}
        <section className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
          <div className="cell md:row-span-2 flex flex-col justify-between gap-16">
            <div className="label leading-5">
              KIM Seung woo
              <br />
              <span className="text-muted">Founder &amp; Architect</span>
            </div>
            <div className="text-[12px] leading-6 text-ink/80">
              단단한 흙, 戊土에서 시작했습니다.
              <br />
              건축을 글과 콘텐츠, 공간 기획으로 번역하며
              우리가 사는 공간에 숨은 경험의 구조를 기록합니다.
            </div>
          </div>
          <div className="cell md:col-span-3 md:row-span-2 flex min-h-[340px] flex-col items-center justify-center bg-[#f6f6f6] md:min-h-[520px]">
            <div className="fade-in h-36 w-36 rounded-full bg-ink md:h-48 md:w-48" />
            <p className="mt-10 text-[9px] tracking-[.9em] text-ink/70">M U T O</p>
          </div>
        </section>

        {/* 03 · What / Who / Mood / Origin */}
        <section className="grid-frame -mt-px grid-cols-2 md:grid-cols-4">
          {[
            ["Practice", "Architecture\nWriting · Spatial direction"],
            ["Philosophy", "Sustainability\nStructure of experience"],
            ["Mood", "Quiet luxury"],
            ["Origin", "戊土 — 단단한 흙"],
          ].map(([k, v]) => (
            <div key={k} className="cell">
              <p className="label font-medium">{k}</p>
              <p className="sub mt-1 whitespace-pre-line">{v}</p>
            </div>
          ))}
        </section>

        <Suspense fallback={<SectionsFallback />}>
          <PublicSections />
        </Suspense>

        <Suspense fallback={null}>
          <PublicTimeline />
        </Suspense>

        {/* Footer */}
        <footer className="grid-frame -mt-px grid-cols-3 md:grid-cols-4">
          <div className="cell label">© MUTO Associates</div>
          <div className="cell label md:col-span-2"><a href="#top" className="ulink">Top</a></div>
          <div className="cell label text-right"><Link href="/admin" className="ulink">Admin</Link></div>
        </footer>
      </div>
    </main>
  );
}
