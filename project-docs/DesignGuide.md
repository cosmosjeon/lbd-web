### LBD 디자인 가이드 (v0.4)

- 문서 버전: v0.4
- 최종 업데이트: 2025-08-11
- 참고 자료: 첨부 포스터/로고(7기/8기), `로고-투명버전.svg`
  - 레퍼런스(구성/스크롤 모션/인터랙션): [KUCC](https://kucc.co.kr/), [Mash-Up](https://mash-up.kr/), [YAPP](https://www.yapp.co.kr/), [UMC](https://umc.makeus.in/), [SOPT](https://www.sopt.org/)

---

### 1) 브랜딩 키워드

- 변화의 파도, 실천, 실용적 따뜻함, 임팩트

---

### 2) 컬러 팔레트(초안)

- LBD Orange: #E6863F
- LBD Peach: #F3B78C
- Ocean Teal: #0E5F73
- Deep Navy: #0B2D3A
- Coal Black: #111111
- Pure White: #FFFFFF
- Neutral Gray 50/100/200/300/400/600/800: #F8F9FA/#F1F3F5/#E9ECEF/#DEE2E6/#CED4DA/#868E96/#343A40

사용 원칙
- CTA/강조: LBD Orange
- 배경: Ocean Teal(히어로), Deep Navy(푸터), White(본문)
- 카드 썸네일 오버레이: Navy 70% + White 텍스트

대체 팔레트/상태 색
- Success: #16A34A, Warning: #F59E0B, Danger: #DC2626, Info: #2563EB

---

### 3) 타이포그래피

- 기본: Pretendard Variable(한글) / Inter(영문/숫자)
- 헤딩: 800/700, 본문: 400~500, 캡션: 400
- 라인 높이: 헤딩 1.2, 본문 1.6, 캡션 1.3
- 문자 간격: 대문자 타이틀 -0.5% 내외(시각 보정)

웹 임베드 가이드
- Pretendard Variable는 CDN 또는 자체 호스팅. FOUT 최소화를 위해 font-display: swap
- 숫자 UI는 Inter 우선 적용(탭/리더보드)

---

### 3.5) 모션/인터랙션 토큰

- Duration(기본): ultra-fast 120ms, fast 180ms, base 240ms, slow 320ms, modal 400ms
- Easing(기본)
  - enter: cubic-bezier(0.22, 1, 0.36, 1)
  - exit: cubic-bezier(0.4, 0, 0.2, 1)
  - spring(컴포넌트): stiffness 260, damping 30
- Reveal 패턴(스크롤 인뷰)
  - fadeUp: translateY 24px → 0, opacity 0 → 1
  - fadeIn: opacity 0 → 1
  - scaleIn: scale 0.98 → 1, opacity 0 → 1
- Stagger: itemDelay 60ms, groupDelay 120ms
- Scroll Trigger: threshold 0.2(모바일 0.1), once true, rootMargin 0 0 -10% 0
- Hover/Focus
  - 카드: scale 1.01, shadow md→lg, 180ms
  - 버튼: translateY -1px 120ms / active 0px
  - 포커스: 2px ring(LBD Orange), offset 2px
- Reduced Motion: `prefers-reduced-motion: reduce`일 때 duration 1ms, 파랄랙스/자동 슬라이드 비활성

원칙
- transform/opacity만 애니메이션, layout/box-shadow 트윈 최소화
- scroll-jacking 금지, 섹션 진입 시 자연스러운 리빌만 사용
- 시각 효과보다 상호작용(CTA, 내비게이션) 피드백 우선

### 4) 컴포넌트 스타일

- 버튼
  - Primary: 배경 LBD Orange, 텍스트 White, hover: 진하게(#D27736)
  - Secondary: 테두리 Gray-300, 텍스트 Navy, hover: 배경 Gray-50
  - Destructive: 배경 Danger, 텍스트 White, hover: #B91C1C
- 카드(프로젝트)
  - 썸네일 풀블리드, 하단 그라데이션 오버레이(검정 0→70%), 좌하단에 프로젝트명
  - 라운드 12px, 그림자 md, 호버 scale 1.01
- 배지(cohort)
  - Navy 배경 + White 텍스트, 라운드 6px
- 네비게이션
  - 상단 고정, 반투명 배경(블러), 스크롤 시 단색 배경 전환

- 팀(운영진) 카드
  - 원형 아바타(128px), 이름/직책/담당, 소셜 링크(아이콘 버튼)
  - 카드 라운드 16px, 배경 White, 그림자 md, 호버 elevate

- 캘린더
  - 색상: 세션(lbd.orange), 워크숍(lbd.teal), 행사(lbd.navy), 모집(lbd.peach)
  - 일자 셀에는 점 또는 바 형태의 이벤트 표시, 오늘 강조 테두리

폼/입력
- 입력 높이 40px, 라운드 10px, 포커스 링 2px(LBD Orange)
- 오류 메세지는 Danger 색, 아이콘과 함께 제공

---

### 5) 레이아웃/그리드

- 컨테이너: 1200px max, 24px 패딩
- 그리드: 12 columns, 카드 3~4열 반응형
- 섹션 간격: 80px(데스크탑) / 48px(모바일)

브레이크포인트
- sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536

---

### 6) 이미지/포스터 사용

- 히어로: 바다/물결 계열 이미지 사용 가능, 텍스트 대비를 위해 진한 오버레이 적용
- 포스터/배너는 alt와 출처를 명시
- 로고는 배경색에 따라 흑/백 버전 선택, 최소 여백 X(로고 높이의 25%) 확보

---

### 7) 아이콘/일러스트

- 단색(Black/Navy) 위주, 둥근 코너/심플 형태

---

### 8) Tailwind 토큰 예시

```ts
// tailwind.config.ts colors 예시
export const theme = {
  extend: {
    colors: {
      lbd: {
        orange: '#E6863F',
        peach: '#F3B78C',
        teal: '#0E5F73',
        navy: '#0B2D3A',
        black: '#111111'
      }
    },
    screens: {
      sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px'
    },
    borderRadius: {
      card: '12px'
    }
  }
}
```

---

### 9) 접근성 체크리스트

- 색 대비 WCAG AA 이상, 키보드 포커스 스타일 제공
- 모든 이미지 alt 제공, 의미 없는 장식은 `aria-hidden`
 - 모션 감소 설정 준수(prefers-reduced-motion), 포커스 트랩/탈출 가능

---

### 10) 랜딩 페이지 UX/UI 설계(상세)

섹션 구성
- 0) 고정 헤더 + 히어로 배경
- 1) 미션/가치
- 2) 활동/프로그램 하이라이트(아이콘 그리드)
- 3) 숫자로 보는 LBD(카운터)
- 4) Featured 프로젝트 슬라이더
- 5) 최근 소식 3건
- 6) 알럼나이/스토리 티징(선택)
- 7) 파트너/후원사 로고
- 8) CTA(지원/구독)
- 9) 푸터

