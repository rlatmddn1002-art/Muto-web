/** MUTO 로고 — 큰 산을 뜻하는 깔끔한 삼각형 */
export function Mountain({ className = "", title = "MUTO — 큰 산" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 87" className={className} role="img" aria-label={title}>
      <polygon points="50,0 100,86.6 0,86.6" fill="currentColor" />
    </svg>
  );
}
