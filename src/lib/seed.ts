import type { Activity, Milestone } from "./types";

// Supabase를 연결하기 전 미리보기용 데이터 (supabase/seed.sql과 같은 내용)
const t = "2026-11-09T12:00:00Z";
const a = (
  id: string,
  area: Activity["area"],
  title: string,
  status: Activity["status"],
  where_label: string | null,
  summary: string | null,
  extra: Partial<Activity> = {}
): Activity => ({
  id,
  area,
  title,
  status,
  where_label,
  summary,
  next_action: null,
  link: null,
  progress_label: null,
  progress_value: null,
  progress_target: null,
  is_public: true,
  archived: false,
  sort: 0,
  updated_at: t,
  ...extra,
});

export const seedActivities: Activity[] = [
  a("a01", "채널", "무토의 공간미학", "진행", "네이버 블로그", "연재와 출판, 생각과 작업을 쌓아두는 서고(아카이브). 인테리어 카테고리 상위 1%.", { sort: 1 }),
  a("a02", "채널", "@muto_associates", "진행", "Instagram", "작업물 아카이브.", { sort: 2 }),
  a("a03", "채널", "공간미학", "진행", "YouTube", "MUTO의 유튜브 채널.", { sort: 3 }),
  a("c01", "콘텐츠", "우리가 사는 공간의 비밀", "진행", "블로그 연재", "일상의 공간에 숨은 건축의 원리를 풀어내는 연재.", { sort: 1, progress_label: "게시 편수" }),
  a("c02", "콘텐츠", "공간미학", "진행", "블로그 연재", "공간을 바라보는 미학적 시선에 관한 연재.", { sort: 2, progress_label: "게시 편수" }),
  a("p01", "출판", "Korea Residence Type Metabolism Catalogue", "완료", "교보eBook · 리디", "한국 주거 유형의 변화를 다룬 전자책.", { sort: 1 }),
  a("p02", "출판", "럭셔리를 디자인 언어로 해석하는 과정", "완료", "작가와", "2026년 10월 발간. 럭셔리를 디자인 언어로 번역하는 과정을 담은 전자책.", { sort: 2 }),
  a("p03", "출판", "건축설계 전과정 바이블", "진행", "블로그 → 전자책", "근린생활시설 기준, 대지조사부터 사용승인까지 법적 근거와 함께.", { sort: 3, progress_label: "원고 완료 편수" }),
  a("p04", "출판", "옥상에서 온 편지", "검토", "사계절출판사", "아동소설. 투고 완료, 결과 대기.", { sort: 4, is_public: false }),
  a("p05", "출판", "'공간의 비밀' 단행본", "예정", null, "연재를 책으로 묶는 계획. 형태 미정.", { sort: 5, is_public: false }),
  a("g01", "대학원", "추계학술발표대회 논문", "완료", "2026.10.22 발표", "물리적 잔존요소를 활용한 유휴시설 복합문화공간 건축계획에 관한 연구.", { sort: 1, is_public: false }),
  a("g02", "대학원", "석사학위논문", "진행", "홍익대 건축도시대학원", "학술대회 논문을 확장. 사례 추가, 유형별 매트릭스 분석.", { sort: 2, is_public: false }),
  a("g03", "대학원", "졸업설계 대상지", "검토", "통영 옛 신아sb 조선소", "유력 후보, 자료 확보 가능성 확인 단계.", { sort: 3, is_public: false }),
  a("s01", "서비스", "PlotLab", "진행", "Vercel 베타", "AI 건물 합성 웹툴.", { sort: 1 }),
  a("v01", "비전", "스테이", "예정", null, "아만처럼 장소성을 특화한 경험의 스테이.", { sort: 1, is_public: false }),
  a("v02", "비전", "문화 인프라 (건축·출판·스테이)", "예정", null, "건축·콘텐츠·글쓰기·공간 기획을 넘나드는 장기 비전.", { sort: 2, is_public: false }),
  // OLD · 이전 버전
  a("o01", "콘텐츠", "대구 수변공원 다도카페 리모델링 포스팅", "진행", null, "이전 정리 항목", { archived: true, is_public: false }),
  a("o02", "콘텐츠", "BUILD CHECK 카드뉴스", "진행", null, "이전 정리 항목", { archived: true, is_public: false }),
  a("o03", "서비스", "BUILD CHECK", "진행", null, "이전 정리 항목", { archived: true, is_public: false }),
  a("o04", "채널", "유튜브 쇼츠 @muto_space", "진행", null, "→ 유튜브 '공간미학'으로 정정", { archived: true, is_public: false }),
  a("o05", "채널", "MUTO BGM 유튜브 채널", "예정", null, "이전 정리 항목", { archived: true, is_public: false }),
  a("o06", "채널", "인스타 단상(글) 게시물", "예정", null, "이전 정리 항목", { archived: true, is_public: false }),
  a("o07", "콘텐츠", "'공간의 비밀 100가지' 인스타 카드뉴스", "진행", null, "→ 블로그 연재로 정정", { archived: true, is_public: false }),
];

export const seedMilestones: Milestone[] = [
  { id: "m01", when_label: "2026.10", label: "『럭셔리를 디자인 언어로 해석하는 과정』 전자책 발간", status: "완료", is_public: true, sort: 1, updated_at: t },
  { id: "m02", when_label: "2026.10", label: "추계학술발표대회 발표", status: "완료", is_public: false, sort: 2, updated_at: t },
  { id: "m03", when_label: "2027 1학기", label: "홍익대 건축도시대학원 졸업 (석사논문·졸업설계)", status: "예정", is_public: false, sort: 3, updated_at: t },
  { id: "m04", when_label: "2027.06", label: "YKH Associates 퇴사 — 휴식", status: "예정", is_public: false, sort: 4, updated_at: t },
  { id: "m05", when_label: "2027 2학기", label: "건축사 자격시험 준비 시작", status: "예정", is_public: false, sort: 5, updated_at: t },
  { id: "m06", when_label: "2028 상반기", label: "건축사 자격시험 응시", status: "예정", is_public: false, sort: 6, updated_at: t },
];
