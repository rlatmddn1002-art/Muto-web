"use client";

import { useEffect, useRef } from "react";

/**
 * 메인 로고 등장 장면
 * 작은 사람이 큰 산(삼각형)을 머리 위로 받치고 걸어와, 몸을 숙여 글자 위에 내려놓고,
 * 돌아서서 걸어 나가요. 한 번만 재생. '동작 줄이기' 설정이면 완성된 로고만 보여요.
 */

// ── 장면 좌표 (svg 단위) ─────────────────────────────
const GROUND = 108.4; // 발 높이
const TRI_FINAL = { x: 16, y: 111.7 }; // 삼각형 밑변 가운데 (최종)
const STOP_X = 50; // 사람이 멈추는 곳
const START_X = 330;
const EXIT_X = 400;
const HIP_Y = -23.4;
const LEG = 23.4;
const SHOULDER_Y = -46;
const HEAD_TOP = -58.8;

// ── 시간표 (초) ─────────────────────────────────────
const T = {
  walkIn: [0, 2.9],
  lean: [3.15, 3.55],
  toss: [3.35, 4.05],
  settle: [4.05, 4.3],
  stand: [4.25, 4.6],
  turn: [4.75, 5.0],
  walkOut: [5.05, 7.0],
  end: 7.0,
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, [a, b]: number[]) => clamp((t - a) / (b - a));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeIn = (p: number) => p * p * p;
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

type Pt = [number, number];
const pts = (...p: Pt[]) => p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/** 어깨에서 손까지 — 팔꿈치는 바깥으로 살짝 꺾여요 */
function arm(sh: Pt, hand: Pt, out: number): string {
  const max = 19;
  let [dx, dy] = [hand[0] - sh[0], hand[1] - sh[1]];
  const d = Math.hypot(dx, dy) || 1;
  if (d > max) {
    dx = (dx / d) * max;
    dy = (dy / d) * max;
  }
  const h: Pt = [sh[0] + dx, sh[1] + dy];
  const bend = Math.max(0, (max - Math.min(d, max)) / max) * 5 + 1;
  const mx = (sh[0] + h[0]) / 2 + (-dy / Math.hypot(dx, dy)) * bend * out;
  const my = (sh[1] + h[1]) / 2 + (dx / Math.hypot(dx, dy)) * bend * out;
  return pts(sh, [mx, my], h);
}

