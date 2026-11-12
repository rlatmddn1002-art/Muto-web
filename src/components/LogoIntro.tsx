"use client";

import { useEffect, useRef } from "react";

/**
 * 메인 로고 등장 장면 — 땅에서 솟아오르는 큰 산
 * 가는 땅선이 그어지고, 그 아래에서 삼각형이 천천히 솟아올라 자리 잡은 뒤 땅선은 사라져요.
 * 들어올 때 한 번만. '동작 줄이기' 설정이면 완성된 로고만 보여요.
 * 미리보기: 특정 순간 정지 /?logo-t=초
 */

const BASE = 111.7; // 삼각형 밑변 (= 땅)
const TRI = { x: 16, w: 32, h: 27.7 }; // 최종 삼각형 (밑변 가운데 x)
const END = 3.1;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, [a, b]: number[]) => clamp((t - a) / (b - a));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export function LogoIntro() {
  const tri = useRef<SVGPolygonElement>(null);
  const triWrap = useRef<SVGGElement>(null);
  const ground = useRef<SVGLineElement>(null);
  const word = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const freeze = new URLSearchParams(location.search).get("logo-t");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tri.current?.setAttribute("data-ready", "");
    word.current?.setAttribute("data-ready", "");
    if (reduce && freeze === null) return;

    triWrap.current?.setAttribute("clip-path", "url(#mi-ground)");

    const scene = (t: number) => {
      // 땅선: 가운데에서 양옆으로
      const lineP = easeInOut(prog(t, [0.2, 0.9]));
      ground.current?.setAttribute("x1", (TRI.x - 24 * lineP).toFixed(2));
      ground.current?.setAttribute("x2", (TRI.x + 24 * lineP).toFixed(2));
      ground.current?.setAttribute("opacity", String(0.5 * (1 - prog(t, [2.2, 3.0]))));

      // 삼각형: 천천히 솟다가 끝에서 아주 살짝 더 올라갔다 내려앉음
      const rise = prog(t, [0.7, 2.1]);
      const over = Math.sin(clamp((t - 1.7) / 0.6) * Math.PI) * 1.2 * (rise > 0.6 ? 1 : 0);
      const y = BASE + TRI.h * (1 - easeOut(rise)) - over;
      tri.current?.setAttribute("transform", `translate(${TRI.x} ${y.toFixed(2)})`);

      // 글자: 삼각형이 자리 잡을 즈음 또렷해짐
      if (word.current) word.current.style.opacity = String(lerp(0.25, 1, easeOut(prog(t, [1.6, 2.8]))));
      return t < END;
    };

    if (freeze !== null) {
      scene(parseFloat(freeze));
      return;
    }
    const t0 = performance.now() + 350;
    let raf = 0;
    const frame = (now: number) => {
      if (scene(Math.max(0, (now - t0) / 1000))) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mi-logo inline-flex flex-col items-start" aria-label="MUTO ASSOCIATES — Architecture studio">
      <style>{`
        @media (prefers-reduced-motion:no-preference){
          .mi-logo .mi-tri:not([data-ready]){opacity:0;animation:mi-show 0s 2.5s forwards}
          .mi-logo .mi-word:not([data-ready]){opacity:.25;animation:mi-show 0s 2.5s forwards}
        }
        @keyframes mi-show{to{opacity:1}}
      `}</style>
      <svg viewBox={`0 ${BASE - TRI.h - 1} ${TRI.w} ${TRI.h + 2}`} className="w-7 overflow-visible md:w-8" aria-hidden="true">
        <defs>
          <clipPath id="mi-ground">
            <rect x="-40" y={BASE - 200} width="440" height="200" />
          </clipPath>
        </defs>
        {/* 땅선 */}
        <line ref={ground} x1={TRI.x} x2={TRI.x} y1={BASE + 0.5} y2={BASE + 0.5} stroke="#111" strokeWidth="0.8" opacity="0" />
        {/* 큰 산 */}
        <g ref={triWrap}>
          <polygon
            ref={tri}
            className="mi-tri"
            points={`0,${-TRI.h} ${TRI.w / 2},0 ${-TRI.w / 2},0`}
            transform={`translate(${TRI.x} ${BASE})`}
            fill="#111"
          />
        </g>
      </svg>
      <div ref={word} className="mi-word">
        <span className="font-logo mt-4 block text-[17px] font-light tracking-[.04em] md:text-[20px]">MUTO ASSOCIATES</span>
        <span className="font-logo mt-0.5 block text-[11px] font-light text-ink/70 md:text-[12px]">Architecture studio</span>
      </div>
    </div>
  );
}
