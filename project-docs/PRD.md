### LBD 웹사이트 PRD (v0.2)

- 문서 버전: v0.2
- 최종 업데이트: 2025-08-11
- 작성 목적: LBD(“Learning by Doing”) 동아리 공식 웹사이트의 요구사항을 정의하고, IA/데이터 모델/운영 흐름을 명확히 하여 일관된 구현을 가능하게 함

---

### 1) 프로젝트 개요

- 목표: 사회문제해결 창업동아리 LBD의 모집/활동/성과를 한곳에서 관리·공개하고, 부원/운영진/알럼나이의 참여도를 높이는 허브 구축
- 타깃 사용자: 방문자(지원자 포함), 현역 부원, 알럼나이, 운영진(비개발), 개발 운영자
- 참고 레퍼런스: `https://mash-up.kr/`, `https://kucc.co.kr/`, `https://www.yapp.co.kr/`, `https://www.sopt.org/`, `https://umc.makeus.in/`

---

### 2) 사용자 롤과 권한

- 방문자: 랜딩·프로젝트 아카이브 열람, 리크루팅 소식 구독(이메일/전화)
- 멤버: 출석 체크, 세션 자료 열람
- 운영진: CMS(게시/승인/편집), 출석/회원 초대·권한 관리, 공지/콘텐츠 관리

권한 원칙: 최소 권한, 승인 workflow, 모든 쓰기행위는 추적(작성자/수정자/시간) 및 되돌리기 가능(소프트 삭제)

---

### 3) IA(Information Architecture) / 주요 페이지

