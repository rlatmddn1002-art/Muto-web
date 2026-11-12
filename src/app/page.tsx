import Link from "next/link";
import { LogoIntro } from "@/components/LogoIntro";
import { PAGES, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function Home() {
  return (
    <Shell>
      <p className="eyebrow mb-6 md:mb-10">Index</p>
      <SiteHeader tall />

      <section className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
        <div className="cell flex flex-col justify-between gap-16 md:min-h-[460px]">
          <div>
            <p className="text-[22px] font-light tracking-[.04em] md:text-[26px]">戊土</p>
            <p className="font-logo mt-1 text-[12px] font-light text-muted md:text-[13px]">Architecture studio</p>
          </div>
          <p className="text-[12px] leading-6 text-ink/80">
            무토(戊土)는 큰 산을 의미합니다.
            <br />
            건축을 기반으로 다양한 분야와 협업하며 문화적 확장이라는 나무를 피워 나갑니다.
          </p>
        </div>
        <div className="cell flex min-h-[320px] items-center justify-center md:col-span-3">
          <LogoIntro />
        </div>
      </section>

      <nav className="grid-frame -mt-px grid-cols-2 md:grid-cols-4">
        {PAGES.map((p, i) => (
          <Link key={p.href} href={p.href} className="cell group flex min-h-[150px] flex-col justify-between transition-colors hover:bg-[#f6f6f6] md:min-h-[200px]">
            <span className="label tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="serif block text-[17px] md:text-[19px]">{p.en}</span>
              <span className="sub mt-1 flex justify-between">
                {p.ko}
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
