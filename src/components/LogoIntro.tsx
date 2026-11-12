"use client";

import { useEffect, useRef } from "react";

/**
 * 메인 로고 등장 장면
 * 길쭉한 사람이 큰 산(삼각형)을 머리에 이고 걸어와 글자 위에 내려놓고, 그 자리에서 천천히 사라져요.
 * 미리보기: 특정 순간 정지 /?logo-t=초
 * '동작 줄이기' 설정이면 완성된 로고만 보여요.
 */

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
type Variant = "roll" | "grow" | "person";
/** 기본 장면: roll(굴러와 안착) · grow(땅에서 솟아오름) · person(사람이 이고 와서 내려놓음) */
const DEFAULT_VARIANT: Variant = "roll";
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

export function LogoIntro() {
  const fig = useRef<SVGGElement>(null);
  const lean = useRef<SVGGElement>(null);
  const legL = useRef<SVGPolylineElement>(null);
  const legR = useRef<SVGPolylineElement>(null);
  const armL = useRef<SVGPolylineElement>(null);
  const armR = useRef<SVGPolylineElement>(null);
  const tri = useRef<SVGPolygonElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const ground = useRef<SVGLineElement>(null);
  const triWrap = useRef<SVGGElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const freeze = q.get("logo-t");
    const variant = (q.get("logo") as Variant) || DEFAULT_VARIANT;
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
    const A1 = { walkIn: [0, 3.2], toss: [3.4, 4.8], settle: [4.8, 4.8], relax: [4.8, 5.3], fade: [5.4, 6.4], end: 6.4 };
    const STOP = 48;
    let phase = 0;
    let lastX = 340;
    let lastT = 0;

    const alt1 = (t: number) => {
      const dt = Math.max(1e-3, t - lastT);
      const x = lerp(340, STOP, easeOut(prog(t, A1.walkIn)));
      const v = Math.abs(x - lastX) / dt;
      const speed = clamp(v / 120);
      phase += Math.abs(x - lastX) / 3.2;
      lastX = x;
      lastT = t;

      const bob = Math.abs(Math.cos(phase)) * 1.1 * speed;
      const tilt = -16 * Math.sin(Math.PI * prog(t, [A1.toss[0], A1.relax[1]]));
      const a = Math.sin(phase) * 34 * speed * (Math.PI / 180);
      legL.current?.setAttribute("points", legPts(-1.3, a, bob * 0.3));
      legR.current?.setAttribute("points", legPts(1.3, -a, bob * 0.3));
      lean.current?.setAttribute("transform", `translate(0 ${(-bob).toFixed(2)}) rotate(${tilt.toFixed(2)} 0 ${HIP_Y})`);

      // 삼각형
      let tx = x;
      let ty = GROUND + HEAD_TOP - bob;
      let rot = 0;
      if (t >= A1.toss[0]) {
        // 살포시 내려놓기: 옆으로 옮기면서 천천히 내리고, 바닥 직전엔 아주 느리게
        const p = prog(t, A1.toss);
        tx = lerp(STOP, TRI.x, easeInOut(clamp(p * 1.25)));
        ty = lerp(GROUND + HEAD_TOP, BASE, 1 - Math.pow(1 - easeInOut(p), 2.2));
        rot = 0;
      }
      tri.current?.setAttribute("transform", `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${rot.toFixed(2)} 0 -9)`);

      // 팔: 머리 위 삼각형 받치기 → 밀어 내려놓기 → 늘어뜨리고 걸음에 맞춰 흔들기
      const shL: Pt = [-1.8, SHOULDER_Y - bob];
      const shR: Pt = [1.8, SHOULDER_Y - bob];
      const local = (gx: number, gy: number): Pt => [gx - x, gy - GROUND];
      if (t < A1.toss[1]) {
        // 내려놓는 동안 두 손으로 삼각형 양옆을 잡고 함께 내려가요
        const g = prog(t, A1.toss);
        const hy = lerp(1, 13, easeInOut(g));
        const hx = lerp(12, 8, easeInOut(g));
        armL.current?.setAttribute("points", arm(shL, local(tx - hx, ty - hy), -1, 30));
        armR.current?.setAttribute("points", arm(shR, local(tx + hx, ty - hy), 1, 30));
      } else {
        const r = easeOut(prog(t, [A1.toss[1], A1.relax[1] + 0.3]));
        const sw = -a * 0.8;
        const relL = local(TRI.x - 8, BASE - 13);
        const relR = local(TRI.x + 8, BASE - 13);
        armL.current?.setAttribute("points", arm(shL, [lerp(relL[0], -3 + Math.sin(sw) * 6, r), lerp(relL[1], SHOULDER_Y + 20, r)], -1, lerp(30, 22, r)));
        armR.current?.setAttribute("points", arm(shR, [lerp(relR[0], 3 + Math.sin(-sw) * 6, r), lerp(relR[1], SHOULDER_Y + 19, r)], 1, lerp(30, 22, r)));
      }

      // 삼각형을 내려놓고 선 자리에서 천천히 사라짐
      place(fig.current, x, 1 - easeInOut(prog(t, A1.fade)));
      setWord(prog(t, [A1.settle[0] - 0.2, A1.settle[0] + 1.2]));
      return t < A1.end;
    };


    // ── ROLL: 오른쪽에서 굴러와 글자 위에 안착 ─────────────
    const ROLLS = 9; // 한 번 구를 때 밑변 한 칸(32)씩 이동
    const rollDur = Array.from({ length: ROLLS }, (_, k) => 0.2 + k * 0.035);
    const rollStart = rollDur.reduce<number[]>((acc, d, i) => (acc.push(i ? acc[i - 1] + rollDur[i - 1] : 0.2), acc), []);
    const rollEnd = rollStart[ROLLS - 1] + rollDur[ROLLS - 1];
    const roll = (t: number) => {
      let pivot = TRI.x - TRI.w / 2; // 왼쪽 밑 꼭짓점
      let ang = 0;
      if (t < rollEnd) {
        let k = 0;
        while (k < ROLLS - 1 && t >= rollStart[k + 1]) k++;
        const p = prog(t, [rollStart[k], rollStart[k] + rollDur[k]]);
        // 넘어갈 때 살짝 빨라졌다가 바닥에 닿으며 느려짐
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        pivot = TRI.x - TRI.w / 2 + TRI.w * (ROLLS - k);
        ang = -120 * (t < rollStart[0] ? 0 : e);
        if (t < rollStart[0]) pivot = TRI.x - TRI.w / 2 + TRI.w * ROLLS;
      } else {
        // 안착: 앞으로 살짝 기울었다가 제자리로 (두 번 흔들림)
        const p = prog(t, [rollEnd, rollEnd + 0.7]);
        ang = -7 * Math.sin(p * Math.PI * 2) * (1 - p);
      }
      tri.current?.setAttribute(
        "transform",
        `translate(${pivot.toFixed(2)} ${BASE}) rotate(${ang.toFixed(2)}) translate(${TRI.w / 2} 0)`
      );
      tri.current?.setAttribute("opacity", String(easeOut(prog(t, [0, 0.25]))));
      setWord(prog(t, [rollEnd - 0.1, rollEnd + 1.1]));
      return t < rollEnd + 1.2;
    };

    // ── GROW: 땅에서 자라나듯 솟아오름 ─────────────────
    const grow = (t: number) => {
      const lineP = easeInOut(prog(t, [0.2, 0.9]));
      const rise = prog(t, [0.7, 2.1]);
      // 천천히 솟다가 끝에서 아주 살짝 더 올라갔다 내려앉음
      const e = rise < 1 ? 1 - Math.pow(1 - rise, 3) : 1;
      const over = Math.sin(clamp((t - 1.7) / 0.6) * Math.PI) * 1.2;
      const y = BASE + TRI.h * (1 - e) - over * (rise > 0.6 ? 1 : 0);
      tri.current?.setAttribute("transform", `translate(${TRI.x} ${y.toFixed(2)})`);
      tri.current?.setAttribute("opacity", "1");
      ground.current?.setAttribute("x1", (TRI.x - 24 * lineP).toFixed(2));
      ground.current?.setAttribute("x2", (TRI.x + 24 * lineP).toFixed(2));
      ground.current?.setAttribute("opacity", String(0.5 * (1 - prog(t, [2.2, 3.0]))));
      setWord(prog(t, [1.6, 2.8]));
      return t < 3.1;
    };

    const scene = variant === "person" ? alt1 : variant === "grow" ? grow : roll;
    if (variant === "grow") triWrap.current?.setAttribute("clip-path", "url(#mi-ground)");
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
        {/* 사람 */}
        <g ref={fig} opacity="0">
          <g ref={lean}>
            <ellipse cx="0.2" cy={HEAD_CY} rx="2.6" ry="3.4" fill="#111" />
            <polygon points={`-2,${SHOULDER_Y - 3} 2,${SHOULDER_Y - 3} 2.7,${HIP_Y} -2.7,${HIP_Y}`} fill="#111" />
            <g fill="none" stroke="#111" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter">
              <polyline ref={armL} points={`-1.8,${SHOULDER_Y} -3,${SHOULDER_Y + 10} -3,${SHOULDER_Y + 20}`} />
              <polyline ref={armR} points={`1.8,${SHOULDER_Y} 3,${SHOULDER_Y + 10} 3,${SHOULDER_Y + 20}`} />
            </g>
          </g>
          <g fill="none" stroke="#111" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter">
            <polyline ref={legL} points={`-1.3,${HIP_Y} -1.3,0 -3.9,0`} />
            <polyline ref={legR} points={`1.3,${HIP_Y} 1.3,0 -1.3,0`} />
          </g>
        </g>

        <defs>
          <clipPath id="mi-ground">
            <rect x="-40" y={BASE - 200} width="440" height="200" />
          </clipPath>
        </defs>
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
