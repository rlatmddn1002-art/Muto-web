import { RESEARCH_CATEGORIES, SERIES_CATEGORIES, WORKS_CATEGORIES } from "./series";

/** 홈페이지가 보여주는 블로그 카테고리 전체 */
export const TRACKED_CATEGORIES = [...Object.values(SERIES_CATEGORIES).flat(), ...WORKS_CATEGORIES, ...RESEARCH_CATEGORIES];
