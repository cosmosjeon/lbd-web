### LBD 웹사이트 배포 전 작업 목록 (TASKS) — v0.1

- 기준 문서: `PRD v0.2` (`./PRD.md`), `TRD v0.2` (`./TRD.md`), `DesignGuide v0.2` (`./DesignGuide.md`), `AdminCMS v0.2` (`./AdminCMS.md`)
- 범위: v1 공개 배포(마케팅/프로젝트 아카이브 공개 + 멤버 전용 기능 + Admin CMS 기본)
- 형식: 체크리스트 + 수용 기준(AC) + 의존성(Deps)

---

## 0. 공통/운영 준비

- [ ] 저장소/CI
  - [ ] GitHub 저장소 생성, 보호 브랜치 설정(`main` 보호, `dev` 사전검증)
  - [ ] PR 템플릿/라벨/코드오너 구성
  - [ ] CI: 타입/린트/빌드, a11y(axe) 스모크, 링크체커, 프리뷰 배포
  - AC
    - [ ] 모든 PR에 프리뷰 URL 자동 첨부, CI 녹색일 때만 머지 가능
    - [ ] a11y/링크체커가 실패 시 머지 차단

- [ ] 환경 변수/비밀값
  - [ ] Vercel: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, (선택) `SENTRY_DSN`
  - [ ] 로컬 `.env.local` 예시 및 보안 가이드 작성
  - AC
    - [ ] 로컬/프리뷰/프로덕션에서 각각 올바른 값 주입, 로그에 비밀값 노출 없음

- [ ] 보안/운영 가드레일
  - [ ] 레이트 리밋 미들웨어(공개 입력 경로), CORS 제한(서버/엣지)
  - [ ] 에러 로깅(Sentry) 및 4xx/5xx 알람(선택: Vercel + Slack)
  - AC
    - [ ] `/subscribe` 등 공개 입력 경로 10 req/min/IP 제한 확인
    - [ ] 에러 발생 시 Sentry에서 트레이스 수집 및 샘플링 동작

---

## 1. 프로젝트 스캐폴딩/디자인 토큰

- [ ] Next.js(App Router) + TS + Tailwind + shadcn/ui 초기화
  - [ ] Tailwind 테마: `DesignGuide v0.2` 색상/스크린/라운드 토큰 반영
  - [ ] 글로벌 레이아웃/헤더/푸터, 폰트(Pretendard/Inter) 설정
  - [ ] 공통 컴포넌트: Button, Input, Badge(cohort), Card, FilterBar, RichContent(HTML Sanitizer), Gallery
  - AC
    - [ ] 키보드 내비게이션/포커스 링 제공, 대비 AA 만족(샘플)
    - [ ] 헤더 투명→스크롤 시 단색 전환 동작
  - Deps: DesignGuide

---

## 2. Supabase 스키마/정책/시드

- [ ] DB 테이블 생성(TRD 샘플 SQL 기준)
  - [ ] `users`, `profiles(role 포함)`, `member_whitelist`, `user_identity_links`
  - [ ] `projects`, `project_members`, `project_artifacts`, `project_milestones`, `project_awards`
  - [ ] `legacy_posts`, `legacy_media`
  - [ ] `resources`, `info_posts`, `notices`, `events`, `subscription_leads`, `recruitments`
  - [ ] 인덱스/tsvector/기본 정렬 컬럼 생성
- [ ] RLS 정책 적용
  - [ ] 공개: `projects`, `legacy_posts` → select true, write admin only
  - [ ] 멤버 전용: `resources`, `info_posts`, `notices` → `exists(profiles.user_id = auth.uid())`
  - [ ] 구독: `subscription_leads` → insert anyone, select admin only
  - [ ] 이벤트: admin만 insert/update
- [ ] 샘플 데이터/시드 스크립트 작성
  - [ ] 최소 3개 프로젝트 + 1개 Featured
  - [ ] 예시 `events`, `resources` 2~3건
  - AC
    - [ ] 비로그인으로 `projects`/`legacy_posts` 조회 가능, `resources`는 403
    - [ ] admin 계정으로 `events`/`notices` 쓰기 가능
  - Deps: TRD

---

## 3. 인증/온보딩(무료·간소화)

- [ ] Google OAuth 연동(Supabase Auth)
- [ ] 최초 로그인 시 전화번호(E.164) 수집/검증 UI
  - [ ] `member_whitelist` 매칭 성공 시 `user_identity_links` 생성/승인
  - [ ] 미허용 번호는 승인 대기 화면