- 랜딩 페이지: 미션/가치, 섹터, 활동 소개, 사진/성과, 파트너, CTA(지원/커뮤니티)
- 로그인/회원가입: Google 기반 + 전화번호(E.164) 매칭, 개인정보 동의, 약관/프라이버시
- 출석: 주간 세션(매주 수요일 18:45) 출석·지각·결석 기록, 통계/리더보드, 관리자 보정
- 알럼나이/소감: 기수/팀/섹터별 필터, 스토리(텍스트/이미지/링크), 운영진 승인제
- 동아리 지원: 모집 공고, 타임라인, 지원서(구글폼 링크로 넘어감), 상태 안내(서류/면접/합격) (1차는 서류, 2차는 면접 이후 최종 발표)
- 운영진용 관리: 대시보드, 콘텐츠 CMS(정보/알럼나이/세션자료), 출석/지원/유저 관리
- 세션 자료: 주차별 자료(슬라이드/링크/과제), 검색/태그, 접근 제한(부원 전용)
- 정보 페이지: 기사/공고/공모전/행사 등 큐레이션, 카테고리/태그/검색, 제보→승인→게시
- 공지사항: 동아리 내부 공지(멤버 전용)
- 프로젝트 아카이브: 지난 기수 프로젝트 목록(카드: 대표 이미지+프로젝트명), 클릭 시 상세. 필터는 기수만 제공
- 운영진 소개: 리더십/역할/사진/링크(레퍼런스: [SOPT About](https://www.sopt.org/about))
- 캘린더: 월간 일정(세션/행사/모집 타임라인) 공개, ICS 내보내기
- 리크루팅 소식 구독: 이메일/전화 입력 폼, 더블 옵트인 안내

- 아카이브(카페→웹): 네이버 카페(`[https://cafe.naver.com/learnbydo]`)의 연혁/기수별 게시물 중 주요 자산(공지/활동정리/세션노트/성과물)을 신규 웹으로 이전


---

### 4) 기능 요구사항(요약 · 핵심 수용기준)

- 랜딩
  - 핵심 소개 섹션, 최근 소식 3건, CTA 버튼(지원/커뮤니티)
  - 성능: LCP ≤ 2.5s, SEO 메타/OG 태그, 모바일 퍼스트
  - 수용 기준
    - 히어로/미션/최근 소식(최신 3건)/Featured 프로젝트 섹션이 초기 뷰포트에서 시각적으로 깨짐 없이 노출된다
    - 95퍼센타일 LCP ≤ 2.5s(Vercel Analytics 기준), 모바일 Lighthouse Performance ≥ 90
    - 모든 주요 CTA가 키보드(Tab/Shift+Tab)로 포커스 및 활성화 가능하고 시각적 포커스 링을 제공한다

- 인증(무료·간소화: Google만 + 전화번호 화이트리스트 매칭)
  - 소셜 로그인은 Google만 지원(카카오 제외)
  - 운영진이 사전 업로드한 `전화번호(E.164)` 화이트리스트에 포함된 사용자만 승인됨
  - 최초 로그인 시: Google 로그인 → 전화번호 입력 → 화이트리스트 매칭 성공 시 계정 연동 및 승인
  - 이후 로그인: Google만으로 접근 가능
  - 미허용 번호: 승인 대기 화면(회원 인증 요청 UX)
  - 개인정보 동의 기록(버전/타임스탬프)
  - 수용 기준
    - 화이트리스트에 없는 번호는 승인 대기 화면으로 전환되고, 관리자가 승인 시 재로그인 없이 다음 세션부터 접근 가능하다(캐시 무효화 포함)
    - 개인정보·이용약관 동의 버전/시간이 개별 사용자 단위로 저장되며, CSV로 내보내기 가능하다
    - 로그인 실패/허용 범위 밖 시 명확한 오류 메시지(보안상 과도한 정보 노출 금지)를 표시한다

- 출석
  - 세션 생성(주간 반복). QR(세션 토큰 포함) 기본 + 코드 입력 대안
  - 흐름: QR 스캔 → 로그인 상태면 즉시 체크, 미로그인 시 이메일 매직링크로 빠른 로그인 후 자동 체크
  - 상태: 출석/지각/결석, 비고 메모. 지각·마감 기준 시각 설정 가능(예: 19:00/19:15)
  - 관리자 일괄 보정/수동 입력, 사유/첨부(옵션)
  - 월별/기수별 통계, 리더보드(부원 전용)
  - 수용 기준
    - 세션별 QR/코드로 100명 동시 체크 시에도 5초 이내 응답(95p)으로 상태가 반영된다
    - 지각·마감 기준은 세션별로 설정할 수 있고, 기준 변경 시 판정 로직이 일관되게 적용된다
    - 관리자 보정 시 사유가 필수이며, 감사 로그에 이전/이후 값이 남는다

- 알럼나이/소감
  - 카드 리스트, 필터(기수/팀/섹터/연도), 상세(스토리/링크)
  - 제출→운영진 승인→게시, 신고/비공개 처리
  - 수용 기준
    - 제출된 항목은 승인 대기 큐에서 편집/미리보기 가능하며, 게시 전/후 버전 비교가 가능하다

- 동아리 지원
  - 모집 공고/타임라인, 구글폼 링크/임베드
  - 상태 안내 섹션(1차 서류→2차 면접→최종 발표), FAQ
  - 운영진: 공고 CRUD, 폼 URL/기간 설정 (평가/합격 통지는 v2 내재화 대상)
  - 수용 기준
    - 공고는 시작/종료 시간 기반으로 자동 노출/비노출 전환된다
    - 폼 URL 검증(https, 허용 도메인만) 및 임베드 실패 시 안전한 대체 경로 제공

- 운영진 관리
  - 대시보드: 오늘/이번주 일정, 미승인 항목, 출석 이상치, 지원 현황
  - CMS: 정보 게시물/세션 자료/알럼나이 승인·편집·게시/비공개
  - 출석 관리: 세션 생성/코드 발급/보정, 통계 엑스포트(CSV)
  - 지원 관리: 모집 공고 CRUD, 폼 URL/기간 설정, 외부 스프레드시트 링크 관리 (평가/상태 변경은 v2)
  - 유저 관리: 롤 부여, 비활성화, 개인정보 열람 요청 대응(내보내기)
  - 수용 기준
    - 목록형 뷰는 검색/필터/정렬/페이지네이션을 제공하며, 다중 선택 일괄 작업이 가능하다
    - CSV 내보내기는 현재 필터 조건을 반영하고, 컬럼 헤더는 문서 명세와 일치한다

- 세션 자료
  - 주차/기수 체계, 파일 업로드(슬라이드/문서/이미지/링크), 태그, 검색
  - 접근 제어: 부원만 열람, 링크 외부 공유 차단 옵션
  - 수용 기준
    - 파일은 100MB 이하 업로드 제한, 확장자 화이트리스트 적용, 업로드 실패 시 재시도/복구 안내 제공
    - 외부 링크는 `https`만 허용, URL 프리뷰 안전 처리(오픈리다이렉션 방지)

- 정보 페이지
  - 멤버 전용(로그인 필요)
  - 카테고리(기사/공고/공모전/행사 등), 태그, 정렬(최신/마감임박/인기)
  - 제보 폼→승인→게시, 출처/마감일/요약/링크 필수
  - 수용 기준
    - 마감일 기준 자동 정렬/배지 표시, 마감 경과 시 자동 비표시 또는 별도 섹션 이동

- 공지사항
  - 멤버 전용(로그인 필요)
  - 중요 공지, 일정 변경, 과제/제출 안내 등
  - 수용 기준
    - 예약 게시/고정(핀) 기능 제공, 고정 공지는 상단에 최대 3개까지 노출

- 프로젝트 아카이브
  - 목록: 카드 그리드(대표 이미지+프로젝트명만), 필터: 기수만, 정렬: 최신 우선
  - 상세(임팩트 중심): 배경/문제정의, 대상/수혜자, 접근/해결전략, 혁신 포인트, 파트너십, 주요 결과/임팩트 지표, 스크린샷/데모/레포/발표자료, 타임라인(마일스톤), 수상/보도자료, 배운점과 다음 단계, 팀 구성(역할)
  - 권한: 생성·편집은 운영진 전용(승인 후 게시), 변경 이력 관리, 대표 커버 이미지 설정, 추천(Featured) 지정
  - 임포트: CSV 템플릿 기반 일괄 업로드(운영진 전용), 시뮬레이션/중복 검증/롤백
  - 수용 기준
    - CSV 임포트 시 시뮬레이션 화면에서 행별 성공/오류/경고를 표시하고, 오류만 필터링이 가능하다
    - Featured 지정 시 랜딩의 Featured 섹션에 즉시 반영되고, 표준 이미지 비율(16:9) 권장 경고 제공

- 운영진 소개
  - 운영진 카드(사진/이름/직책/담당/링크), 필터(파트/기수)
  - 세부 프로필(선택): 바이오/임팩트 사례/링크

- 캘린더
  - 월간/주간 뷰, 이벤트 타입(세션/워크숍/행사/모집 일정)
  - ICS 내보내기, 구글 캘린더 임베드(옵션)

- 리크루팅 소식 구독
  - 이메일/전화 입력, 개인정보 동의 체크박스, 더블 옵트인(이메일 확인) 권장
  - 로그인 불필요, 구독 해지 링크 제공

---

### 5) 비기능 요구사항(정량 목표)

- 접근성: WCAG 2.1 AA 충족, 키보드 내비게이션 100% 커버, 스킵 링크/포커스 스타일 제공
- 보안: RBAC+RLS 전면 적용, XSS/CSRF 방지, 공개 입력 엔드포인트에 레이트 리밋(예: 10 req/min/IP), 감사 로그 180일 보존
- 개인정보: 최소 수집 원칙, 리드(Subscribe) 24개월 보존 후 파기, 사용자 데이터 내보내기/삭제 요청 14일 내 처리
- 성능/SEO: 95p LCP ≤ 2.5s, CLS ≤ 0.1, SEO/Lighthouse ≥ 90, Open Graph/구조화 데이터 적용
- 운영: DB 일일 스냅샷, 스토리지 주 1회 점검, 롤백 가이드/체크리스트, 장애 공지 템플릿/채널 사전 정의

---

### 6) 제안 기술스택(초안)

- 프런트엔드: Next.js(App Router) + TypeScript + Tailwind + shadcn/ui
- 인증/백엔드: Supabase(Auth/DB/Storage/RLS)
- 배포/인프라: Vercel(프런트), Supabase(관리형 Postgres)
- 관측/분석: Vercel Analytics or Plausible, Sentry(옵션)

---

### 7) 데이터 모델(정리)

- users: uid, email, name, joined_at
- profiles: user_id(FK, auth.users), cohort, title, bio, links, avatar_url, is_active, role(member/admin), is_executive(boolean)
- attendance_sessions: id, title, date(수요일), start_at, late_after, close_at, code(hashed), is_open
- attendance_records: id, session_id(FK), user_id(FK), status(present/late/absent), note, created_at, adjusted_by(FK), adjusted_reason
- alumni_stories: id, user_id(FK), cohort, title, content, links[], images[], status(draft/pending/approved/rejected), published_at
- info_posts: id, type(article/notice/contest/event), title, summary, url, source, deadline_at, tags[], status(pending/approved), created_by
- resources: id, cohort, week_no, title, description, files[], links[], tags[], visibility(member-only/public)
- recruitments: id, title, term, open_at, close_at, description, form_url, status(draft/open/closed), visibility
 - events: id, title, description, type(session/workshop/event/recruiting), start_at, end_at, location, is_public(boolean)
 - subscription_leads: id, email, phone, consent_marketing(boolean), consent_privacy(boolean), source(landing), created_at
- notices: id, title, content, attachments[], pinned(boolean), published_at, visibility(member-only)
- member_whitelist: phone_e164 unique, cohort, is_admin(boolean), status(approved/pending/revoked)
- user_identity_links: user_id(FK), phone_e164, google_email, phone_verified_at, google_linked_at

v2 내재화 후보(현재는 구글폼 사용):
- applications, application_reviews (보류)

모든 테이블: created_at, updated_at, soft_deleted_at(옵션), 작성/수정 주체 기록, 적절한 인덱스 및 RLS 정책 적용

용어 정의
- cohort: 활동 기수(예: 8기)
- session: 정기 세션 모임 단위(통상 수요일)

프로젝트 아카이브 관련 테이블(초안)

- projects: id, title, cohort, summary, cover_image_url, 
            problem, context, beneficiaries, approach, innovation,
            partnerships[], outcomes, metrics, lessons, next_steps,
            links{site,repo,deck,demo,press[]}, status(planned/active/completed),
            start_at, end_at, featured(boolean), view_count
- project_members: id, project_id(FK), user_id(FK, nullable for 외부 멤버), name, role(team_lead/member/mentor), responsibility, joined_at, left_at
- project_artifacts: id, project_id(FK), type(slide/demo/video/report/asset), title, description, file_url or storage_path, uploaded_by(FK), created_at
- project_milestones: id, project_id(FK), title, description, due_date, achieved_at
- project_awards: id, project_id(FK), name, organization, awarded_at, url

인덱스 권장: projects(cohort, status), project_members(project_id), project_artifacts(project_id, type)

CSV 템플릿: `lbd-web/docs/templates/` 디렉터리의 `projects.csv`, `project_members.csv`, `project_artifacts.csv` 사용

카페→웹 마이그레이션(초안 스키마)

- legacy_posts: id, source("naver_cafe"), source_url, source_board, source_id, title, author_name, posted_at, content_html_sanitized, images[], attachments[], cohort, mapped_type(notice/session_note/activity/press/other), status(published/hidden), imported_at
- legacy_media: id, legacy_post_id(FK), media_url, media_type(image/file), width, height, alt

매핑 원칙: 카페의 보드/폴더를 cohort·mapped_type으로 매핑해 검색 가능하게 하고, 필요 시 `resources`/`info_posts`/`projects` 등 정규화된 도메인으로 승격 복제

---

### 8) 주요 흐름

- 온보딩(무료 방식: Google → 전화번호 매칭):
  1) Google 로그인
  2) 전화번호(E.164) 입력 → 화이트리스트 매칭 성공 시 승인 및 계정 연동
  3) 이후에는 Google로 즉시 로그인

