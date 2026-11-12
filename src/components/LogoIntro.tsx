"use client";

import { useEffect, useRef } from "react";

/**
 * 메인 로고 등장 장면 — 두 가지 버전
 *  ALT1: 길쭉한 사람이 큰 산(삼각형)을 머리에 이고 와서 내려놓고, 몸을 기울인 채 성큼 물러나 사라짐
 *  ALT2: 사람이 삽으로 울퉁불퉁한 흙더미를 다듬어 삼각형을 만들고, 흐려지며 사라짐
 * 미리보기: /?logo=alt1 · /?logo=alt2 · 특정 순간 정지 &logo-t=초
 * '동작 줄이기' 설정이면 완성된 로고만 보여요.
 */

export const LOGO_VARIANT: "alt1" | "alt2" = "alt1";

const GROUND = 108.4; // 발 높이
const BASE = 111.7; // 삼각형 밑변
const TRI = { x: 16, w: 32, h: 27.7 }; // 최종 삼각형 (밑변 가운데 x)

// 사람 (발 사이가 원점, 왼쪽을 향함) — 길고 가는 몸, 작은 머리, 짧은 다리
const LEG = 10;
const HIP_Y = -LEG;
const SHOULDER_Y = -55;
const HEAD_CY = -62.6;
const HEAD_TOP = -66;

type Pt = [number, number];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, [a, b]: number[]) => clamp((t - a) / (b - a));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeIn = (p: number) => p * p * p;
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const pts = (...p: Pt[]) => p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/** 어깨 → 팔꿈치 → 손. 손이 멀면 팔 길이만큼만 뻗어요 */
function arm(sh: Pt, hand: Pt, out: number, max = 22): string {
  let dx = hand[0] - sh[0];
  let dy = hand[1] - sh[1];
  const d = Math.hypot(dx, dy) || 1;
  if (d > max) {
    dx = (dx / d) * max;
    dy = (dy / d) * max;
  }
  const len = Math.hypot(dx, dy) || 1;
  const bend = (1 - Math.min(d, max) / max) * 9 + 1;
  const m: Pt = [sh[0] + dx / 2 + (-dy / len) * bend * out, sh[1] + dy / 2 + (dx / len) * bend * out];
  return pts(sh, m, [sh[0] + dx, sh[1] + dy]);
}

function legPts(hx: number, ang: number, lift: number): string {
  const hip: Pt = [hx, HIP_Y - lift];
  const foot: Pt = [hip[0] + Math.sin(ang) * LEG, Math.min(0, hip[1] + Math.cos(ang) * LEG)];
  return pts(hip, foot, [foot[0] - 2.6, foot[1]]);
}

/** ALT2 흙더미: 울퉁불퉁한 산 → 깔끔한 삼각형 */
const MOUND_N = 28;
const ROUGH = Array.from({ length: MOUND_N + 1 }, (_, i) => {
  const u = i / MOUND_N;
  const x = lerp(-5, TRI.w + 5, u);
  const peak = Math.max(0, 1 - Math.abs(u - 0.46) / 0.5);
  const lumps = Math.sin(u * 23) * 1.6 + Math.sin(u * 9 + 1) * 2.2;
  return [x, -(peak * TRI.h * 0.82 + lumps * peak)] as Pt;
});
const CLEAN = ROUGH.map((_, i) => {
  const u = i / MOUND_N;
  return [lerp(0, TRI.w, u), -(TRI.h * (1 - Math.abs(u - 0.5) * 2))] as Pt;
});
const DOTS = Array.from({ length: 22 }, (_, i) => {
  const u = ((i * 37) % 100) / 100;
  const v = ((i * 61) % 100) / 100;
  const x = lerp(2, TRI.w - 2, u);
  const top = TRI.h * 0.8 * (1 - Math.abs(u - 0.46) * 2);
  return [x, -top * v * 0.85 - 1] as Pt;
});