- [ ] 개인정보/이용약관 동의 저장(버전/타임스탬프)
- [ ] 보호 라우팅: 서버 컴포넌트에서 세션 검사, `profiles.role` 기반 접근 제한
- [ ] Admin: 화이트리스트 업로드(CSV)
- AC
  - [ ] 화이트리스트 등록 후 재로그인 없이 다음 세션부터 접근 가능(캐시 무효화)
  - [ ] 동의 이력 CSV 내보내기 가능
  - [ ] 로그인 실패/권한 부족 메시지 보안 친화적
  - Deps: Supabase 스키마

---

## 4. 랜딩/마케팅 페이지(`/`)

- [ ] 섹션: 히어로, 미션/가치, 최근 소식 3건, Featured 프로젝트, 파트너/CTA
- [ ] OG/SEO 메타, 구조화 데이터(선택)
- [ ] 성능 튜닝: 이미지 최적화, critical CSS, 프리로드/프리커넥트
- AC
  - [ ] 95p LCP ≤ 2.5s, Lighthouse Performance ≥ 90(모바일)
  - [ ] CTA 키보드 포커스/활성화 동작, 초기 뷰포트 레이아웃 깨짐 없음
  - Deps: Projects(Featured), DesignGuide

---

## 5. 프로젝트 아카이브(`/projects`, `/projects/[id]`)

- [ ] 리스트: 카드 그리드(대표 이미지+이름), 필터(cohort), 정렬 최신
- [ ] 상세: 임팩트 중심 섹션(PRD 100번대 필드)
- [ ] Admin CSV 임포트: 시뮬레이션/중복 검증/롤백/결과 로그 다운로드
- [ ] Featured 토글 → 랜딩 반영
- AC
  - [ ] CSV 시뮬레이션에서 행별 성공/오류/경고 표시, 오류만 필터/다운로드 가능
  - [ ] 상세 페이지에서 링크(데모/레포/데크/보도) 안전 열기 처리
  - [ ] Featured 변경 시 즉시 랜딩 반영, 16:9 권장 경고 표시
  - Deps: Admin CMS, Supabase Storage(커버)

---

## 6. 카페 아카이브(`/archive`, `/archive/[id]`)

- [ ] CSV 업로더(Admin): `category_map.csv`, `naver_cafe_posts.csv` 입력 → 시뮬레이션 → Edge Function 정제/삽입
- [ ] 리스트/상세: HTML Sanitizer, 이미지 라이트박스, 검색/필터(cohort)
- [ ] 이미지/파일: Storage 업로드 후 URL 갱신(원문 링크 출처 표기)
- [ ] QA: 표본 검수(랜덤 5%)·링크체크·썸네일 확인
- [ ] SEO: sitemap 포함, canonical 신규 도메인, `원문보기` 링크 유지
- AC
  - [ ] 불러온 본문에서 스크립트/인라인 이벤트 제거(allowlist)
  - [ ] PII(전화/이메일) 탐지 시 마스킹 옵션 제공
  - [ ] Edge Function 작업 로그/실패 행 재시도 흐름 제공
  - Deps: Edge Functions, Storage

---

## 7. 세션 자료(`/resources`) — 멤버 전용

- [ ] 주차/기수 체계, 태그/검색
- [ ] 파일 업로드(슬라이드/문서/이미지/링크): pre-signed URL, 확장자 화이트리스트, 100MB 제한
- [ ] 외부 링크 `https` 강제, 오픈리다이렉션 방지
- AC
  - [ ] 비로그인은 접근 불가, 멤버만 열람
  - [ ] 업로드 실패 시 재시도/복구 안내
  - Deps: Auth, Storage

---

## 8. 정보 페이지(`/info`) — 멤버 전용

- [ ] 카테고리/태그/정렬(최신/마감임박/인기)
- [ ] 제보→승인→게시 워크플로
- [ ] 마감일 배지/자동 정렬/만료 시 비표시 또는 보관
- AC
  - [ ] 승인 전 미리보기 가능, 게시 전/후 버전 비교
  - Deps: Admin CMS, RLS

---

## 9. 공지(`/notices`) — 멤버 전용

- [ ] 작성/수정/미리보기/예약 게시/고정(핀) 기능
- [ ] 버전 이력/되돌리기
- AC
  - [ ] 고정 공지 상단 최대 3개, 예약 시간 도달 시 자동 게시
  - Deps: Admin CMS, RLS

---

## 10. 출석

