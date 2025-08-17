-- 0003_content_and_search.sql
-- Add member-only content tables (info_posts, resources), refine RLS using profiles.role,
-- and add full-text search vectors and GIN indexes.

begin;

-- info_posts (멤버 전용)
create table if not exists public.info_posts (
  id bigserial primary key,
  title text not null,
  content text not null,
  tags text[] default '{}',
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- resources (멤버 전용)
create table if not exists public.resources (
  id bigserial primary key,
  title text not null,
  description text,
  url text,
  file_url text,
  cohort text,
  week int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.info_posts enable row level security;
alter table public.resources enable row level security;

-- Refine existing policies to use profiles.role = 'admin'
-- subscription_leads: insert anyone, select admin only
drop policy if exists subs_admin_select on public.subscription_leads;
create policy subs_admin_select on public.subscription_leads for select using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

-- notices: member select, admin insert/update
drop policy if exists notices_member_select on public.notices;
create policy notices_member_select on public.notices for select using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid())
);
drop policy if exists notices_admin_insert on public.notices;
create policy notices_admin_insert on public.notices for insert with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);
drop policy if exists notices_admin_update on public.notices;
create policy notices_admin_update on public.notices for update using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

-- events: public read when is_public, admin write
drop policy if exists events_public on public.events;
create policy events_public on public.events for select using (is_public);
drop policy if exists events_admin_insert on public.events;
create policy events_admin_insert on public.events for insert with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);
drop policy if exists events_admin_update on public.events;
create policy events_admin_update on public.events for update using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

-- info_posts/resources: member select, admin write
drop policy if exists info_posts_member_select on public.info_posts;
create policy info_posts_member_select on public.info_posts for select using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid())
);
drop policy if exists info_posts_admin_write on public.info_posts;
create policy info_posts_admin_write on public.info_posts for all using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
)
with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

drop policy if exists resources_member_select on public.resources;
create policy resources_member_select on public.resources for select using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid())
);
drop policy if exists resources_admin_write on public.resources;
create policy resources_admin_write on public.resources for all using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
)
with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

-- Full-text search vectors and GIN indexes
-- legacy_posts: title + content_html_sanitized
do $$
begin
  if not exists (
    select 1 from information_schema.columns where table_schema='public' and table_name='legacy_posts' and column_name='search_tsv'
  ) then
    alter table public.legacy_posts add column search_tsv tsvector;
    update public.legacy_posts set search_tsv = to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content_html_sanitized,''));
    create index if not exists legacy_posts_search_tsv_idx on public.legacy_posts using gin (search_tsv);
  end if;
end $$;

-- info_posts: title + content
do $$
begin
  if not exists (
    select 1 from information_schema.columns where table_schema='public' and table_name='info_posts' and column_name='search_tsv'
  ) then
    alter table public.info_posts add column search_tsv tsvector;
    update public.info_posts set search_tsv = to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,''));
    create index if not exists info_posts_search_tsv_idx on public.info_posts using gin (search_tsv);
  end if;
end $$;

commit;


