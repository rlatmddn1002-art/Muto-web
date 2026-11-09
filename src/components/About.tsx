/** 무토에 대하여 — 승우님이 직접 쓴 글 (문장 다듬기만 함) */

const ROWS: [string, string, string[]][] = [
  [
    "Name",
    "이름",
    [
      "MUTO Associates의 무토(戊土)는 큰 산을 의미합니다.",
      "건축이 기반이 되어 다양한 분야와의 협업을 통해 문화적 확장이라는 나무를 피워 나가는 집단이 되길 바라는 뜻으로 명명하였습니다.",
    ],
  ],
  [
    "Belief",
    "생각",
    [
      "건축은 삶을 담는 그릇으로서 결코 독립적으로 존재할 수 없습니다. 건축은 이를 이용하는 사람의 경험으로부터 채워진다고 생각합니다.",
      "그래서 건축은 형태에만 국한되지 않습니다. 생각을 담아내는 책도, 함께 이야기를 나누는 카페도, 여러 모습으로 나를 존재하게 만드는 세계 각지의 스테이도 모두 건축이 될 수 있습니다.",
    ],
  ],
  [
    "Now",
    "지금",
    [
      "경북대학교 건축학과를 졸업하고 YKH Associates에서 클럽하우스, 리조트, 주상복합, 도시계획 등의 프로젝트를 맡아 진행하고 있습니다.",
      "동시에 홍익대학교 건축도시대학원에서 지속가능성과 순환이라는 개념을 중심으로 학업과 논문 작성을 이어 가고 있습니다.",
    ],
  ],
  [
    "Archive",
    "기록",
    [
      "2025년과 2026년, 각 한 권씩 전자책을 발간하였습니다. MUTO의 철학을 정립해 나가기 위한 아카이브로서 꾸준히 생각을 기록하며 나아가고자 합니다.",
      "블로그는 생각을 기록하는 서재로 쓰고 있으며, 연재물 「우리가 사는 공간의 비밀」과 「공간미학」은 세상을 기록하는 방식으로 이어 가고 있습니다.",
    ],
  ],
  [
    "Future",
    "앞으로",
    [
      "무토는 1000억대 자산가 건축가 김승우가 이끄는 어소시에이트 형식의 건축 스튜디오가 될 예정입니다.",
      "건축과 이념을 이루는 데 자본은 절대적으로 중요합니다. 건축은 오랜 시간이 걸리는 일이며, 그 시간을 받쳐 줄 근간이 없다면 철학을 담은 작업은 불가능합니다. 자산이 근간이 될 때 여러 협업으로 거침없이 뻗어 나갈 수 있습니다.",
      "MUTO는 지속가능성과 경험의 구조를 중심으로 건축 설계를 이어 가고, 지역성을 중심에 둔 호시노야를 본받아 직접 투자하고 설계한 세계 각지의 스테이를 만들어 갈 예정입니다. 출판을 통해 관련한 이들의 삶을 기록하고, 삶을 공유하는 방식으로서 건축 스튜디오와 더불어 카페 형태의 공간을 꾸려 나갈 것입니다.",
    ],
  ],
];

const KEYWORDS: [string, string, string][] = [
  [
    "Architecture",
    "지속가능성 · 순환",
    "건축은 삶을 담는 그릇으로서 바탕이 되는 개념을 추구합니다. 형태는 차분하게, 공간은 Quiet Luxury의 감각으로 모든 프로젝트를 관통해 이어 갑니다.",
  ],
  [
    "Stay",
    "지역성 · 온전한 경험",
    "우리는 겪어 온 모든 환경으로 이루어져 있습니다. 바쁜 일상 속 나를 잃어버린 듯할 때, 새로운 나를 찾고 싶을 때 사유하고 경험할 수 있도록 그 지역을 온전히 느끼는 공간과 프로그램을 큐레이션합니다.",
  ],
  [
    "Café",
    "사유 · 교류",
    "사무실과 연계된 열린 공간으로서 많은 이들의 안식처가 되고, 서로 교류하는 공간이 되길 바랍니다.",
  ],
  [
    "Publishing",
    "삶",
    "저마다 펼친, 그리고 펼쳐 나갈 삶을 담는 그릇으로서 출판이 역할을 합니다.",
  ],
];

export function About() {
  return (
    <section>
      <div id="about" className="grid-frame -mt-px scroll-mt-6 grid-cols-2 md:grid-cols-4">
        <div className="cell pt-16 md:pt-24">
          <p className="text-[15px] font-medium">
            <span className="accent-bar" />
            About.
          </p>
        </div>
        <div className="cell pt-16 text-right md:col-span-3 md:pt-24">
          <p className="label">무토에 대하여</p>
        </div>
      </div>

      {ROWS.map(([en, ko, paras]) => (
        <div key={en} className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
          <div className="cell">
            <p className="label font-medium">{en}</p>
            <p className="sub mt-1">{ko}</p>
          </div>
          <div className="cell md:col-span-3">
            <div className="max-w-[620px] space-y-3 text-[13px] leading-[1.9] text-ink/85">
              {paras.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
        <div className="cell md:col-span-4">
          <p className="label font-medium">Keyword</p>
          <p className="sub mt-1">네 개의 축</p>
        </div>
        {KEYWORDS.map(([en, kw, d]) => (
          <div key={en} className="cell flex flex-col gap-6 md:min-h-[260px]">
            <p className="sub">{en}</p>
            <p className="serif text-[18px]">{kw}</p>
            <p className="mt-auto text-[12px] leading-[1.8] text-ink/75">{d}</p>
          </div>
        ))}
      </div>

      <div className="grid-frame -mt-px grid-cols-1 md:grid-cols-4">
        <div className="cell">
          <p className="label font-medium">Closing</p>
          <p className="sub mt-1">끝으로</p>
        </div>
        <div className="cell md:col-span-3">
          <div className="max-w-[620px] space-y-3 text-[13px] leading-[1.9] text-ink/85">
            <p>
              이 모든 것은 결코 혼자 힘으로 이뤄 나갈 수 없습니다. 많은 이들과 건강한 관계를 유지하며 꾸려 나갈 수 있길
              간절히 바랍니다.
            </p>
            <p>함께 작업을 이어 나가고 싶으신 분들은 언제든 연락 부탁드립니다. 감사합니다.</p>
          </div>
          <a href="#channels" className="label ulink mt-6 inline-block">
            Contact →
          </a>
        </div>
      </div>
    </section>
  );
}