- [ ] 세션 생성(반복), 코드 6자리/QR(토큰) 발급(해시 저장)
- [ ] 체크 로직: present/late/absent(세션별 지각/마감 기준), 비고 메모
- [ ] 관리자 보정/사유 필수, 감사 로그 기록
- [ ] 월별/기수별 통계, 리더보드, CSV 익스포트
- [ ] 보안: 상수시간 비교, QR 토큰 만료/재사용 방지
- AC
  - [ ] 100명 동시 체크(95p) 응답 ≤ 5s, 상태 일관
  - [ ] 기준 변경 시 판정 재계산 일관성 보장
  - Deps: Auth, RLS, Edge Function(`/attendance/validate`)

---

## 11. 캘린더(`/calendar`)

- [ ] 월간/주간 뷰, 이벤트 타입 색상 규칙
- [ ] ICS 피드 자동 생성(공개 이벤트)
- [ ] (옵션) 구글 캘린더 임베드 토글
- AC
  - [ ] ICS를 외부 캘린더에 구독 시 정상 표시(UTC/타임존 검증)
  - Deps: Events 테이블

---

## 12. 운영진 소개(`/team`)

- [ ] 카드(사진/이름/직책/담당/링크), 필터(파트/기수)
- [ ] (선택) 상세 프로필
- AC
  - [ ] 링크는 새창 안전(opener 제거), 이미지 대체텍스트 제공

---

## 13. 리크루팅 구독(`/subscribe`)

- [ ] 이메일/전화/동의 체크박스 폼, 더블 옵트인(선택)
- [ ] `subscription_leads` 삽입 RLS 정책(누구나 insert)
- [ ] 레이트 리밋/봇 방지(reCAPTCHA/Turnstile 검토)
- [ ] 해지 링크/프로세스 명시
- AC
  - [ ] 10 req/min/IP 제한 동작, 관리자만 리스트 열람/CSV export 가능
  - Deps: RLS

---

## 14. Admin CMS

- [ ] 대시보드: 오늘/이번주 일정, 미승인 큐, 출석 이상치, 구독 현황
  - AC: 핵심 카드 로딩 ≤ 1s(캐시), 링크로 딥링크 이동 가능
- [ ] 공지: 작성/예약/핀/미리보기, 버전 이력/되돌리기
  - AC: 게시물 상태 전환 시 감사 로그 기록, 예약 정확성
- [ ] 정보 페이지: 제보 승인/편집/게시, 외부 링크 검증
  - AC: 마감임박 정렬/배지 정확
- [ ] 출석: 세션 생성/QR·코드 발급/보정/통계/CSV
  - AC: 보정 시 사유 필수, 이전/이후 diff 감사 로그
- [ ] 세션 자료: 주차/기수 관리, 업로드, 권한
  - AC: 확장자/용량 검사, 업로드 실패 복구 안내
- [ ] 프로젝트 아카이브: 목록/상세 편집, 멤버/마일스톤/아티팩트, CSV 임포트
  - AC: 시뮬레이션/중복 검출/롤백, 결과 리포트 다운로드
- [ ] 아카이브(카페): CSV 업로드, 시뮬, 매핑/삽입, 로그
  - AC: 실패 행 재시도, 링크체커 통과
- [ ] 캘린더: CRUD/ICS 내보내기/색상 규칙
  - AC: ICS 검증 성공
- [ ] 운영진 소개: 카드 편집/정렬
  - AC: 필수 필드 검증
- [ ] 멤버 & 화이트리스트: 업로드/편집, Admin 토글, 승인/회수
  - AC: 배치 업로드 1분 내 반영
- [ ] 구독 리드: 열람/CSV export
  - AC: 비관리자 접근 차단
- [ ] 설정: 브랜드/로고, 링크, 개인정보/약관 버전, 스토리지 버킷, 관리자 초대
  - AC: 변경 즉시 프론트 반영(캐시 무효화)
- [ ] 감사 로그: actor/action/entity/diff/ip/ua/ts 기록/필터/CSV
  - AC: 보존 ≥ 180일, 엔티티별 diff 확인 가능
- [ ] 보안/세션: CMS 세션 타임아웃(비활성 30분), 2중 보호(서버액션+RLS)
  - AC: 타임아웃 후 동작 재검증

---

## 15. Edge Functions/서버 라우트

- [ ] `/import/legacy`: CSV 업로드→검증→삽입, 작업 로그
  - [ ] 시뮬 단계에서 오류 행 추출/다운로드