- 출석 체크(코드 방식 예):
  1) 운영진이 세션 생성 → 출석코드 6자리 자동 생성(해시 저장) → 시작 시점에 코드 공개
  2) 부원이 코드 입력(또는 QR) → 시간대에 따라 출석/지각 자동 판정
  3) 마감 이후 입력 불가, 운영진은 사유 첨부로 보정 가능

- 지원 접수(구글폼 연동):
  1) 모집 공고 열림 → 지원자는 구글폼에서 제출 → 수정·알림은 폼/시트 정책 따름
  2) 운영진은 스프레드시트에서 평가/정리 → 사이트에는 공고/타임라인/FAQ/진행상태만 표기

- 콘텐츠 게시:
  1) 제보/초안 작성 → 운영진 승인 → 게시 → 수정 시 버전 관리/롤백

- 프로젝트 아카이브 운영:
  1) 운영진이 CSV 템플릿에 과거/신규 프로젝트 데이터를 정리 → 관리 페이지에서 일괄 임포트(시뮬레이션/검증)
  2) 생성/편집은 운영진 전용. 승인 후 게시 → 필요 시 아티팩트/마일스톤 추가
  3) 추천(Featured) 지정 시 랜딩 노출, 커버 이미지/요약 최적화

- 리크루팅 소식 구독:
  1) 방문자가 이메일/전화 입력→동의 체크→제출 →(선택) 이메일 확인→확정
  2) 운영진은 관리자에서 구독자 리스트 열람/내보내기(CSV)

