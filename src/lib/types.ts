export const AREAS = ["건축", "채널", "콘텐츠", "출판", "대학원", "서비스", "비전"] as const;
export type Area = (typeof AREAS)[number];

// 프로젝트 기준 상태: 예정 · 진행 · 검토 · 완료
export const STATUSES = ["예정", "진행", "검토", "완료"] as const;
export type Status = (typeof STATUSES)[number];

export type Activity = {
  id: string;
  area: Area;
  title: string;
  status: Status;
  where_label: string | null; // 플랫폼·장소 (네이버 블로그, 작가와 …)
  summary: string | null; // 한두 줄 설명
  next_action: string | null; // 다음 행동
  link: string | null; // 결과물 링크
  progress_label: string | null; // 진척 기준 (게시 편수, 원고 완료 편수 …)
  progress_value: number | null; // null = 미확인
  progress_target: number | null;
  image_url: string | null; // 대표 사진 (건축 프로젝트 등)
  is_public: boolean; // 홈페이지에 공개
  archived: boolean; // OLD · 이전 버전
  sort: number;
  updated_at: string;
};

export type Milestone = {
  id: string;
  when_label: string;
  label: string;
  status: Status;
  is_public: boolean;
  sort: number;
  updated_at: string;
};
