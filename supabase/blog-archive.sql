-- 블로그 글 보관함: RSS(최근 약 30편)에서 밀려난 글도 홈페이지에 남겨요.
create table if not exists public.blog_posts (
  link text primary key,
  title text not null,
  category text,
  excerpt text not null default '',
  date timestamptz,
  image text,
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts public read" on public.blog_posts;
create policy "blog_posts public read" on public.blog_posts for select using (true);

drop policy if exists "blog_posts admin write" on public.blog_posts;
create policy "blog_posts admin write" on public.blog_posts for all
  using (public.is_admin()) with check (public.is_admin());