- 캘린더 운영:
  1) 운영진이 `events` 등록→공개 → ICS 피드 자동 생성
  2) 세션/모집일정 등은 색상으로 구분 표시

- 카페→웹 마이그레이션:
  1) 인벤토리: 카페 보드/폴더 구조 인덱싱 → `category_map.csv` 초안 작성
  2) 추출: 수동/스크립트로 HTML, 이미지 URL, 메타데이터 수집 → `naver_cafe_posts.csv`로 정리
  3) 정제: HTML Sanitizer 통과, 이미지 파일은 스토리지로 업로드(원본 URL 보존)
  4) 적재: `legacy_posts`/`legacy_media` 삽입 → 검색 인덱스 생성(tsvector)
  5) 매핑: 중요 글은 도메인 테이블(`resources`/`info_posts`/`projects`)로 승격 복제 후 링크 연결
  6) QA: 표본 검수(랜덤 5%)·링크 체킹·썸네일 확인 → 승인 후 공개
  7) SEO: 신규 사이트 내 canonical, sitemap 등록. 카페 원문 링크는 출처로 표기

---

### 9) 운영진 CMS(요구 뷰)

- 대시보드, 출석(세션/코드/보정/통계), 지원(필터/평가/일괄처리), 콘텐츠(정보/세션자료/알럼나이 승인)
- 사용성: 검색/필터/정렬/페이지네이션, 키보드 단축키(선택), CSV 내보내기
- Admin CMS 상세 사양은 `lbd-web/project-docs/AdminCMS.md` 참조(비개발자 친화 SaaS UX)

