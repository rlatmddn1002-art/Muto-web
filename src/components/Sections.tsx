import { getPublicActivities, getPublicMilestones } from "@/lib/data";
import type { Activity } from "@/lib/types";

const statusLabel = (a: Activity) => (a.status === "완료" ? "출간" : a.status === "진행" ? "진행 중" : a.status);

function Card({ a, large = false }: { a: Activity; large?: boolean }) {
  const body = (
    <div className={`card flex h-full flex-col ${large ? "p-10 md:p-12" : "p-8"}`}>
      <p className="text-[12px] font-medium text-muted">
        {a.where_label}
        {a.where_label ? " · " : ""}
        {statusLabel(a)}
      </p>
      <h3 className={`serif mt-3 ${large ? "text-[32px] md:text-[40px] leading-[1.15]" : "text-[24px] leading-[1.25]"}`}>{a.title}</h3>
      {a.summary && <p className="mt-4 text-[15px] leading-7 text-muted">{a.summary}</p>}
      {a.link && <span className="link-more mt-auto pt-6">자세히 보기 ›</span>}
    </div>
  );
  return a.link ? (
    <a href={a.link} target="_blank" rel="noreferrer" className="block transition-transform duration-300 hover:scale-[1.01]">
      {body}
    </a>
  ) : (
    body
  );
}

function Block({ id, eyebrow, title, items, large }: { id: string; eyebrow: string; title: string; items: Activity[]; large?: boolean }) {
  if (!items.length) return null;
  return (
    <section id={id} className="scroll-mt-12 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[980px]">
        <div className="text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="serif mt-3 text-[40px] md:text-[56px]">{title}</h2>
        </div>
        <div className={`mt-14 grid gap-5 ${items.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-[640px]"}`}>
          {items.map((a) => (
            <Card key={a.id} a={a} large={large} />
          ))}
        </div>
      </div>
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
      <Block id="series" eyebrow="Series" title="연재" items={by("콘텐츠")} large />
      <div className="border-t border-black/5">
        <Block id="books" eyebrow="Publications" title="출판" items={by("출판")} />
      </div>
      <div className="border-t border-black/5">
        <Block id="works" eyebrow="Works" title="작업" items={works} />
      </div>
      {channels.length > 0 && (
        <section id="channels" className="scroll-mt-12 bg-paper px-6 py-24 md:py-32">
          <div className="mx-auto max-w-[980px] text-center">
            <p className="eyebrow">Channels</p>
            <h2 className="serif mt-3 text-[40px] md:text-[56px]">MUTO를 만나는 곳</h2>
            <ul className="mt-14 grid gap-5 md:grid-cols-3">
              {channels.map((c) => {
                const inner = (
                  <div className="rounded-[22px] bg-white px-6 py-10">
                    <p className="text-[12px] tracking-[.2em] text-muted">{c.where_label}</p>
                    <p className="serif mt-3 text-[22px]">{c.title}</p>
                    {c.link && <p className="link-more mt-4 !text-[15px]">방문하기 ›</p>}
                  </div>
                );
                return (
                  <li key={c.id}>
                    {c.link ? (
                      <a href={c.link} target="_blank" rel="noreferrer" className="block transition-transform duration-300 hover:scale-[1.02]">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
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
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[640px]">
        <p className="eyebrow text-center">Timeline</p>
        <ol className="mt-12">
          {ms.map((m) => (
            <li key={m.id} className="flex gap-8 border-t border-line py-5 text-[15px]">
              <span className="w-24 shrink-0 tabular-nums text-muted">{m.when_label}</span>
              <span>{m.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SectionsFallback() {
  return (
    <div className="mx-auto max-w-[980px] px-6 py-32">
      <div className="mx-auto h-12 w-40 animate-pulse rounded-full bg-paper" />
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-[22px] bg-paper" />
        ))}
      </div>
    </div>
  );
}
