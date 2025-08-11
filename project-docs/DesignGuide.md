### LBD 디자인 가이드 (v0.2)

- 문서 버전: v0.2
- 참고 자료: 첨부 포스터/로고(7기/8기), `로고-투명버전.svg`

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

변경 이력
- v0.1(2025-08-10): 초안 작성