프로젝트 아카이브 관리(추가)
- 프로젝트 목록/상세 편집, 멤버 관리, 아티팩트 업로드, 마일스톤/수상 기록, 일괄 임포트/엑스포트, Featured 토글

---

### 10) 측정 지표

- 방문자→지원 전환율(목표: 2%+), 세션 참여율(출석≥80%, 지각≤10%), 자료 열람률(주차별 60%+), 정보 게시 참여(제보→승인 50%+)
- 페이지 성능 지표(Core Web Vitals), 검색 노출(브랜드 쿼리 점유), 재방문율(30일 내 25%+)

프로젝트 아카이브 지표(추가)
- 프로젝트 상세 조회수, 데모/레포/데크 클릭률, 기수별 관심도, Featured 노출 기여도

---

### 11) 브랜딩/콘텐츠 가이드(초안)

- 톤앤매너: 실용적, 명확, 따뜻함
- 색/서체: 추후 확정(로고/팔레트 수급)
- 이미지: 세션/프로젝트 활동 중심, 과도한 스톡 지양

---

### 12) 공개/접근 정책

- 랜딩/프로젝트 아카이브는 공개, 공지/정보/출석/세션 자료는 로그인 및 롤 제한(멤버/운영진)
- 개인정보 최소 수집, 목적 달성 시 파기, 알림 옵트인
 - 카페 아카이브(`legacy_posts`)는 저작권·개인정보 검토 후 전체공개를 기본으로 하되, 민감 항목은 숨김 처리

