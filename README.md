# MUTO Associates 웹앱

공개 홈페이지(`/`)와 관리 앱(`/admin`)이 하나로 된 프로젝트예요.
관리 앱에서 고친 내용은 홈페이지에 바로 반영되고, 폰 홈 화면에 앱처럼 설치할 수 있어요(PWA).

- **홈페이지 `/`** — 연재 · 출판 · 작업 · 채널 · 타임라인. '홈페이지에 공개'를 켠 항목만 보여요.
- **관리 앱 `/admin`** — 로그인 후 활동·마일스톤 추가/수정/삭제, 상태(예정·진행·검토·완료) 변경,
  다음 행동, 결과물 링크, 진척(비우면 '미확인'), OLD 보관/복원. 다른 기기에서 고친 내용도 실시간 반영.

Supabase를 연결하기 전에는 **미리보기 모드**로 돌아가요(초기 데이터로 화면만 확인, 저장 안 됨).

## 1. Supabase 만들기 (무료, 10분)

1. https://supabase.com 에서 새 프로젝트 생성 (Region: Northeast Asia (Seoul))
2. **SQL Editor** → `supabase/schema.sql` 붙여넣고 Run → 이어서 `supabase/seed.sql` Run
3. **Authentication → Users → Add user** 로 내 이메일·비밀번호 계정 만들기
   (`seed.sql`의 관리자 이메일과 같아야 해요. 다르면 seed.sql 4번째 줄을 고쳐서 실행)
4. **Authentication → Sign In / Providers** 에서 *Allow new users to sign up* 끄기
   (다른 사람이 가입하지 못하게)
5. **Project Settings → API** 에서 `Project URL`, `anon public` 키 복사

## 2. 로컬 실행

```bash
cp .env.example .env.local   # 위에서 복사한 값 넣기
npm install
npm run dev                  # http://localhost:3000
```

## 3. 배포 (GitHub + Vercel)

1. GitHub에 새 저장소(예: `muto-web`)를 만들고 이 폴더를 push
2. https://vercel.com → Add New Project → 저장소 선택
3. Environment Variables에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 입력 → Deploy
4. 도메인이 있으면 Vercel → Settings → Domains 에서 연결

## 4. 폰에 앱으로 설치

- iPhone(Safari): `https://내도메인/admin` 열기 → 공유 → **홈 화면에 추가**
- Android(Chrome): 메뉴 → **앱 설치**

## 구조

```
src/app/page.tsx          홈페이지
src/components/Sections.tsx  홈페이지의 데이터 섹션
src/app/admin/page.tsx    관리 앱
src/app/manifest.ts       PWA 설정 · public/sw.js 서비스워커
src/lib/seed.ts           미리보기용 초기 데이터
supabase/*.sql            DB 스키마 · 초기 데이터
```

홈페이지 문구(소개, 철학 3가지)는 `src/app/page.tsx`에서 바로 고칠 수 있어요.
