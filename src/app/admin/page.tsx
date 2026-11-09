"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { browserSupabase, hasSupabase } from "@/lib/supabase";
import { seedActivities, seedMilestones } from "@/lib/seed";
import { AREAS, STATUSES, type Activity, type Milestone, type Status } from "@/lib/types";

const STATUS_STYLE: Record<Status, string> = {
  예정: "bg-white text-[#8c8c8c] border border-[#e4e4e4]",
  진행: "bg-[#111] text-white border border-[#111]",
  검토: "bg-white text-[#111] border border-[#111]",
  완료: "bg-[#f3f3f3] text-[#8c8c8c] border border-[#f3f3f3]",
};

type Tab = "activities" | "milestones" | "old";

function fmtDate(s: string) {
  const d = new Date(s);
  return isNaN(+d) ? "" : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function progressText(a: Activity) {
  if (!a.progress_label) return null;
  if (a.progress_value == null) return `${a.progress_label}: 미확인`;
  return `${a.progress_label}: ${a.progress_value}${a.progress_target != null ? ` / ${a.progress_target}` : ""}`;
}

const blankActivity = (): Activity => ({
  id: "",
  area: "콘텐츠",
  title: "",
  status: "예정",
  where_label: null,
  summary: null,
  next_action: null,
  link: null,
  progress_label: null,
  progress_value: null,
  progress_target: null,
  is_public: false,
  archived: false,
  sort: 99,
  updated_at: new Date().toISOString(),
});

const blankMilestone = (): Milestone => ({
  id: "",
  when_label: "",
  label: "",
  status: "예정",
  is_public: false,
  sort: 99,
  updated_at: new Date().toISOString(),
});

export default function AdminPage() {
  const db = browserSupabase();
  const preview = !hasSupabase;
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(preview);
  const [activities, setActivities] = useState<Activity[]>(preview ? seedActivities : []);
  const [milestones, setMilestones] = useState<Milestone[]>(preview ? seedMilestones : []);
  const [tab, setTab] = useState<Tab>("activities");
  const [areaFilter, setAreaFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editingA, setEditingA] = useState<Activity | null>(null);
  const [editingM, setEditingM] = useState<Milestone | null>(null);
  const [msg, setMsg] = useState<string>("");

  const load = useCallback(async () => {
    if (!db) return;
    const [a, m] = await Promise.all([
      db.from("activities").select("*").order("sort"),
      db.from("milestones").select("*").order("sort"),
    ]);
    if (a.error || m.error) setMsg((a.error ?? m.error)!.message);
    else {
      setActivities(a.data as Activity[]);
      setMilestones(m.data as Milestone[]);
    }
  }, [db]);

  useEffect(() => {
    if (!db) return;
    db.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!session || !db) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // 다른 기기에서 고친 내용도 바로 반영
    const ch = db
      .channel("muto-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "activities" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "milestones" }, () => load())
      .subscribe();
    return () => {
      db.removeChannel(ch);
    };
  }, [session, db, load]);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  };

  async function saveActivity(a: Activity) {
    const row = { ...a, updated_at: new Date().toISOString() };
    if (preview || !db) {
      const id = a.id || crypto.randomUUID();
      setActivities((xs) => (a.id ? xs.map((x) => (x.id === a.id ? { ...row, id } : x)) : [...xs, { ...row, id }]));
      flash("미리보기 모드: 화면에만 반영됐어요");
    } else {
      const { id, ...rest } = row;
      const res = id ? await db.from("activities").update(rest).eq("id", id) : await db.from("activities").insert(rest);
      if (res.error) return flash(`저장 실패: ${res.error.message}`);
      flash("저장했어요");
      await load();
    }
    setEditingA(null);
  }

  async function deleteActivity(a: Activity) {
    if (preview || !db) setActivities((xs) => xs.filter((x) => x.id !== a.id));
    else {
      const res = await db.from("activities").delete().eq("id", a.id);
      if (res.error) return flash(`삭제 실패: ${res.error.message}`);
      await load();
    }
    flash("삭제했어요");
    setEditingA(null);
  }

  async function quickStatus(a: Activity, status: Status) {
    await saveActivity({ ...a, status });
  }

  async function saveMilestone(m: Milestone) {
    const row = { ...m, updated_at: new Date().toISOString() };
    if (preview || !db) {
      const id = m.id || crypto.randomUUID();
      setMilestones((xs) => (m.id ? xs.map((x) => (x.id === m.id ? { ...row, id } : x)) : [...xs, { ...row, id }]));
      flash("미리보기 모드: 화면에만 반영됐어요");
    } else {
      const { id, ...rest } = row;
      const res = id ? await db.from("milestones").update(rest).eq("id", id) : await db.from("milestones").insert(rest);
      if (res.error) return flash(`저장 실패: ${res.error.message}`);
      flash("저장했어요");
      await load();
    }
    setEditingM(null);
  }

  async function deleteMilestone(m: Milestone) {
    if (preview || !db) setMilestones((xs) => xs.filter((x) => x.id !== m.id));
    else {
      const res = await db.from("milestones").delete().eq("id", m.id);
      if (res.error) return flash(`삭제 실패: ${res.error.message}`);
      await load();
    }
    flash("삭제했어요");
    setEditingM(null);
  }

  const current = useMemo(() => activities.filter((a) => !a.archived), [activities]);
  const old = useMemo(() => activities.filter((a) => a.archived), [activities]);
  const counts = useMemo(
    () => STATUSES.map((s) => ({ s, n: current.filter((a) => a.status === s).length })),
    [current]
  );
  const nextActions = current.filter((a) => a.next_action && a.status !== "완료");
  const shown = current.filter((a) => (!areaFilter || a.area === areaFilter) && (!statusFilter || a.status === statusFilter));

  if (!ready) return <div className="p-10 text-sm text-muted">불러오는 중…</div>;
  if (!preview && !session) return <Login />;

  return (
    <main className="min-h-screen bg-ivory"><div className="mx-auto max-w-3xl px-4 pb-28 pt-6 md:px-6 md:pt-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-medium tracking-tight">MUTO</p>
          <h1 className="serif mt-10 text-[32px] md:text-[44px]">활동 관리</h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link href="/" className="btn btn-ghost">홈페이지</Link>
          {!preview && (
            <button className="btn btn-ghost" onClick={() => db?.auth.signOut()}>
              로그아웃
            </button>
          )}
        </div>
      </header>

      {preview && (
        <p className="mt-6 border border-line bg-white px-4 py-3 text-[11px] leading-5 text-muted">
          미리보기 모드예요. Supabase를 연결하면(README 참고) 로그인 후 수정한 내용이 저장되고 홈페이지에 바로 반영돼요.
        </p>
      )}

      <section className="mt-6 grid grid-cols-4 gap-px border border-line bg-line">
        {counts.map(({ s, n }) => (
          <button
            key={s}
            onClick={() => {
              setTab("activities");
              setStatusFilter(statusFilter === s ? "" : s);
            }}
            className={`p-4 text-left transition-colors ${statusFilter === s ? "bg-ink text-white" : "bg-white"}`}
          >
            <span className={`text-[11px] ${statusFilter === s ? "text-white/70" : "text-muted"}`}>{s}</span>
            <span className="serif mt-6 block text-[28px] tabular-nums">{n}</span>
          </button>
        ))}
      </section>

      {nextActions.length > 0 && (
        <section className="-mt-px border border-line bg-white p-4">
          <p className="text-[12px] font-medium">다음 행동</p>
          <ul className="mt-3 space-y-1.5 text-[12px]">
            {nextActions.map((a) => (
              <li key={a.id} className="flex gap-2">
                <span>→</span>
                <button className="text-left" onClick={() => setEditingA(a)}>
                  <span className="text-muted">{a.title} · </span>
                  {a.next_action}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="mt-10 flex gap-6 border-b border-line text-[12px]">
        {(
          [
            ["activities", `활동 ${current.length}`],
            ["milestones", `마일스톤 ${milestones.length}`],
            ["old", `OLD ${old.length}`],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`-mb-px border-b py-2 ${tab === k ? "border-ink text-ink" : "border-transparent text-muted"}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "activities" && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <select className="input !w-auto" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
              <option value="">모든 영역</option>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <select className="input !w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">모든 상태</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {AREAS.filter((ar) => shown.some((a) => a.area === ar)).map((ar) => (
            <section key={ar} className="mt-10">
              <h2 className="text-[13px] font-medium"><span className="accent-bar" />{ar}.</h2>
              <ul className="mt-3">
                {shown
                  .filter((a) => a.area === ar)
                  .map((a) => (
                    <li key={a.id} className="-mt-px border border-line bg-white p-4">
                      <div className="flex items-start gap-3">
                        <select
                          aria-label="상태"
                          value={a.status}
                          onChange={(e) => quickStatus(a, e.target.value as Status)}
                          className={`shrink-0 cursor-pointer appearance-none px-2 py-0.5 text-[11px] ${STATUS_STYLE[a.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <button className="min-w-0 flex-1 text-left" onClick={() => setEditingA(a)}>
                          <p className="text-[15px] font-medium leading-snug tracking-tight">{a.title}</p>
                          <p className="mt-1 text-[11px] text-muted">
                            {[a.where_label, progressText(a), `업데이트 ${fmtDate(a.updated_at)}`].filter(Boolean).join(" · ")}
                          </p>
                          {a.next_action && <p className="mt-2 text-[12px]">→ {a.next_action}</p>}
                        </button>
                        <span className={`shrink-0 text-[10px] ${a.is_public ? "text-ink" : "text-muted"}`}>
                          {a.is_public ? "공개" : "비공개"}
                        </span>
                      </div>
                      {a.link && (
                        <a href={a.link} target="_blank" rel="noreferrer" className="mt-2 block truncate text-xs underline">
                          {a.link}
                        </a>
                      )}
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </>
      )}

      {tab === "milestones" && (
        <ol className="mt-6">
          {milestones.map((m) => (
            <li key={m.id}>
              <button onClick={() => setEditingM(m)} className="-mt-px flex w-full items-center gap-3 border border-line bg-white p-4 text-left">
                <span className={`px-2 py-0.5 text-[11px] ${STATUS_STYLE[m.status]}`}>{m.status}</span>
                <span className="w-24 shrink-0 text-xs text-muted">{m.when_label}</span>
                <span className="flex-1">{m.label}</span>
                <span className={`text-[10px] ${m.is_public ? "text-ink" : "text-muted"}`}>{m.is_public ? "공개" : "비공개"}</span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {tab === "old" && (
        <ul className="mt-6">
          {old.length === 0 && <p className="text-sm text-muted">보관된 항목이 없어요.</p>}
          {old.map((a) => (
            <li key={a.id} className="-mt-px flex items-center gap-3 border border-dashed border-[#cfcfcf] bg-white/60 p-4 text-muted">
              <div className="flex-1">
                <p className="line-through">{a.title}</p>
                <p className="text-xs text-muted">
                  {a.area}
                  {a.summary ? ` · ${a.summary}` : ""}
                </p>
              </div>
              <button className="btn btn-ghost text-xs" onClick={() => saveActivity({ ...a, archived: false })}>
                복원
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => (tab === "milestones" ? setEditingM(blankMilestone()) : setEditingA(blankActivity()))}
        className="btn btn-dark fixed bottom-6 right-6 z-30 !px-5 !py-3"
      >
        + {tab === "milestones" ? "마일스톤" : "활동"} 추가
      </button>

      {msg && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 bg-ink/90 px-4 py-2 text-xs text-white backdrop-blur">{msg}</div>
      )}

      {editingA && (
        <ActivityEditor
          value={editingA}
          onClose={() => setEditingA(null)}
          onSave={saveActivity}
          onDelete={editingA.id ? () => deleteActivity(editingA) : undefined}
        />
      )}
      {editingM && (
        <MilestoneEditor
          value={editingM}
          onClose={() => setEditingM(null)}
          onSave={saveMilestone}
          onDelete={editingM.id ? () => deleteMilestone(editingM) : undefined}
        />
      )}
    </div></main>
  );
}

function Login() {
  const db = browserSupabase();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await db!.auth.signInWithPassword({ email, password: pw });
    if (error) setErr("로그인하지 못했어요. 이메일과 비밀번호를 확인해 주세요.");
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm border border-line bg-white p-8">
        <p className="text-[14px] font-medium tracking-tight">MUTO</p>
        <h1 className="serif mt-16 text-[28px]">관리 로그인</h1>
        <div className="mt-8 space-y-3" role="form">
          <input className="input" type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit(e)} />
          {err && <p className="text-xs underline">{err}</p>}
          <button className="btn btn-dark w-full" onClick={submit}>
            로그인
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-muted">{label}</span>
      {children}
    </label>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 md:items-center" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full overflow-y-auto border-t border-ink bg-white p-6 md:max-w-lg md:border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="serif text-[20px]">{title}</h2>
          <button onClick={onClose} className="text-sm text-muted">
            닫기
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const nn = (s: string) => (s.trim() === "" ? null : s);
const numOrNull = (s: string) => (s.trim() === "" ? null : Number(s));

function ActivityEditor({
  value,
  onClose,
  onSave,
  onDelete,
}: {
  value: Activity;
  onClose: () => void;
  onSave: (a: Activity) => void;
  onDelete?: () => void;
}) {
  const [a, setA] = useState<Activity>(value);
  const [confirmDel, setConfirmDel] = useState(false);
  const set = <K extends keyof Activity>(k: K, v: Activity[K]) => setA((x) => ({ ...x, [k]: v }));
  return (
    <Sheet title={value.id ? "활동 수정" : "활동 추가"} onClose={onClose}>
      <div className="space-y-3">
        <Field label="작업명">
          <input className="input" value={a.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="영역">
            <select className="input" value={a.area} onChange={(e) => set("area", e.target.value as Activity["area"])}>
              {AREAS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="상태">
            <select className="input" value={a.status} onChange={(e) => set("status", e.target.value as Status)}>
              {STATUSES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="플랫폼·장소">
          <input className="input" value={a.where_label ?? ""} onChange={(e) => set("where_label", nn(e.target.value))} />
        </Field>
        <Field label="설명 (홈페이지에 보이는 문장)">
          <textarea className="input" rows={2} value={a.summary ?? ""} onChange={(e) => set("summary", nn(e.target.value))} />
        </Field>
        <Field label="다음 행동">
          <input className="input" value={a.next_action ?? ""} onChange={(e) => set("next_action", nn(e.target.value))} />
        </Field>
        <Field label="결과물 링크">
          <input className="input" type="url" placeholder="https://" value={a.link ?? ""} onChange={(e) => set("link", nn(e.target.value))} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="진척 기준">
            <input className="input" placeholder="게시 편수" value={a.progress_label ?? ""} onChange={(e) => set("progress_label", nn(e.target.value))} />
          </Field>
          <Field label="현재 (비우면 미확인)">
            <input className="input" inputMode="numeric" value={a.progress_value ?? ""} onChange={(e) => set("progress_value", numOrNull(e.target.value))} />
          </Field>
          <Field label="목표">
            <input className="input" inputMode="numeric" value={a.progress_target ?? ""} onChange={(e) => set("progress_target", numOrNull(e.target.value))} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="정렬 순서">
            <input className="input" inputMode="numeric" value={a.sort} onChange={(e) => set("sort", Number(e.target.value) || 0)} />
          </Field>
          <label className="flex items-center gap-2 pt-5 text-sm">
            <input type="checkbox" checked={a.is_public} onChange={(e) => set("is_public", e.target.checked)} />
            홈페이지에 공개
          </label>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button className="btn btn-dark" disabled={!a.title.trim()} onClick={() => onSave(a)}>
          저장
        </button>
        {value.id && (
          <button className="btn btn-ghost" onClick={() => onSave({ ...a, archived: true, is_public: false })}>
            OLD로 보관
          </button>
        )}
        {onDelete &&
          (confirmDel ? (
            <button className="btn ml-auto !border-[#d70015] text-[#d70015]" onClick={onDelete}>
              정말 삭제
            </button>
          ) : (
            <button className="ml-auto text-xs text-muted" onClick={() => setConfirmDel(true)}>
              삭제
            </button>
          ))}
      </div>
    </Sheet>
  );
}

function MilestoneEditor({
  value,
  onClose,
  onSave,
  onDelete,
}: {
  value: Milestone;
  onClose: () => void;
  onSave: (m: Milestone) => void;
  onDelete?: () => void;
}) {
  const [m, setM] = useState<Milestone>(value);
  const [confirmDel, setConfirmDel] = useState(false);
  const set = <K extends keyof Milestone>(k: K, v: Milestone[K]) => setM((x) => ({ ...x, [k]: v }));
  return (
    <Sheet title={value.id ? "마일스톤 수정" : "마일스톤 추가"} onClose={onClose}>
      <div className="space-y-3">
        <Field label="시기">
          <input className="input" placeholder="2027.06" value={m.when_label} onChange={(e) => set("when_label", e.target.value)} />
        </Field>
        <Field label="내용">
          <input className="input" value={m.label} onChange={(e) => set("label", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="상태">
            <select className="input" value={m.status} onChange={(e) => set("status", e.target.value as Status)}>
              {STATUSES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="정렬 순서">
            <input className="input" inputMode="numeric" value={m.sort} onChange={(e) => set("sort", Number(e.target.value) || 0)} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={m.is_public} onChange={(e) => set("is_public", e.target.checked)} />
          홈페이지에 공개
        </label>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <button className="btn btn-dark" disabled={!m.label.trim()} onClick={() => onSave(m)}>
          저장
        </button>
        {onDelete &&
          (confirmDel ? (
            <button className="btn ml-auto !border-[#d70015] text-[#d70015]" onClick={onDelete}>
              정말 삭제
            </button>
          ) : (
            <button className="ml-auto text-xs text-muted" onClick={() => setConfirmDel(true)}>
              삭제
            </button>
          ))}
      </div>
    </Sheet>
  );
}