헤더/내비
- 높이 72px → 스크롤 8px 초과 시 56px, 배경 투명 → White 90% + blur(8px)
- 링크 hover underline-offset 4px, focus ring 적용

히어로
- 레이아웃: 좌 텍스트(헤딩/서브/CTA 2), 우 비주얼(이미지/루프 영상)
- min-height 88vh(모바일 80vh), 컨테이너 max 1200px
- 모션: 텍스트 fadeUp(stagger 60ms), CTA scaleIn, 비주얼 subtle parallax(±12px)
- 접근성: h1 32~48px, 대비 AA, 키보드 포커스 순서 보장

미션/가치
- 2~3열 카드, 아이콘 + 제목 + 본문(2줄)
- 모션: 카드별 fadeUp(stagger 60ms)

활동/프로그램 하이라이트
- 6 아이콘 그리드, hover 시 translateY -2px 미세 모션, 모바일 아코디언 설명

숫자로 보는 LBD(카운터)
- in-view 시 카운트업(0→타겟, 1.2s, easeOut), reduce-motion 시 정적

Featured 프로젝트 슬라이더
- 1/2/3열(모바일/태블릿/데스크톱), 자동 6s, hover/포커스 시 일시정지
- 카드: 썸네일 풀블리드 + 하단 그라데이션 + 좌하단 텍스트
- 내비: 드래그/스와이프, 좌우 버튼, 도트(모바일 숨김)

최근 소식 3건
- 공지/아카이브/정보 중 최신 3건, 카드 hover elevate + underline

알럼나이 티징(선택)
- 슬라이더 또는 2열, 인용 + 짧은 코멘트

파트너/후원사 로고
- 마퀴 자동 스크롤, hover/포커스 시 정지, 대비 낮은 로고는 단색 변환

CTA 섹션
- 큰 헤드라인 + 보조 카피 + 2버튼(지원/구독), 배경 그라데이션/텍스처

푸터
- 3열(소개/링크/소셜), 모바일 1열 아코디언

스크롤/모션 규칙
- 섹션 진입 20%에서 reveal, 섹션 내 stagger 60ms
- reduce-motion: reveal 비활성
- 파랄랙스는 데스크톱에서만 ±12px, 60fps 유지

반응형 규칙
- Hero 타이포: 48/40/32, 패딩 24/32/48(px)
- 그리드: 1→2→3열, 카드 min 280px
- 앵커 이동 `scroll-margin-top: 88px`

접근성
- 스킵 링크, 자동 슬라이더 정지/이전/다음 컨트롤, 포커스 시 자동재생 중지
- 카운터는 `aria-live=polite`(선택)

성능/구현
- IntersectionObserver(threshold 0.2), transform/opacity 전용 애니메이션
- 이미지: Next/Image, sizes/priority 설정
- 라이브러리: Framer Motion(선택), Swiper/Embla(선택)

디자인 QA(랜딩)
- 95p LCP ≤ 2.5s, CLS ≤ 0.1, Lighthouse(모바일) ≥ 90
- reduce-motion에서 모든 모션 정지/단축 확인
- 히어로 CTA가 720px 폭에서도 읽기 쉬움

---

### 11) 랜딩 모션 프리셋(개발자용)

Variants(의사코드)

```ts
export const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.24, ease: 'out' } }
}
export const scaleIn = {
  hidden: { scale: 0.98, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.18 } }
}
export const stagger = {
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } }
}
```

Intersection 옵션

```ts
{ threshold: 0.2, rootMargin: '0px 0px -10% 0px', once: true }
```

---

변경 이력
- v0.1(2025-08-10): 초안 작성
- v0.2(2025-08-10): 상태색/폼/브레이크포인트/토큰 보강
- v0.3(2025-08-11): 랜딩 상세/모션·인터랙션 토큰/접근성·성능 가이드 추가, 레퍼런스 링크 명시
- v0.4(2025-08-11): 레퍼런스 추가(UMC/SOPT), 모션 프리셋 코드블록/옵션 정리

