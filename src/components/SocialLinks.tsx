import { BLOG_URL } from "@/lib/naver";

export const SOCIAL = {
  blog: BLOG_URL,
  instagram: "https://www.instagram.com/muto_associates/",
  youtube: "https://www.youtube.com/@muto_space",
};

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function BlogIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" {...s} />
      <path d="M9 7.5v9M9 12.2c.6-1.3 1.6-2 3-2 1.8 0 3 1.4 3 3.2s-1.2 3.1-3 3.1c-1.4 0-2.4-.7-3-2" {...s} />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" {...s} />
      <circle cx="12" cy="12" r="3.8" {...s} />
      <circle cx="17" cy="7" r=".6" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" aria-hidden>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" {...s} />
      <path d="M10.3 9.3v5.4l4.6-2.7z" fill="currentColor" />
    </svg>
  );
}

/** 블로그 · 인스타 · 유튜브 바로가기 — 작은 선 아이콘 */
export function SocialLinks({ className = "" }: { className?: string }) {
  const items = [
    { href: SOCIAL.blog, label: "네이버 블로그 — 무토의 공간미학", icon: <BlogIcon /> },
    { href: SOCIAL.instagram, label: "Instagram — @muto_associates", icon: <InstagramIcon /> },
    { href: SOCIAL.youtube, label: "YouTube — 공간미학", icon: <YoutubeIcon /> },
  ];
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map((x) => (
        <a key={x.href} href={x.href} target="_blank" rel="noreferrer" aria-label={x.label} title={x.label} className="text-ink/70 transition-colors hover:text-ink">
          {x.icon}
        </a>
      ))}
    </div>
  );
}
