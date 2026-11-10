/**
 * 홈페이지 연재 ↔ 네이버 블로그 카테고리 연결
 * key: 관리 앱의 연재(콘텐츠) 작업명 / value: 블로그 카테고리 이름
 */
export const SERIES_CATEGORIES: Record<string, string[]> = {
  "우리가 사는 공간의 비밀": ["우리가 사는 공간의 비밀"],
  공간미학: ["공간미학(국내)", "공간미학(해외)"],
};

/** 연재 로고 (public/brand) */
export const SERIES_LOGOS: Record<string, string> = {
  공간미학: "/brand/series-gonggan-mihak.png",
};

const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "").toLowerCase();

export function inCategories(category: string | null, cats: string[]) {
  const c = norm(category);
  return cats.some((x) => norm(x) === c);
}

/** 블로그 'works' 카테고리 → 홈페이지 Architecture · Projects */
export const WORKS_CATEGORIES = ["works"];

/** 제목에 [YKH]가 있으면 YKH 재직 중 작업, 아니면 MUTO 작업 */
export function workOwner(title: string): "YKH" | "MUTO" {
  return /\[\s*YKH\s*\]|\bYKH\b/i.test(title) ? "YKH" : "MUTO";
}

/** 홈페이지에 보일 제목: 앞뒤의 [YKH] 표시를 떼요 */
export function workTitle(title: string) {
  return title.replace(/\[\s*YKH\s*\]\s*/gi, "").trim();
}
