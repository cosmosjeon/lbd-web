-- 0005_onboarding_policies.sql
-- Onboarding-related RLS policies and user_consents table

begin;

-- user_consents: store terms/privacy versions per user
create table if not exists public.user_consents (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  terms_version text,
  privacy_version text,
  created_at timestamptz default now()
);
create index if not exists user_consents_user_idx on public.user_consents(user_id);
alter table public.user_consents enable row level security;

-- policies: owner can insert/select; admin can select all
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='user_consents' and policyname='user_consents_owner_select'
  ) then
    create policy user_consents_owner_select on public.user_consents for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='user_consents' and policyname='user_consents_owner_insert'
  ) then
    create policy user_consents_owner_insert on public.user_consents for insert with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='user_consents' and policyname='user_consents_admin_select'
  ) then
    create policy user_consents_admin_select on public.user_consents for select using (
      exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
    );
  end if;
end $$;

-- user_identity_links RLS: enable + allow owner select/update; insert only if whitelist approved
alter table if exists public.user_identity_links enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='user_identity_links' and policyname='user_identity_links_owner_select'
  ) then
    create policy user_identity_links_owner_select on public.user_identity_links for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='user_identity_links' and policyname='user_identity_links_owner_update'
  ) then
    create policy user_identity_links_owner_update on public.user_identity_links for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='user_identity_links' and policyname='user_identity_links_owner_insert_if_whitelisted'
  ) then
    create policy user_identity_links_owner_insert_if_whitelisted on public.user_identity_links for insert with check (
      auth.uid() = user_id and exists (
        select 1 from public.member_whitelist mw where mw.phone_e164 = user_identity_links.phone_e164 and mw.status = 'approved'
      )
    );
  end if;
end $$;

-- profiles: allow self insert if missing (role defaults to member)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_self_insert'
  ) then
    create policy profiles_self_insert on public.profiles for insert with check (auth.uid() = user_id);
  end if;
end $$;

commit;


