"use client";

import { useState } from "react";

/** 네이버 블로그 사진 — 외부에서 막히면 조용히 숨겨요 */
export function BlogImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setOk(false)}
      className="aspect-[16/10] w-full object-cover"
    />
  );
}
