"use client";

import { useState } from "react";

export function proxied(src: string) {
  return `/api/img?u=${encodeURIComponent(src)}`;
}

/** 네이버 블로그 사진 — 홈페이지 서버를 거쳐 불러오고, 실패하면 조용히 숨겨요 */
export function BlogImage({ src, alt, className = "aspect-[16/10] w-full" }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={proxied(src)} alt={alt} loading="lazy" onError={() => setOk(false)} className={`${className} bg-[#f6f6f6] object-cover`} />
  );
}