export function LogoIntro() {
  const fig = useRef<SVGGElement>(null);
  const body = useRef<SVGGElement>(null);
  const legL = useRef<SVGPolylineElement>(null);
  const legR = useRef<SVGPolylineElement>(null);
  const armL = useRef<SVGPolylineElement>(null);
  const armR = useRef<SVGPolylineElement>(null);
  const tri = useRef<SVGPolygonElement>(null);
  const word = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ready = () => {
      tri.current?.setAttribute("data-ready", "");
      word.current?.setAttribute("data-ready", "");
    };
    if (reduce) {
      ready();
      return;
    }

    const freeze = new URLSearchParams(location.search).get("logo-t");
    let phase = 0;
    let lastX = START_X;
    let lastT = 0;
    let raf = 0;
    const t0 = performance.now() + 350;

    const frame = (now: number) => {
      const t = Math.max(0, (now - t0) / 1000);
      const dt = Math.max(1e-3, t - lastT);

      // 위치
      let x: number;
      if (t < T.walkOut[0]) x = lerp(START_X, STOP_X, easeOut(prog(t, T.walkIn)));
      else x = lerp(STOP_X, EXIT_X, easeIn(prog(t, T.walkOut)));
      const v = Math.abs(x - lastX) / dt; // 초당 이동
      const speed = clamp(v / 140);
      phase += Math.abs(x - lastX) / 7.5;
      lastX = x;
      lastT = t;

      // 방향: 처음엔 왼쪽을 보고, 돌아설 때 오른쪽으로
      const turnP = easeInOut(prog(t, T.turn));
      const facing = lerp(1, -1, turnP); // 1 = 왼쪽

      // 몸: 걸을 때 살짝 오르내림, 내려놓을 때 숙임
      const bob = -Math.abs(Math.cos(phase)) * 1.3 * speed;
      const leanP = prog(t, T.lean) - prog(t, T.stand);
      const lean = -11 * easeInOut(clamp(leanP)); // 앞으로(왼쪽) 숙이기
      const squat = 2.2 * easeInOut(clamp(leanP));

      // 다리
      const a = Math.sin(phase) * 26 * speed * (Math.PI / 180);
      const leg = (hx: number, ang: number): string => {
        const hip: Pt = [hx, HIP_Y + bob + squat];
        const foot: Pt = [hip[0] + Math.sin(ang) * LEG, Math.min(0, hip[1] + Math.cos(ang) * LEG)];
        return pts(hip, foot, [foot[0] - 3.7, foot[1]]);
      };
      legL.current?.setAttribute("points", leg(-2.2, a));
      legR.current?.setAttribute("points", leg(2.2, -a));
      body.current?.setAttribute("transform", `translate(0 ${(bob + squat).toFixed(2)}) rotate(${lean.toFixed(2)} 0 ${HIP_Y})`);
      // 숙일 때 어깨도 함께 기울어요 (엉덩이 기준 회전)
      const tilt = (p: Pt): Pt => {
        const r = (lean * Math.PI) / 180;
        const [px, py] = [p[0], p[1] - HIP_Y];
        return [px * Math.cos(r) - py * Math.sin(r), HIP_Y + px * Math.sin(r) + py * Math.cos(r)];
      };

      // 삼각형 (밑변 가운데 기준)
      const carried: Pt = [x, GROUND + HEAD_TOP + bob];
      let tx = carried[0];
      let ty = carried[1];
      let rot = 0;
      const tossP = prog(t, T.toss);
      if (t >= T.toss[0]) {
        const p = easeInOut(tossP);
        tx = lerp(STOP_X, TRI_FINAL.x, p);
        ty = lerp(GROUND + HEAD_TOP, TRI_FINAL.y, p) - Math.sin(p * Math.PI) * 9; // 작은 호
        rot = -14 * Math.sin(p * Math.PI);
        if (t >= T.settle[0]) {
          const s = prog(t, T.settle);
          tx = TRI_FINAL.x;
          ty = TRI_FINAL.y - Math.sin(s * Math.PI) * 1.6; // 톡
          rot = 0;
        }
      }
      tri.current?.setAttribute("transform", `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${rot.toFixed(2)} 0 -9)`);

      // 팔
      const shL0 = tilt([-2.5, SHOULDER_Y]);
      const shR0 = tilt([2.5, SHOULDER_Y]);
      const shL: Pt = [shL0[0], shL0[1] + bob + squat];
      const shR: Pt = [shR0[0], shR0[1] + bob + squat];
      if (t < T.toss[0] + 0.15) {
        // 머리 위로 받치기 / 밀어 내려놓기
        const local = (gx: number, gy: number): Pt => [(gx - x) * facing, gy - GROUND];
        const left = local(tx - 13, ty - 1.5);
        const right = local(tx + 13, ty - 1.5);
        armL.current?.setAttribute("points", arm(shL, left, -1));
        armR.current?.setAttribute("points", arm(shR, right, 1));
      } else {
        // 내려놓은 뒤: 팔을 내리고, 걸을 땐 다리와 반대로 흔들기
        const relax = easeOut(prog(t, [T.toss[0] + 0.15, T.stand[1]]));
        const sw = -a * 0.75;
        const hand = (sh: Pt, ang: number, spread: number): Pt => [
          sh[0] + Math.sin(ang) * 17 + spread,
          sh[1] + Math.cos(ang) * 17,
        ];
        const reachL: Pt = [-10, -40];
        const reachR: Pt = [-6, -38];
        const dl = hand(shL, sw, -1.5);
        const dr = hand(shR, -sw, 1.5);
        armL.current?.setAttribute("points", arm(shL, [lerp(reachL[0], dl[0], relax), lerp(reachL[1], dl[1], relax)], -1));
        armR.current?.setAttribute("points", arm(shR, [lerp(reachR[0], dr[0], relax), lerp(reachR[1], dr[1], relax)], 1));
      }

      // 사람 전체 위치, 방향, 사라짐
      const fade = 1 - prog(t, [T.end - 0.45, T.end]);
      fig.current?.setAttribute("transform", `translate(${x.toFixed(2)} ${GROUND}) scale(${facing.toFixed(3)} 1)`);
      fig.current?.setAttribute("opacity", fade.toFixed(3));

      // 글자: 삼각형이 자리 잡을 때 또렷해짐
      if (word.current) word.current.style.opacity = String(lerp(0.25, 1, easeOut(prog(t, [T.settle[0] - 0.2, T.settle[0] + 1.2]))));

      if (t < T.end && freeze === null) raf = requestAnimationFrame(frame);
    };

    ready();
    if (freeze !== null) {
      // 미리보기용: ?logo-t=초 — 그 순간까지 빠르게 계산해 멈춰요
      const end = t0 + parseFloat(freeze) * 1000;
      for (let n = t0; n <= end; n += 16) frame(n);
      return;
    }
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
      <svg viewBox="0 0 360 112" className="w-[300px] overflow-visible md:w-[360px]" aria-hidden="true">
        {/* 작은 사람 — 발 사이가 원점, 왼쪽을 향함 */}
        <g ref={fig} opacity="0">
          <g ref={body}>
            <ellipse cx="0.3" cy="-54.2" rx="3.3" ry="4.3" fill="#111" />
            <polygon points="-2.9,-48.4 2.9,-48.4 6.5,-23.4 -6.5,-23.4" fill="#111" />
          </g>
          <g fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
            <polyline ref={legL} points="-2.2,-23.4 -2.2,0 -5.9,0" />
            <polyline ref={legR} points="2.2,-23.4 2.2,0 -1.5,0" />
            <polyline ref={armL} points="-2.5,-46 -4,-38 -4,-30" />
            <polyline ref={armR} points="2.5,-46 4,-38 4,-30" />
          </g>
        </g>
        {/* 큰 산 — 밑변 가운데가 원점, 최종 위치에 서 있음 */}
        <polygon
          ref={tri}
          className="mi-tri"
          points="0,-27.7 16,0 -16,0"
          transform={`translate(${TRI_FINAL.x} ${TRI_FINAL.y})`}
          fill="#111"
        />
      </svg>
      <div ref={word} className="mi-word">
        <span className="font-logo mt-4 block text-[17px] font-light tracking-[.04em] md:text-[20px]">MUTO ASSOCIATES</span>
        <span className="font-logo mt-0.5 block text-[11px] font-light text-ink/70 md:text-[12px]">Architecture studio</span>
      </div>
    </div>
  );
}
