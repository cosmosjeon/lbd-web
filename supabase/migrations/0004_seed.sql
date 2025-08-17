-- 0004_seed.sql
-- Seed sample data for projects, events, info_posts, resources (idempotent)

begin;

-- projects
insert into public.projects (slug, name, summary, cohort, featured, cover_url)
values
  ('alpha', 'Alpha Project', '임팩트 중심 예시 프로젝트 Alpha', '8기', true, null),
  ('beta', 'Beta Project', '예시 프로젝트 Beta', '8기', false, null),
  ('gamma', 'Gamma Project', '예시 프로젝트 Gamma', '7기', false, null)
on conflict (slug) do nothing;

-- project_members (attach to alpha/beta/gamma)
insert into public.project_members (project_id, name, role)
select p.id, m.name, m.role
from (
  select 'alpha' slug, '홍길동' name, 'PM' role union all
  select 'alpha', '김개발', 'FE' union all
  select 'beta', '이백엔드', 'BE' union all
  select 'gamma', '박디자이너', 'Design'
) m
join public.projects p on p.slug = m.slug
on conflict do nothing;

-- project_artifacts (links)
insert into public.project_artifacts (project_id, kind, url, title)
select p.id, a.kind, a.url, a.title
from (
  select 'alpha' slug, 'repo' kind, 'https://github.com/example/alpha' url, 'GitHub' title union all
  select 'alpha', 'demo', 'https://example.com/alpha', 'Demo' union all
  select 'beta', 'repo', 'https://github.com/example/beta', 'GitHub'
) a
join public.projects p on p.slug = a.slug
on conflict do nothing;

-- events
insert into public.events (title, description, type, start_at, end_at, location, is_public)
values
  ('정기 세션', '8기 주간 세션', 'session', now() + interval '7 days', null, 'HQ', true),
  ('워크숍', '프론트엔드 성능 최적화', 'workshop', now() + interval '14 days', null, 'HQ', true)
on conflict do nothing;

-- info_posts
insert into public.info_posts (title, content, tags, expires_at)
values
  ('공모전 안내', '유의사항과 링크를 확인하세요', '{공모전,기회}', now() + interval '30 days'),
  ('행사 소식', '유익한 행사 안내입니다', '{행사}', now() + interval '10 days')
on conflict do nothing;

-- resources
insert into public.resources (title, description, url, cohort, week)
values
  ('세션 슬라이드', '1주차 슬라이드', 'https://example.com/slide1', '8기', 1),
  ('실습 자료', '2주차 실습', 'https://example.com/lab2', '8기', 2)
on conflict do nothing;

commit;


