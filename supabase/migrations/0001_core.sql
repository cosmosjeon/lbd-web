-- 0001_core.sql
-- Initial core schema for LBD website (idempotent)

begin;

-- legacy_posts
create table if not exists public.legacy_posts (
  id bigserial primary key,
  source text not null default 'naver_cafe',
  source_url text not null,
  source_board text,
  source_id text,
  title text not null,
  author_name text,
  posted_at timestamptz,
  content_html_sanitized text,
  images text[] default '{}',
  attachments text[] default '{}',
  cohort text,
  mapped_type text check (mapped_type in ('notice','session_note','activity','press','other')),
  status text not null default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  imported_at timestamptz default now()
);

create index if not exists legacy_posts_cohort_idx on public.legacy_posts (cohort);
create index if not exists legacy_posts_posted_at_idx on public.legacy_posts (posted_at desc);

-- events
create table if not exists public.events (
  id bigserial primary key,
  title text not null,
  description text,
  type text check (type in ('session','workshop','event','recruiting')) not null,
  start_at timestamptz not null,
  end_at timestamptz,
  location text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists events_start_at_idx on public.events (start_at desc);

-- subscription_leads
create table if not exists public.subscription_leads (
  id bigserial primary key,
  email text,
  phone text,
  consent_marketing boolean default false,
  consent_privacy boolean default false,
  source text default 'landing',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- notices
create table if not exists public.notices (
  id bigserial primary key,
  title text not null,
  content text not null,
  attachments text[] default '{}',
  pinned boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- member_whitelist
create table if not exists public.member_whitelist (
  phone_e164 text primary key,
  cohort text,
  is_admin boolean default false,
  status text default 'approved' check (status in ('approved','pending','revoked')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- user_identity_links
create table if not exists public.user_identity_links (
  user_id uuid references auth.users(id) on delete cascade,
  phone_e164 text,
  google_email text,
  phone_verified_at timestamptz,
  google_linked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id)
);

-- RLS enable
alter table public.legacy_posts enable row level security;
alter table public.events enable row level security;
alter table public.subscription_leads enable row level security;
alter table public.notices enable row level security;

-- Policies (create if not exists)
do $$
begin
  -- legacy_posts: public read
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'legacy_posts' and policyname = 'legacy_posts_public'
  ) then
    create policy legacy_posts_public on public.legacy_posts for select using (true);
  end if;

  -- events: public read where is_public
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'events_public'
  ) then
    create policy events_public on public.events for select using (is_public);
  end if;

  -- subscription_leads: anyone insert, admin select (admin check simplified as false placeholder)
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'subscription_leads' and policyname = 'subs_insert_anyone'
  ) then
    create policy subs_insert_anyone on public.subscription_leads for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'subscription_leads' and policyname = 'subs_admin_select'
  ) then
    create policy subs_admin_select on public.subscription_leads for select using (false);
  end if;

  -- notices: member select (simplified), admin write (simplified)
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notices' and policyname = 'notices_member_select'
  ) then
    create policy notices_member_select on public.notices for select using (false);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notices' and policyname = 'notices_admin_insert'
  ) then
    create policy notices_admin_insert on public.notices for insert with check (false);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notices' and policyname = 'notices_admin_update'
  ) then
    create policy notices_admin_update on public.notices for update using (false);
  end if;
end $$;

commit;


