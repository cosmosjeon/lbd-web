### LBD 웹사이트 TRD (v0.2)

- 문서 버전: v0.2
- 최종 업데이트: 2025-08-11
- 목적: PRD를 기반으로 한 기술 설계와 구현 세부사항 정의(아키텍처, DB, 보안, 마이그레이션, 배포)

---

### 1) 시스템 아키텍처

- 프런트엔드: Next.js(App Router) + TypeScript + Tailwind + shadcn/ui
- 백엔드/데이터: Supabase (Auth/DB/Storage/Edge Functions)
- 배포: Vercel(웹), Supabase(관리형 Postgres/Storage)
- 분석/관측: Vercel Analytics or Plausible, Sentry(선택)
- 이미지 최적화: Next.js Image + Supabase Storage

비고
- 서버 액션과 RSC를 기본으로 하되, 공개 캐시 가능한 데이터는 정적/ISR을 적극 활용
- 민감 데이터는 절대 클라이언트에 노출하지 않으며 서버 경유 API 또는 Edge Function 사용

디렉터리(초안)
- `app/` 라우팅, 서버 컴포넌트 우선
- `app/(marketing)/` 랜딩/공개 페이지
- `app/(app)/` 인증 후 페이지(세션 자료/프로필 등)
- `app/admin/` 운영진 CMS
- `lib/` 클라이언트/서버 유틸, Supabase 클라이언트, RBAC 헬퍼
- `components/` UI 컴포넌트
- `styles/` 전역 CSS, Tailwind 설정

---

### 2) 인증·권한

- 로그인 전략: 무료·간소화(Google OAuth → 전화번호 화이트리스트 매칭)
- 흐름
  1) Google 로그인 성공 → 전화번호(E.164) 입력 화면 표시
  2) 입력한 번호가 `member_whitelist`에 존재하면 `user_identity_links`에 매핑 저장 및 승인
  3) 이후 로그인은 Google만 사용. 로그인 훅에서 `user_identity_links` 존재 여부 확인
- 롤: guest(비로그인) / member / admin (역할은 `profiles.role`에 저장)
- 보호 라우팅: 서버 컴포넌트에서 세션 검사, 비로그인은 공개 페이지만 접근
- RLS: 모든 도메인 테이블에 정책 적용(아래 스키마 참고)

권한 매트릭스(요약)
- guest: 공개 리소스 조회만 가능(`/`, `/projects`, `/archive` 등)
- member: 멤버 전용 리소스 조회(`/resources`, `/info`, `/notices`), 쓰기 없음
- admin: CMS 전체 쓰기/임포트, 감사 로그 열람, 구독 리드 열람

---

### 3) 데이터베이스 스키마(요약)

핵심 테이블
- users, profiles
- attendance_sessions, attendance_records
- info_posts, resources
- recruitments (구글폼 URL 기반)
- projects, project_members, project_artifacts, project_milestones, project_awards
- legacy_posts, legacy_media (카페→웹 마이그레이션 보관)
- events, subscription_leads

성능/검색
- 전체 텍스트 검색: `tsvector` 컬럼(`title || content`) 생성, GIN 인덱스
- 프로젝트 필터: `cohort` 인덱스, 정렬 기본 `start_at DESC`

샘플 SQL(요약)
```sql
-- legacy_posts (카페 아카이브)
create table if not exists legacy_posts (
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
  imported_at timestamptz default now()
);

create index on legacy_posts (cohort);
create index on legacy_posts (posted_at desc);

-- RLS 예시
alter table legacy_posts enable row level security;
create policy legacy_posts_public on legacy_posts for select using (true);

-- events (캘린더)
create table if not exists events (
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
create index on events (start_at desc);
alter table events enable row level security;
create policy events_public on events for select using (is_public);
 -- admin만 쓰기 가능: profiles.is_admin을 기준으로 제한
 create policy events_admin_insert on events for insert with check (exists (
   select 1 from profiles p where p.user_id = auth.uid() and p.is_admin = true
 ));
 create policy events_admin_update on events for update using (exists (
   select 1 from profiles p where p.user_id = auth.uid() and p.is_admin = true
 ));

-- subscription_leads (리크루팅 구독)
create table if not exists subscription_leads (
  id bigserial primary key,
  email text,
  phone text,
  consent_marketing boolean default false,
  consent_privacy boolean default false,
  source text default 'landing',
  created_at timestamptz default now()
);
alter table subscription_leads enable row level security;
-- 누구나 구독 입력 가능(삽입), 읽기는 관리자만
create policy subs_insert_anyone on subscription_leads for insert with check (true);
create policy subs_admin_select on subscription_leads for select using (exists (
  select 1 from profiles p where p.user_id = auth.uid() and p.is_admin = true
));

-- notices (공지)
create table if not exists notices (
  id bigserial primary key,
  title text not null,
  content text not null,
  attachments text[] default '{}',
  pinned boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table notices enable row level security;
create policy notices_member_select on notices for select using (exists (
  select 1 from profiles p where p.user_id = auth.uid()
));
 create policy notices_admin_insert on notices for insert with check (exists (
  select 1 from profiles p where p.user_id = auth.uid() and p.is_admin = true
));
 create policy notices_admin_update on notices for update using (exists (
   select 1 from profiles p where p.user_id = auth.uid() and p.is_admin = true
 ));

 -- member_whitelist
 create table if not exists member_whitelist (
   phone_e164 text primary key,
   cohort text,
   is_admin boolean default false,
   status text default 'approved' check (status in ('approved','pending','revoked')),
   created_at timestamptz default now()
 );
 -- user_identity_links: phone↔google 매핑
 create table if not exists user_identity_links (
   user_id uuid references auth.users(id) on delete cascade,
   phone_e164 text,
   google_email text,
   phone_verified_at timestamptz,
   google_linked_at timestamptz,
   primary key (user_id)
 );
 -- 로그인 훅에서 화이트리스트 매칭 실패 시 승인 대기 처리
```

