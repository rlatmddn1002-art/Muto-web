/**
 * 메인 로고 등장 장면 — 가는 선의 작은 사람이 큰 산(삼각형)을 이고 걸어와
 * MUTO ASSOCIATES 위에 내려놓고 떠나요. 한 번만 재생, 움직임 줄이기 설정이면 바로 완성된 로고.
 */

const DUR = 6; // 초

// 걷는 구간(%)에서만 다리를 번갈아 흔드는 키프레임을 만들어요
function legFrames(sign: 1 | -1) {
  const walks: [number, number][] = [
    [0, 46],
    [62, 100],
  ];
  const step = 3; // %마다 한 걸음
  const lines: string[] = [];
  for (const [a, b] of walks) {
    let k = 0;
    for (let p = a; p <= b; p += step) {
      lines.push(`${p}%{transform:rotate(${sign * (k % 2 ? 1 : -1) * 22}deg)}`);
      k++;
    }
  }
  lines.push(`49%,59%{transform:rotate(0deg)}`);
  return lines.join("");
}

const css = `
.mi-fig,.mi-dots{opacity:0}
.mi-tri{transform:translate(0,0)}
@media (prefers-reduced-motion:no-preference){
  .mi-fig{animation:mi-fig ${DUR}s cubic-bezier(.45,.05,.4,1) .4s both}
  .mi-tri{animation:mi-tri ${DUR}s cubic-bezier(.45,.05,.4,1) .4s both}
  .mi-dots{animation:mi-dots ${DUR}s ease .4s both}
  .mi-legL{animation:mi-legL ${DUR}s linear .4s both}
  .mi-legR{animation:mi-legR ${DUR}s linear .4s both}
  .mi-armsUp{animation:mi-armsUp ${DUR}s linear .4s both}
  .mi-armsDn{animation:mi-armsDn ${DUR}s linear .4s both}
  .mi-word{animation:mi-word 1.6s ease ${DUR * 0.55 + 0.4}s both}
}
.mi-legL,.mi-legR{transform-box:fill-box;transform-origin:85% 0}
@keyframes mi-fig{
  0%{transform:translateX(330px);opacity:1}
  46%{transform:translateX(0);opacity:1}
  62%{transform:translateX(0);opacity:1}
  94%{transform:translateX(330px);opacity:1}
  100%{transform:translateX(360px);opacity:0}
}
@keyframes mi-tri{
  0%{transform:translate(370px,-62px)}
  46%{transform:translate(40px,-62px)}
  50%{transform:translate(40px,-62px)}
  58%{transform:translate(0,-6px)}
  61%,100%{transform:translate(0,0)}
}
@keyframes mi-armsUp{0%,55%{opacity:1}58%,100%{opacity:0}}
@keyframes mi-armsDn{0%,55%{opacity:0}58%,100%{opacity:1}}
@keyframes mi-dots{0%{opacity:0}8%{opacity:1}80%{opacity:1}100%{opacity:0}}
@keyframes mi-word{from{opacity:.25}to{opacity:1}}
@keyframes mi-legL{${legFrames(1)}}
@keyframes mi-legR{${legFrames(-1)}}
`;

export function LogoIntro() {
  return (
    <div className="inline-flex flex-col items-start" aria-label="MUTO ASSOCIATES — Architecture studio">
      <style>{css}</style>
      <svg viewBox="0 0 360 112" className="w-[300px] overflow-visible md:w-[360px]" aria-hidden="true">
        {/* 점선 길 */}
        <g className="mi-dots" fill="#111">
          {Array.from({ length: 45 }, (_, i) => (
            <rect key={i} x={i * 8} y={i % 5 === 0 ? 105 : 108} width="1.2" height={i % 5 === 0 ? 6 : 2} />
          ))}
        </g>
        {/* 작은 사람 — 검은 실루엣: 갸름한 머리, 사다리꼴 몸, 각진 가는 팔다리 (중심 x=56, 왼쪽을 향함) */}
        <g className="mi-fig">
          <ellipse cx="56.5" cy="54.2" rx="3.3" ry="4.3" fill="#111" />
          <polygon points="53.6,60 59.4,60 63,85 50,85" fill="#111" />
          <g fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
            <polyline className="mi-legL" points="54.3,85 54.3,108.4 50.6,108.4" />
            <polyline className="mi-legR" points="58.7,85 58.7,108.4 55,108.4" />
            <g className="mi-armsUp">
              <polyline points="54,62.5 46.5,57 44.5,50.5" />
              <polyline points="59,62.5 66.5,57 68.5,50.5" />
            </g>
            <g className="mi-armsDn">
              <polyline points="54,62.5 49.5,72 46.5,79" />
              <polyline points="59,62.5 63.5,72 66.5,79" />
            </g>
          </g>
        </g>
        {/* 큰 산 — 최종 위치 (0~32, 바닥 112) */}
        <polygon className="mi-tri" points="16,84 32,111.7 0,111.7" fill="#111" />
      </svg>
      <span className="mi-word font-logo mt-4 text-[17px] font-light tracking-[.04em] md:text-[20px]">MUTO ASSOCIATES</span>
      <span className="mi-word font-logo mt-0.5 text-[11px] font-light text-ink/70 md:text-[12px]">Architecture studio</span>
    </div>
  );
}
