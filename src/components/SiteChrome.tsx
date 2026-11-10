import Link from "next/link";
import { Logo } from "./Logo";
import { InstallApp } from "./InstallApp";

export const PAGES = [
  { href: "/about", en: "About", ko: "무토에 대하여" },
  { href: "/journal", en: "Journal", ko: "기록" },
  { href: "/work", en: "Work", ko: "건축 · 출판" },
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
        <Link href="/" className="inline-block" aria-label="MUTO Associates — 처음으로">
          <Logo />
        </Link>
      </div>
      <nav className={`cell ${h}`}>
        <ul className="space-y-0.5 text-[11px]">
          {PAGES.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className={current?.startsWith(p.href) ? "underline underline-offset-4" : "ulink"}>
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
      <div className="cell flex flex-col justify-end md:min-h-[180px]">
        <p className="label tabular-nums">{no}</p>
        <p className="sub mt-1">{ko}</p>
      </div>
      <div className="cell flex items-end md:col-span-3 md:min-h-[180px]">
        <h1 className="serif fade-in text-[30px] leading-none md:text-[40px]">{en}.</h1>
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
      <div className="cell label flex justify-end gap-4">
        <InstallApp />
        <Link href="/admin" className="ulink">Admin</Link>
      </div>
    </footer>
  );
}
