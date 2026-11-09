import { getPublicActivities, getPublicMilestones } from "@/lib/data";
import type { Activity } from "@/lib/types";

const statusLabel = (s: Activity["status"]) =>
  ({ 예정: "Planned", 진행: "Ongoing", 검토: "In review", 완료: "Published" })[s];

function Header({ id, title, note }: { id: string; title: string; note?: string }) {
  return (
    <div id={id} className="grid-frame -mt-px scroll-mt-6 grid-cols-2 md:grid-cols-4">
      <div className="cell pt-16 md:pt-24">
        <p className="text-[15px] font-medium"><span className="accent-bar" />{title}.</p>
      </div>
      <div className="cell pt-16 md:col-span-3 md:pt-24 text-right">
        {note && <p className="label">{note}</p>}
      </div>
    </div>
  );
}

function Row({ a, i }: { a: Activity; i: number }) {
  return (
    <div className="grid-frame -mt-px grid-cols-[56px_1fr] md:grid-cols-4">
      <div className="cell">
        <p className="label tabular-nums">{String(i + 1).padStart(2, "0")}</p>
        <p className="sub mt-1 hidden md:block">{a.where_label}</p>
      </div>
      <div className="cell md:col-span-2">
        <h3 className="serif text-[17px] leading-snug md:text-[20px]">{a.title}</h3>
        {a.summary && <p className="sub mt-2 max-w-[460px] leading-5">{a.summary}</p>}
        <p className="sub mt-2 md:hidden">{a.where_label}</p>
      </div>
      <div className="cell col-span-2 flex items-start justify-between gap-3 md:col-span-1 md:flex-col md:items-end">
        <span className={`tag ${a.status === "진행" ? "tag-on" : ""}`}>{statusLabel(a.status)}</span>
        {a.link && (
          <a href={a.link} target="_blank" rel="noreferrer" className="label ulink">View →</a>
        )}
      </div>
    </div>
  );
}

function Block({ id, title, note, items }: { id: string; title: string; note?: string; items: Activity[] }) {
  if (!items.length) return null;
  return (
    <section>
      <Header id={id} title={title} note={note} />
      {items.map((a, i) => (
        <Row key={a.id} a={a} i={i} />
      ))}
    </section>
  );
}

export async function PublicSections() {
  const all = await getPublicActivities();
  const by = (area: string) => all.filter((a) => a.area === area);
  const works = [...by("서비스"), ...by("대학원"), ...by("비전")];
  const channels = by("채널");
  return (
    <>
      <Block id="series" title="Series" note="블로그 연재" items={by("콘텐츠")} />
      <Block id="books" title="Publications" note="전자책 · 출판" items={by("출판")} />
      <Block id="works" title="Works" note="도구 · 프로젝트" items={works} />
      {channels.length > 0 && (
        <section>
          <Header id="channels" title="Channels" note="MUTO를 만나는 곳" />
          <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
            {channels.map((c) => {
              const inner = (
                <>
                  <p className="sub">{c.where_label}</p>
                  <p className="serif mt-8 text-[17px]">{c.title}</p>
                </>
              );
              return c.link ? (
                <a key={c.id} href={c.link} target="_blank" rel="noreferrer" className="cell block transition-colors hover:bg-[#f6f6f6]">
                  {inner}
                </a>
              ) : (
                <div key={c.id} className="cell">{inner}</div>
              );
            })}
            {Array.from({ length: (4 - (channels.length % 4)) % 4 }).map((_, i) => (
              <div key={`f${i}`} className="cell hidden md:block" />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export async function PublicTimeline() {
  const ms = await getPublicMilestones();
  if (!ms.length) return null;
  return (
    <section>
      <Header id="timeline" title="Timeline" />
      {ms.map((m) => (
        <div key={m.id} className="grid-frame -mt-px grid-cols-[96px_1fr] md:grid-cols-4">
          <div className="cell label tabular-nums">{m.when_label}</div>
          <div className="cell md:col-span-3">{m.label}</div>
        </div>
      ))}
    </section>
  );
}

export function SectionsFallback() {
  return (
    <div className="grid-frame -mt-px grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="cell h-40 animate-pulse" />
      ))}
    </div>
  );
}
