"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** 'App' — 폰·PC 홈 화면에 MUTO를 앱처럼 설치 */
export function InstallApp() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    const on = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", on);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", on);
  }, []);

  if (installed) return null;

  async function click() {
    if (evt) {
      await evt.prompt();
      setEvt(null);
    } else setOpen((o) => !o);
  }

  return (
    <span className="relative">
      <button onClick={click} className="ulink">
        App
      </button>
      {open && (
        <span className="absolute bottom-7 right-0 z-10 block w-64 border border-line bg-white p-4 text-left text-[11px] leading-5 text-ink/80">
          <span className="block font-medium text-ink">홈 화면에 앱으로 설치</span>
          <span className="mt-2 block">iPhone — Safari 공유 버튼 → 홈 화면에 추가</span>
          <span className="block">Android — Chrome 메뉴 → 앱 설치</span>
          <span className="block">PC — 주소창 오른쪽 설치 아이콘</span>
        </span>
      )}
    </span>
  );
}