- [ ] `/attendance/validate`: 출석 코드 해시 검증, 서명 필요
- [ ] 서버 라우트: 검색/프로젝트 리스트·상세/아카이브 리스트·상세
- AC
  - [ ] zod 기반 입력 검증, 실패 시 400/422
  - [ ] 인증/서명 검증 실패 시 401/403, CORS 제한

---

## 16. 접근성/성능/SEO

- [ ] a11y: 스킵 링크, 포커스 스타일, 폼 라벨/에러 연결, 모션 감소 준수
- [ ] 성능: 이미지 lazy, 폰트 최적화, 캐시/ISR, preconnect
- [ ] SEO: 메타/OG, sitemap(legacy 포함), robots.txt, canonical
- AC
  - [ ] Lighthouse 모바일 Performance/SEO/Best Practices ≥ 90, CLS ≤ 0.1
  - [ ] axe 스캔 무오류(크리티컬)

---

## 17. 분석/관측

- [ ] Vercel Analytics 또는 Plausible 설치
- [ ] Sentry(선택) 연동, 릴리즈/소스맵 업로드
- [ ] 핵심 이벤트: CTA 클릭/프로젝트 상세 뷰/데모/레포/데크 클릭
- AC
  - [ ] 대시보드에서 전환 퍼널 확인 가능

---

## 18. 배포/도메인

- [ ] Vercel 프로젝트/환경 구성, 프리뷰/프로덕션 분리
- [ ] 커스텀 도메인 연결, SSL, www/non-www 리디렉션
- [ ] Canonical/환경 변수 `NEXT_PUBLIC_SITE_URL` 확인
- AC
  - [ ] https 접속, sitemap/robots 정상 노출

---

## 19. 정책/법무/개인정보

- [ ] 개인정보 처리방침/이용약관 페이지, 동의 버전 기록
- [ ] 구독 해지 프로세스/링크
- AC
  - [ ] 동의 이력 CSV 제공, 해지 처리 SLA 문서화(내부)

---

## 20. 백업/롤백/운영 가이드

- [ ] DB 일일 스냅샷, Storage 주간 점검
- [ ] 롤백 가이드/체크리스트(버전 태그/DB 마이그레이션 되돌리기)
- [ ] 장애 공지 템플릿/채널(노션/슬랙) 정의
- AC
  - [ ] 복구 리허설 1회, RTO/RPO 기록

---

## 21. 콘텐츠 준비(런칭 시드)

- [ ] Featured 프로젝트 1~3개(커버/요약/링크 완비)
- [ ] 운영진 소개 카드(사진/직책/담당/링크)
- [ ] 캘린더(이달 세션/행사 3건+)
- [ ] 세션 자료(최근 2주) 업로드
- [ ] 정보 페이지 5건(기사/공고/공모전/행사 믹스)
- [ ] 공지 1~2건(고정 1)
- AC
  - [ ] 랜딩/프로젝트/팀/캘린더/리소스/정보/공지 페이지가 빈 상태 없이 초판 구성

---

## 22. 최종 점검 체크리스트(DoD)

- [ ] PRD 수용 기준 충족(섹션별 AC 체킹 완료)
- [ ] TRD RLS/정책/보안 가드레일 적용 검증
- [ ] a11y/성능/SEO 목표 달성 리포트 캡처 보관
- [ ] Admin CMS 핵심 플로우 데모 영상 캡처(운영 인수인계)
- [ ] 도메인/SSL/Canonical/사이트맵/로보츠 최종 확인
- [ ] 백업/롤백/장애 공지 절차 문서 링크 노션에 기록

---

## 부록 A. 의존성 맵(요약)

- 랜딩 Featured → Projects/Featured
- 프로젝트 상세/리스트 → Projects/Artifacts/Members/… + Storage
- 아카이브 → Legacy + Edge Functions + Storage
- 리소스 → Resources + Storage + Auth
- 정보/공지 → Info/Notices + RLS + Admin CMS
- 출석 → Attendance + Edge Function(`/attendance/validate`) + Audit
- 캘린더/ICS → Events
- 구독 → subscription_leads + Rate limit

---

## 부록 B. 설치 의존성(초안)

- next, react, react-dom, typescript, tailwindcss, postcss, autoprefixer
- @supabase/supabase-js, @supabase/auth-helpers-nextjs
- zod, react-hook-form, @tanstack/react-table
- shadcn/ui, lucide-react
- sanitize-html(또는 DOMPurify with isomorphic wrapper)
- next-seo(선택), @sentry/nextjs(선택)


