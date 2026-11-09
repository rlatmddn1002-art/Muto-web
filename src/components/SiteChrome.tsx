import Link from "next/link";
import { Mountain } from "./Mountain";

export const PAGES = [
  { href: "/about", en: "About", ko: "무토에 대하여" },
  { href: "/journal", en: "Journal", ko: "기록" },
  { href: "/work", en: "Work", ko: "연재 · 출판 · 작업" },
  { href: "/contact", en: "Contact", ko: "채널 · 연락" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-4 py-6 md:px-10 md:py-14">
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </main>
  );
}

export function SiteHeader({ current, tall = false }: { current?: string; tall?: boolean }) {
  const h = tall ? "md:h-72" : "md:h-28";
  return (
    <header className="grid-frame grid-cols-2 md:grid-cols-4">
      <div className={`cell ${h}`}>
        <Link href="/" className="inline-flex items-center gap-2 text-[14px] font-medium tracking-tight">
          <Mountain className="w-3.5 text-ink" title="" />
          MUTO
        </Link>
      </div>
      <nav className={`cell ${h}`}>
        <ul className="space-y-0.5 text-[11px]">
          {PAGES.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className={current === p.href ? "underline underline-offset-4" : "ulink"}>
                {p.en}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`cell hidden md:block ${h}`} />
      <div className={`cell hidden text-right md:block ${h}`}>
        <span className="sub">Seoul, Korea</span>
      </div>
    </header>
  );
}

export function PageTitle({ no, en, ko }: { no: string; en: string; ko: string }) {
  return (
    <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
      <div className="cell flex flex-col justify-end md:min-h-[220px]">
        <p className="label tabular-nums">{no}</p>
        <p className="sub mt-1">{ko}</p>
      </div>
      <div className="cell flex items-end md:col-span-3 md:min-h-[220px]">
        <h1 className="serif fade-in text-[44px] leading-none md:text-[72px]">{en}.</h1>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="grid-frame -mt-px grid-cols-3 md:grid-cols-4">
      <div className="cell label">© MUTO Associates</div>
      <div className="cell label md:col-span-2">
        <Link href="/" className="ulink">Index</Link>
      </div>
      <div className="cell label text-right">
        <Link href="/admin" className="ulink">Admin</Link>
      </div>
    </footer>
  );
}
