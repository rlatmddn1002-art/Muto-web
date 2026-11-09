/** MUTO 산 — 점묘로 표현한 큰 산. 위는 옅고 아래로 갈수록 짙은 물결 띠. */
const BANDS = [
  // [위쪽 경계 y, 짙기]
  [0, 0.28],
  [138, 0.37],
  [196, 0.45],
  [254, 0.54],
  [312, 0.62],
  [368, 0.71],
  [426, 0.81],
];

function wave(y: number, i: number) {
  if (y === 0) return "M0 0 H600 V520 H0 Z";
  const a = 10 + (i % 3) * 4;
  return `M0 ${y + a} C 120 ${y - a}, 220 ${y + a * 1.6}, 330 ${y} S 520 ${y - a * 1.2}, 600 ${y + a * 0.4} V520 H0 Z`;
}

export function Mountain({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 520" className={className} role="img" aria-label="MUTO — 큰 산">
      <defs>
        <clipPath id="muto-peak">
          <polygon points="300,0 600,520 0,520" />
        </clipPath>
        <filter id="muto-stipple" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="1" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 -0.3" result="n" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 0 0 0 1" result="dark" />
          <feComposite in="dark" in2="n" operator="arithmetic" k1="0" k2="6" k3="-6" k4="0.5" result="d" />
          <feComponentTransfer in="d" result="dots">
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
          <feColorMatrix in="dots" type="matrix" values="0 0 0 0 0.07  0 0 0 0 0.07  0 0 0 0 0.07  0 0 0 1 0" />
        </filter>
      </defs>
      <g clipPath="url(#muto-peak)" filter="url(#muto-stipple)">
        {BANDS.map(([y, k], i) => (
          <path key={i} d={wave(y, i)} fill={`rgb(${Math.round(255 * (1 - k))},${Math.round(255 * (1 - k))},${Math.round(255 * (1 - k))})`} />
        ))}
      </g>
    </svg>
  );
}
