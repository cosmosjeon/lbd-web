### 프로젝트 아카이브 CSV 임포트 템플릿 가이드

- 위치: `lbd-web/docs/templates/`
- 인코딩: UTF-8, 구분자: 콤마(,)
- 날짜: ISO 8601(예: 2024-03-15), Boolean: true/false
- 배열형 필드는 세미콜론(;)로 구분(예: `ai;health;impact`)

공통 키
- `project_key`: 프로젝트를 식별하는 외부 키(임포트용). 세 파일 모두 동일한 값을 사용해 조인합니다. 유니크 보장.

열거값(권장)
- status: planned | active | completed
- role: team_lead | member | mentor
- artifact.type: slide | demo | video | report | asset

임포트 순서(권장)
1) projects.csv → 2) project_members.csv → 3) project_artifacts.csv

UI/권한 정책(결정 반영)
- 프로젝트 목록 카드는 대표 이미지+프로젝트명만 노출합니다.
- 필터는 기수(cohort)만 제공합니다.
- 상세는 임팩트 중심 필드를 사용합니다(문제정의/대상/접근/혁신/파트너/결과·지표/아티팩트/마일스톤/수상/배운점·다음 단계 등).
- 생성·편집은 운영진 전용이며 승인 후 게시됩니다.

주의
- `cover_image_url`과 `file_url`은 외부 URL 또는 추후 스토리지 업로드 경로를 사용할 수 있습니다.
- 대용량 이미지는 추후 스토리지 마이그레이션을 권장합니다.