export function LogoIntro() {
  const fig = useRef<SVGGElement>(null);
  const lean = useRef<SVGGElement>(null);
  const legL = useRef<SVGPolylineElement>(null);
  const legR = useRef<SVGPolylineElement>(null);
  const armL = useRef<SVGPolylineElement>(null);
  const armR = useRef<SVGPolylineElement>(null);
  const shovel = useRef<SVGGElement>(null);
  const tri = useRef<SVGPolygonElement>(null);
  const mound = useRef<SVGPolygonElement>(null);
  const dots = useRef<SVGGElement>(null);
  const word = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const variant = (q.get("logo") as "alt1" | "alt2") || LOGO_VARIANT;
    const freeze = q.get("logo-t");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ready = () => {
      tri.current?.setAttribute("data-ready", "");
      word.current?.setAttribute("data-ready", "");
    };
    if (reduce && freeze === null) {
      ready();
      return;
    }

    const setWord = (p: number) => {
      if (word.current) word.current.style.opacity = String(lerp(0.25, 1, easeOut(p)));
    };
    const place = (g: SVGGElement | null, x: number, op: number) => {
      g?.setAttribute("transform", `translate(${x.toFixed(2)} ${GROUND})`);
      g?.setAttribute("opacity", op.toFixed(3));
    };

    // ── ALT1 ───────────────────────────────────────
    const A1 = { walkIn: [0, 3.2], toss: [3.45, 4.15], settle: [4.15, 4.4], back: [4.55, 5.0], exit: [5.0, 7.0], end: 7.0 };
    const STOP = 48;
    let phase = 0;
    let lastX = 340;
    let lastT = 0;

    const alt1 = (t: number) => {
      const dt = Math.max(1e-3, t - lastT);
      const x = t < A1.exit[0] ? lerp(340, STOP, easeOut(prog(t, A1.walkIn))) : lerp(STOP, 420, easeIn(prog(t, A1.exit)));
      const v = Math.abs(x - lastX) / dt;
      const speed = clamp(v / 120);
      phase += Math.abs(x - lastX) / 3.2;
      lastX = x;
      lastT = t;

      const bob = Math.abs(Math.cos(phase)) * 1.1 * speed;
      // 내려놓은 뒤 몸을 삼각형 쪽(왼쪽)으로 기울인 채 오른쪽으로 물러남
      const tilt = -20 * easeInOut(prog(t, A1.back));
      const a = Math.sin(phase) * 34 * speed * (Math.PI / 180) * (t > A1.exit[0] ? 1.4 : 1);
      legL.current?.setAttribute("points", legPts(-1.3, a, bob * 0.3));
      legR.current?.setAttribute("points", legPts(1.3, -a, bob * 0.3));
      lean.current?.setAttribute("transform", `translate(0 ${(-bob).toFixed(2)}) rotate(${tilt.toFixed(2)} 0 ${HIP_Y})`);

      // 삼각형
      let tx = x;
      let ty = GROUND + HEAD_TOP - bob;
      let rot = 0;
      if (t >= A1.toss[0]) {
        const p = easeInOut(prog(t, A1.toss));
        tx = lerp(STOP, TRI.x, p);
        ty = lerp(GROUND + HEAD_TOP, BASE, p) - Math.sin(p * Math.PI) * 8;
        rot = -12 * Math.sin(p * Math.PI);
        if (t >= A1.settle[0]) {
          tx = TRI.x;
          ty = BASE - Math.sin(prog(t, A1.settle) * Math.PI) * 1.4;
          rot = 0;
        }
      }
      tri.current?.setAttribute("transform", `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${rot.toFixed(2)} 0 -9)`);

      // 팔: 머리 위 삼각형 받치기 → 밀어 내려놓기 → 늘어뜨리고 걸음에 맞춰 흔들기
      const shL: Pt = [-1.8, SHOULDER_Y - bob];
      const shR: Pt = [1.8, SHOULDER_Y - bob];
      const local = (gx: number, gy: number): Pt => [gx - x, gy - GROUND];
      if (t < A1.toss[0] + 0.2) {
        armL.current?.setAttribute("points", arm(shL, local(tx - 12, ty - 1), -1));
        armR.current?.setAttribute("points", arm(shR, local(tx + 12, ty - 1), 1));
      } else {
        const r = easeOut(prog(t, [A1.toss[0] + 0.2, A1.back[1]]));
        const sw = -a * 0.8;
        armL.current?.setAttribute("points", arm(shL, [lerp(-12, -9 + Math.sin(sw) * 6, r), lerp(-44, SHOULDER_Y + 20, r)], -1));
        armR.current?.setAttribute("points", arm(shR, [lerp(-8, 6 + Math.sin(-sw) * 6, r), lerp(-42, SHOULDER_Y + 19, r)], 1));
      }

      place(fig.current, x, 1 - prog(t, [A1.end - 0.5, A1.end]));
      setWord(prog(t, [A1.settle[0] - 0.2, A1.settle[0] + 1.2]));
      return t < A1.end;
    };

    // ── ALT2 ───────────────────────────────────────
    const A2 = { appear: [0, 0.8], dig: [0.9, 3.9], clean: [3.9, 4.4], fade: [4.6, 5.8], end: 5.8 };
    const FX = 46; // 사람 위치
    const alt2 = (t: number) => {
      const strokes = 5;
      const k = prog(t, A2.dig) * strokes;
      const stroke = Math.sin((k % 1) * Math.PI); // 삽질 한 번: 0→1→0
      // 다듬어지는 정도: 삽질마다 조금씩, 마지막에 깔끔하게
      const shape =
        clamp(Math.floor(k) / strokes + easeOut(k % 1) / strokes) * 0.85 + easeInOut(prog(t, A2.clean)) * 0.15;
      const mp = ROUGH.map((r, i) => [lerp(r[0], CLEAN[i][0], shape), lerp(r[1], CLEAN[i][1], shape)] as Pt);
      const appear = easeOut(prog(t, A2.appear));
      const done = prog(t, [A2.clean[1] - 0.05, A2.clean[1]]);
      mound.current?.setAttribute("points", pts([mp[0][0], 0], ...mp, [mp[mp.length - 1][0], 0]));
      mound.current?.setAttribute("transform", `translate(0 ${BASE})`);
      mound.current?.setAttribute("opacity", String(appear * (1 - done)));
      dots.current?.setAttribute("opacity", String(appear * (1 - shape)));
      tri.current?.setAttribute("transform", `translate(${TRI.x} ${BASE})`);
      tri.current?.setAttribute("opacity", String(done));

      // 사람: 삽을 들고 흙더미 쪽으로 숙였다 폈다
      const bend = -10 - stroke * 12;
      lean.current?.setAttribute("transform", `rotate(${bend.toFixed(2)} 0 ${HIP_Y})`);
      legL.current?.setAttribute("points", legPts(-1.3, 0.12, 0));
      legR.current?.setAttribute("points", legPts(1.3, -0.18, 0));
      const shL: Pt = [-1.8, SHOULDER_Y];
      const shR: Pt = [1.8, SHOULDER_Y];
      const grip1: Pt = [-9 - stroke * 3, -42 + stroke * 6];
      const grip2: Pt = [-5 - stroke * 3, -34 + stroke * 6];
      armL.current?.setAttribute("points", arm(shL, grip1, -1));
      armR.current?.setAttribute("points", arm(shR, grip2, 1));
      shovel.current?.setAttribute(
        "transform",
        `translate(${grip1[0].toFixed(2)} ${grip1[1].toFixed(2)}) rotate(${(28 + stroke * 18).toFixed(2)})`
      );
      shovel.current?.setAttribute("opacity", "1");
      place(fig.current, FX, appear * (1 - easeInOut(prog(t, A2.fade))));
      setWord(prog(t, [A2.clean[0], A2.clean[1] + 1]));
      return t < A2.end;
    };

    const scene = variant === "alt2" ? alt2 : alt1;
    if (variant === "alt2") tri.current?.setAttribute("opacity", "0");
    ready();

    if (freeze !== null) {
      const end = parseFloat(freeze);
      for (let t = 0; t <= end; t += 1 / 60) scene(t);
      scene(end);
      return;
    }
    const t0 = performance.now() + 350;
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.max(0, (now - t0) / 1000);
      if (scene(t)) raf = requestAnimationFrame(frame);
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
      <svg viewBox="0 0 360 112" className="w-[300px] overflow-visible md:w-[360px]" aria-hidden="true">
        {/* ALT2 흙더미 */}
        <polygon ref={mound} points="0,0" fill="#111" opacity="0" />
        <g ref={dots} opacity="0" fill="#fff" transform={`translate(0 ${BASE})`}>
          {DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.7 + (i % 3) * 0.25} />
          ))}
        </g>

        {/* 사람 */}
        <g ref={fig} opacity="0">
          <g ref={lean}>
            <ellipse cx="0.2" cy={HEAD_CY} rx="2.6" ry="3.4" fill="#111" />
            <polygon points={`-2,${SHOULDER_Y - 3} 2,${SHOULDER_Y - 3} 2.7,${HIP_Y} -2.7,${HIP_Y}`} fill="#111" />
            <g fill="none" stroke="#111" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter">
              <polyline ref={armL} points={`-1.8,${SHOULDER_Y} -3,${SHOULDER_Y + 10} -3,${SHOULDER_Y + 20}`} />
              <polyline ref={armR} points={`1.8,${SHOULDER_Y} 3,${SHOULDER_Y + 10} 3,${SHOULDER_Y + 20}`} />
              {/* ALT2 삽: 자루 + 날 */}
              <g ref={shovel} opacity="0">
                <line x1="0" y1="0" x2="0" y2="34" />
                <polygon points="-2.6,34 2.6,34 1.8,40 -1.8,40" fill="#111" stroke="none" />
              </g>
            </g>
          </g>
          <g fill="none" stroke="#111" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter">
            <polyline ref={legL} points={`-1.3,${HIP_Y} -1.3,0 -3.9,0`} />
            <polyline ref={legR} points={`1.3,${HIP_Y} 1.3,0 -1.3,0`} />
          </g>
        </g>

        {/* 큰 산 */}
        <polygon
          ref={tri}
          className="mi-tri"
          points={`0,${-TRI.h} ${TRI.w / 2},0 ${-TRI.w / 2},0`}
          transform={`translate(${TRI.x} ${BASE})`}
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