테이블 공개 범위(요약)
- projects, legacy_posts: 기본 공개(select true), 비공개 플래그/승인 워크플로로 관리
- resources, notices, info_posts: member 전용(select는 `profiles.user_id = auth.uid()`)
- subscription_leads: 누구나 insert 가능, select는 admin만

---

### 13) 개방 이슈/선택지(의사결정 필요)

1) 로그인 방식: 이메일 기본 + 소셜(Google/Apple/Kakao) 중 어떤 조합?
   - 권고안: v1은 Google만 + 전화번호 화이트리스트(무료/간소화). v2에 Apple 검토
2) 출석 체크: 코드/QR/지오펜싱 중 선택(권장: 코드+QR 겸용)·지각/마감 기준치?
   - 권고안: v1 코드+QR 겸용, 기본 지각 19:00/마감 19:15(세션별 오버라이드)
3) 리더보드 노출 범위: 부원 전용 vs 공개 일부(익명화) 중?
   - 권고안: v1 부원 전용 유지(사생활/경쟁 유발 최소화)
4) 지원서 문항: 공통/트랙별 구성, 파일 업로드 필요 여부?
5) 알림 채널: 이메일만 vs 이메일+슬랙/디스코드 Webhook 연동?
6) 정보 페이지 제보 권한: 누구나(로그인 필요) vs 부원 전용?
   - 권고안: 부원 전용 시작, 스팸·검수 비용 완화 후 확대 검토
7) 다국어: 한국어 기본, 영어 추가 필요 여부?
8) 브랜딩 자산: 로고/컬러/서체 확정 유무 및 제공 경로?
9) 개인정보/약관: 기존 문서 사용 vs 신규 작성 필요?
10) 호스팅/도메인: 도메인 보유 여부, 배포 채널(Vercel 권장) 확정?
11) 구글폼 연동 방식: 임베드 vs 새창 링크, 제출 후 리디렉션 페이지(가이드) 필요 여부
   - 권고안: 기본 새창 링크 + 제출 가이드 페이지 제공(임베드는 폼 정책 이슈 발생 시 비권장)
12) 구글 시트와의 자동 동기화 필요 여부(v2)와 범위(현황 카드/지표)
13) 임포트 방식(프로젝트): CSV 템플릿 유지 vs v2에 구글시트/Notion API 연동
결정 사항(카페 이관)
- 카페 데이터 이관 범위: 전량 이관(민감/개인정보는 비식별·숨김)
- 카페 원본 이미지: 스토리지 업로드로 표준화(원문 링크 출처 표기)
- 댓글/작성자: 댓글은 미수집, 작성자는 닉네임 등 최소표기

---

### 14) 마일스톤(초안)

- M1(주차 1): IA/디자인 가이드/데이터 모델 확정, 스캐폴드, 인증/권한
- M2(주차 2): 랜딩, 출석 MVP(코드 체크/통계), 세션 자료 MVP
- M3(주차 3): 모집 공고+구글폼 연동 MVP(공고/기간/폼URL), 정보 페이지 MVP(제보→승인), 프로젝트 아카이브 MVP(카드/필터/상세)
- M4(주차 4): 알럼나이/소감, CMS 강화, 접근성/성능/분석, 도메인 연결/런칭

마일스톤 수용 기준(핵심)
- M1: 로그인+화이트리스트 매칭 E2E 통과, `profiles.role` 기반 보호 라우팅 작동
- M2: 100명 동시 출석 체크 95p 응답 ≤ 5s, 랜딩 Lighthouse 90+
- M3: 프로젝트 CSV 임포트 시뮬레이션/롤백 완료, 정보 제보 승인 워크플로 동작
- M4: 접근성 점검(axe 무오류), 도메인 연결+SEO 설정(OG/사이트맵)

---

문서 변경 이력
- v0.1(2025-08-10): 최초 초안 작성


