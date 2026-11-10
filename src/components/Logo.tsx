import { Mountain } from "./Mountain";

/**
 * MUTO 로고 — 검은 삼각형(큰 산) + 가는 글씨
 * inline: 머리글용 한 줄 / stacked: 메인용 세로 배치
 */
export function Logo({ variant = "inline", className = "" }: { variant?: "inline" | "stacked"; className?: string }) {
  if (variant === "stacked") {
    return (
      <div className={`inline-flex flex-col items-start ${className}`} aria-label="MUTO ASSOCIATES — Architecture studio">
        <Mountain className="w-7 text-ink md:w-8" title="" />
        <span className="font-logo mt-4 text-[17px] font-light tracking-[.04em] md:text-[20px]">MUTO ASSOCIATES</span>
        <span className="font-logo mt-0.5 text-[11px] font-light text-ink/70 md:text-[12px]">Architecture studio</span>
      </div>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="MUTO ASSOCIATES">
      <Mountain className="w-3 text-ink" title="" />
      <span className="font-logo text-[12px] font-light tracking-[.06em]">MUTO ASSOCIATES</span>
    </span>
  );
}
