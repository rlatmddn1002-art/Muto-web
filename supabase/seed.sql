-- MUTO Associates · 초기 데이터 (2026-11-09 기준)
-- schema.sql 실행 후 Run. 관리자 이메일은 Supabase에서 만든 로그인 계정과 같아야 해요.

insert into public.admins (email) values ('rlatmddn1002@nate.com') on conflict do nothing;

insert into public.activities (area,title,status,where_label,summary,progress_label,is_public,archived,sort) values
  ('채널','무토의 공간미학','진행','네이버 블로그','연재와 출판, 생각과 작업을 쌓아두는 서고(아카이브). 인테리어 카테고리 상위 1%.',null,true,false,1),
  ('채널','@muto_associates','진행','Instagram','작업물 아카이브.',null,true,false,2),
  ('채널','공간미학','진행','YouTube','MUTO의 유튜브 채널.',null,true,false,3),
  ('콘텐츠','우리가 사는 공간의 비밀','진행','블로그 연재','일상의 공간에 숨은 건축의 원리를 풀어내는 연재.','게시 편수',true,false,1),
  ('콘텐츠','공간미학','진행','블로그 연재','공간을 바라보는 미학적 시선에 관한 연재.','게시 편수',true,false,2),
  ('출판','Korea Residence Type Metabolism Catalogue','완료','교보eBook · 리디','한국 주거 유형의 변화를 다룬 전자책.',null,true,false,1),
  ('출판','럭셔리를 디자인 언어로 해석하는 과정','완료','작가와','2026년 10월 발간. 럭셔리를 디자인 언어로 번역하는 과정을 담은 전자책.',null,true,false,2),
  ('출판','건축설계 전과정 바이블','진행','블로그 → 전자책','근린생활시설 기준, 대지조사부터 사용승인까지 법적 근거와 함께.','원고 완료 편수',true,false,3),
  ('출판','옥상에서 온 편지','검토','사계절출판사','아동소설. 투고 완료, 결과 대기.',null,false,false,4),
  ('출판','''공간의 비밀'' 단행본','예정',null,'연재를 책으로 묶는 계획. 형태 미정.',null,false,false,5),
  ('대학원','추계학술발표대회 논문','완료','2026.10.22 발표','물리적 잔존요소를 활용한 유휴시설 복합문화공간 건축계획에 관한 연구.',null,false,false,1),
  ('대학원','석사학위논문','진행','홍익대 건축도시대학원','학술대회 논문을 확장. 사례 추가, 유형별 매트릭스 분석.',null,false,false,2),
  ('대학원','졸업설계 대상지','검토','통영 옛 신아sb 조선소','유력 후보, 자료 확보 가능성 확인 단계.',null,false,false,3),
  ('서비스','PlotLab','진행','Vercel 베타','AI 건물 합성 웹툴.',null,true,false,1),
  ('비전','스테이','예정',null,'아만처럼 장소성을 특화한 경험의 스테이.',null,false,false,1),
  ('비전','문화 인프라 (건축·출판·스테이)','예정',null,'건축·콘텐츠·글쓰기·공간 기획을 넘나드는 장기 비전.',null,false,false,2),
  ('콘텐츠','대구 수변공원 다도카페 리모델링 포스팅','진행',null,'이전 정리 항목',null,false,true,0),
  ('콘텐츠','BUILD CHECK 카드뉴스','진행',null,'이전 정리 항목',null,false,true,0),
  ('서비스','BUILD CHECK','진행',null,'이전 정리 항목',null,false,true,0),
  ('채널','유튜브 쇼츠 @muto_space','진행',null,'→ 유튜브 ''공간미학''으로 정정',null,false,true,0),
  ('채널','MUTO BGM 유튜브 채널','예정',null,'이전 정리 항목',null,false,true,0),
  ('채널','인스타 단상(글) 게시물','예정',null,'이전 정리 항목',null,false,true,0),
  ('콘텐츠','''공간의 비밀 100가지'' 인스타 카드뉴스','진행',null,'→ 블로그 연재로 정정',null,false,true,0);

insert into public.milestones (when_label,label,status,is_public,sort) values
  ('2026.10','『럭셔리를 디자인 언어로 해석하는 과정』 전자책 발간','완료',true,1),
  ('2026.10','추계학술발표대회 발표','완료',false,2),
  ('2027 1학기','홍익대 건축도시대학원 졸업 (석사논문·졸업설계)','예정',false,3),
  ('2027.06','YKH Associates 퇴사 — 휴식','예정',false,4),
  ('2027 2학기','건축사 자격시험 준비 시작','예정',false,5),
  ('2028 상반기','건축사 자격시험 응시','예정',false,6);
