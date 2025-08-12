-- 0002_profiles_projects.sql
-- profiles, projects domain, updated_at trigger, RLS policies

begin;

-- updated_at trigger function (idempotent)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member','admin')),
  cohort text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists profiles_role_idx on public.profiles(role);

-- projects
create table if not exists public.projects (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  summary text,
  cover_url text,
  cohort text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists projects_featured_idx on public.projects(featured);
create index if not exists projects_cohort_idx on public.projects(cohort);
create index if not exists projects_updated_idx on public.projects(updated_at desc);

-- project_members
create table if not exists public.project_members (
  id bigserial primary key,
  project_id bigint references public.projects(id) on delete cascade,
  name text not null,
  role text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists project_members_project_idx on public.project_members(project_id);

-- project_artifacts
create table if not exists public.project_artifacts (
  id bigserial primary key,
  project_id bigint references public.projects(id) on delete cascade,
  kind text check (kind in ('repo','demo','deck','press','image','file')) not null,
  url text,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists project_artifacts_project_idx on public.project_artifacts(project_id);

-- project_milestones
create table if not exists public.project_milestones (
  id bigserial primary key,
  project_id bigint references public.projects(id) on delete cascade,
  title text not null,
  occurred_at date,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists project_milestones_project_idx on public.project_milestones(project_id);

-- project_awards
create table if not exists public.project_awards (
  id bigserial primary key,
  project_id bigint references public.projects(id) on delete cascade,
  title text not null,
  organization text,
  awarded_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists project_awards_project_idx on public.project_awards(project_id);

-- RLS enable
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_artifacts enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_awards enable row level security;
alter table public.profiles enable row level security;

-- policies (idempotent via conditional checks)
do $$
begin
  -- profiles: self read/update only
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_self_select'
  ) then
    create policy profiles_self_select on public.profiles for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_self_update'
  ) then
    create policy profiles_self_update on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  -- projects domain: public select, admin write
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='projects' and policyname='projects_public_select'
  ) then
    create policy projects_public_select on public.projects for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='projects' and policyname='projects_admin_write'
  ) then
    create policy projects_admin_write on public.projects for all using (
      exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
    ) with check (
      exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
    );
  end if;

  -- children tables: public select, admin write
  for pol in select 'project_members'::text as t union all select 'project_artifacts' union all select 'project_milestones' union all select 'project_awards'
  loop
    if not exists (
      select 1 from pg_policies where schemaname='public' and tablename=pol.t and policyname=pol.t||'_public_select'
    ) then
      execute format('create policy %I on public.%I for select using (true);', pol.t||'_public_select', pol.t);
    end if;
    if not exists (
      select 1 from pg_policies where schemaname='public' and tablename=pol.t and policyname=pol.t||'_admin_write'
    ) then
      execute format('create policy %I on public.%I for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = ''admin'')) with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = ''admin''));', pol.t||'_admin_write', pol.t);
    end if;
  end loop;
end $$;

-- attach updated_at triggers to all tables that have the column
do $$
declare r record;
begin
  for r in select table_schema, table_name from information_schema.columns where column_name='updated_at' and table_schema='public'
  loop
    execute format('create trigger %I before update on %I.%I for each row execute function public.set_updated_at();', r.table_name||'_set_updated_at', r.table_schema, r.table_name);
    -- if exists will error; ignore errors
    exception when duplicate_object then continue;
  end loop;
end $$;

commit;


