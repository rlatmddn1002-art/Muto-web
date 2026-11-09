-- MUTO Associates · Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run

create table if not exists public.admins (
  email text primary key
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  area text not null check (area in ('건축','채널','콘텐츠','출판','대학원','서비스','비전')),
  title text not null,
  status text not null default '예정' check (status in ('예정','진행','검토','완료')),
  where_label text,
  summary text,
  next_action text,
  link text,
  progress_label text,
  progress_value integer,          -- 비어 있으면 '미확인'
  progress_target integer,
  image_url text,                 -- 대표 사진
  is_public boolean not null default false,
  archived boolean not null default false,   -- OLD · 이전 버전
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  when_label text not null,
  label text not null,
  status text not null default '예정' check (status in ('예정','진행','검토','완료')),
  is_public boolean not null default false,
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.activities enable row level security;
alter table public.milestones enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where email = (auth.jwt() ->> 'email'));
$$;

-- 누구나: 공개 항목만 읽기 (홈페이지)
drop policy if exists "public read activities" on public.activities;
create policy "public read activities" on public.activities
  for select using (is_public and not archived);
drop policy if exists "public read milestones" on public.milestones;
create policy "public read milestones" on public.milestones
  for select using (is_public);

-- 관리자: 모두 읽기·쓰기
drop policy if exists "admin all activities" on public.activities;
create policy "admin all activities" on public.activities
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin all milestones" on public.milestones;
create policy "admin all milestones" on public.milestones
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 다른 기기에서 고친 내용이 앱에 바로 반영되도록
alter publication supabase_realtime add table public.activities;
alter publication supabase_realtime add table public.milestones;

-- 대표 사진 저장소 (공개 읽기, 관리자만 업로드)
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;
drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects
  for all to authenticated using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());

-- 이미 schema.sql을 실행한 경우 이 줄만 실행하면 돼요
alter table public.activities add column if not exists image_url text;
