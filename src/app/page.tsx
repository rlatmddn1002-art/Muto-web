import { Suspense } from "react";
import Link from "next/link";
import { PublicSections, PublicTimeline, SectionsFallback } from "@/components/Sections";

export default function Home() {
  return (
    <main>
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/75 backdrop-blur-xl backdrop-saturate-150">
        <nav className="mx-auto flex h-12 max-w-[980px] items-center justify-between px-6 text-[13px]">
          <a href="#top" className="font-semibold tracking-[.32em]">MUTO</a>
          <div className="flex gap-6 text-ink/70">
            <a href="#series" className="hover:text-ink">연재</a>
            <a href="#books" className="hover:text-ink">출판</a>
            <a href="#works" className="hover:text-ink">작업</a>
            <a href="#channels" className="hover:text-ink">채널</a>
          </div>
        </nav>
      </header>

      <section id="top" className="px-6 pb-28 pt-28 text-center md:pb-36 md:pt-40">
        <p className="eyebrow fade-in">戊土 · Architecture · Writing · Space</p>
        <h1 className="serif fade-in d2 mt-6 text-[56px] leading-[1.05] md:text-[96px]">MUTO Associates</h1>
        <p className="fade-in d3 mx-auto mt-6 max-w-[620px] text-[19px] leading-[1.6] text-muted md:text-[24px]">
          건축을 글과 콘텐츠, 공간 기획으로 번역합니다.
          <br className="hidden md:block" /> 우리가 사는 공간에 숨은 경험의 구조를 기록합니다.
        </p>
        <div className="fade-in d3 mt-8 flex justify-center gap-8">
          <a href="#series" className="link-more">연재 보기 ›</a>
          <a href="#books" className="link-more">출판 보기 ›</a>
        </div>
        <div className="mx-auto mt-20 accent-bar" />
        <p className="mt-6 text-[13px] text-muted">Founder &amp; Architect · KIM Seung woo</p>
      </section>

      <section className="bg-paper px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-[980px] gap-14 text-center md:grid-cols-3 md:gap-8">
          {[
            ["持続", "지속가능성", "오래 머물 수 있는 공간과 생각을 만듭니다."],
            ["構造", "경험의 구조", "공간이 사람에게 남기는 감각을 설계합니다."],
            ["静寂", "콰이어트 럭셔리", "드러내기보다 오래 남는 품격을 택합니다."],
          ].map(([jp, ko, d]) => (
            <div key={ko}>
              <p className="text-[13px] tracking-[.4em] text-muted">{jp}</p>
              <p className="serif mt-4 text-[28px]">{ko}</p>
              <p className="mx-auto mt-3 max-w-[240px] text-[15px] leading-7 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <Suspense fallback={<SectionsFallback />}>
        <PublicSections />
      </Suspense>

      <Suspense fallback={null}>
        <PublicTimeline />
      </Suspense>

      <footer className="bg-paper">
        <div className="mx-auto flex max-w-[980px] items-center justify-between border-t border-line px-6 py-6 text-[12px] text-muted">
          <span>Copyright © MUTO Associates. All rights reserved.</span>
          <Link href="/admin" className="hover:text-ink">관리</Link>
        </div>
      </footer>
    </main>
  );
}
