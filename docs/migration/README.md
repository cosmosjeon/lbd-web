### 네이버 카페 → 웹 마이그레이션 가이드 (v0.1)

- 소스: [LBD Naver Cafe](https://cafe.naver.com/learnbydo)
- 목표: 공지/세션노트/활동정리/성과물 등 핵심 기록을 보존하고 검색 가능한 형태로 이전

절차
1) `category_map.csv`에 카페 보드/폴더를 cohort·mapped_type으로 매핑
2) `naver_cafe_posts.csv`에 게시물 메타/본문/이미지 URL을 채움
3) 관리자 화면에서 CSV 업로드 → Edge Function가 정제/삽입
4) 이미지/파일은 Storage 업로드 후 URL 갱신, 원문 링크 표기
5) 표본 검수 및 공개

주의
- 개인정보/민감 정보는 비식별 처리 또는 숨김
- 댓글은 수집 대상 아님(요약 가능)

