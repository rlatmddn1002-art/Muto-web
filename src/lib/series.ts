/**
 * 홈페이지 연재 ↔ 네이버 블로그 카테고리 연결
 * key: 관리 앱의 연재(콘텐츠) 작업명 / value: 블로그 카테고리 이름
 */
export const SERIES_CATEGORIES: Record<string, string[]> = {
  "우리가 사는 공간의 비밀": ["우리가 사는 공간의 비밀"],
  공간미학: ["공간미학(국내)", "공간미학(해외)"],
};

const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "").toLowerCase();

export function inCategories(category: string | null, cats: string[]) {
  const c = norm(category);
  return cats.some((x) => norm(x) === c);
}