출석 로직 테이블 요약
- attendance_sessions: `start_at`, `late_after`, `close_at`, `code_hash`
- attendance_records: 체크 시각으로 상태 산정(present/late/absent)

출석 UX
- 기본: 세션별 QR(토큰 포함) → 로그인 상태면 즉시 체크
- 미로그인: 이메일 매직링크로 빠른 로그인 후 자동 체크
- 코드 입력 대안(네트워크 이슈 대비)

보안 고려
- 출석 코드/토큰은 해시로 저장하고, 제출값은 상수시간 비교로 검증
- QR 토큰은 세션 범위의 만료 시간 포함(JWT/서명 파라미터)하며 재사용 방지

---

### 4) RLS 정책 원칙

- 공개 데이터(프로젝트/legacy_posts/info_posts 중 공개)는 모든 사용자 select 허용
- member 전용(세션 자료 등)은 `auth.uid() = profiles.user_id` 기반 접근 제한
- admin/owner만 insert/update/delete 허용, 일부는 승인 워크플로로 제한

정책 샘플(요약)
- 공개 테이블(projects/legacy_posts): select true, write는 admin만
- 멤버 전용(resources/info_posts/notices): select는 `exists (select 1 from profiles where user_id = auth.uid())`
- subscription_leads: insert true, select는 admin만

---

### 5) API/서버 기능

- Edge Functions(옵션):
  - `/import/legacy` CSV 업로드→검증→삽입(관리자 전용, 서명 URL)
  - `/attendance/validate` 출석 코드 해시 검증(서명 필요)
- 웹 라우트 핸들러: 검색, 프로젝트 리스트/상세, 아카이브 리스트/상세

요청 유효성 검증
- 모든 서버 엔드포인트는 zod 기반 스키마 검증을 통과해야 함
- 공개 입력(subscribe 등)은 레이트 리밋(예: 10 req/min/IP)과 reCAPTCHA(또는 Turnstile) 적용 검토

---

### 6) 마이그레이션(카페→웹)

범위
- 보존 가치가 높은 게시물: 공지, 세션/활동 정리, 성과/보도, 연혁용 포스트
- 댓글/개인정보는 원칙적으로 수집하지 않음(요약/비식별)

절차
1) `docs/migration/category_map.csv` 작성(보드→cohort/mapped_type)
2) `docs/migration/naver_cafe_posts.csv`에 글 메타/본문/이미지 URL 기록
3) 관리자 업로드 화면에서 CSV 업로드 → Edge Function로 정제/삽입 → 작업 로그 남김
4) 이미지/파일은 Storage로 업로드 후 URL 갱신(원본 링크 출처 표기)
5) 표본 검수 후 전체 공개

SEO
- sitemap.xml 자동 생성, legacy 글도 포함
- canonical은 신규 도메인, 원문은 `원문보기` 링크로 유지

데이터 정제
- HTML Sanitizer(allowlist) 적용, 외부 이미지 프록시/스토리지 업로드 후 절대경로로 일원화
- 본문 내 PII(전화, 이메일 등) 정규식 탐지 후 마스킹 옵션 제공

---

### 7) 프런트엔드 구현 요약

페이지
- `/` 랜딩(히어로, 미션, 최근 소식 3건, Featured 프로젝트)
- `/projects` 카드 그리드(대표 이미지+이름, 필터: cohort)
- `/projects/[id]` 상세(임팩트 중심 섹션)
- `/archive` 카페 아카이브 목록(검색/필터: cohort)
- `/archive/[id]` 상세(본문 HTML Sanitized, 이미지 Lightbox)
- `/resources` 세션 자료(멤버 전용)
- `/info` 정보 페이지(멤버 전용)
- `/notices` 공지(멤버 전용)
- `/team` 운영진 소개(카드/필터)
- `/calendar` 캘린더(월간/주간, ICS)
- `/subscribe` 리크루팅 소식 구독 폼
- `/admin/*` CMS

컴포넌트
- Card, Badge(cohort), FilterBar, RichContent(HTML Sanitizer), Gallery, AdminTable, CSVImport

디자인 토큰/반응형
- 컨테이너 max 1200px, 12컬럼 그리드, 섹션 간격 80/48, 브레이크포인트(sm: 640, md: 768, lg: 1024, xl: 1280)

접근성/성능
- 이미지 lazy, LCP≤2.5s, 키보드 내비게이션, 명도 대비 준수

국제화/다국어(옵션)
- v1 한국어 고정, i18n 구조만 scaffold(추후 영문 추가 용이)

---

### 8) 배포/운영

- 환경변수: Supabase URL/Key, Sentry DSN(선택)
- 브랜치 전략: `main` 배포, `dev` 사전검증
- 백업: DB 일일 스냅샷, Storage 주 1회 점검

보안/운영
- 환경변수는 Vercel Project/Environment에 스코프, 미사용 빌드 로그에 노출 금지
- Edge Function/Route는 서명 검증 및 CORS 제한 적용

---

### 9) 품질 보증

- 단위 테스트(유틸/파서), 접근성 점검(axe), 링크체커
- PR 체크: 타입/린트/빌드, 프리뷰 배포

테스트 범위(샘플)
- CSV 파서/검증기(unit), 프로젝트 목록 서버 액션(integration), RLS 정책 쿼리 권한 확인(e2e-DB)

---

변경 이력
- v0.1(2025-08-10): 초안 작성

