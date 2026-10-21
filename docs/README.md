# 문서 안내

처음 사용하는 사람은 [루트 README](../README.md)와 패키지 사용법에서 시작합니다. 시스템을 변경할 때는 아래 표에서 해당 작업의 계약과 소스를 읽습니다. 개발 환경과 검증 명령은 [CONTRIBUTING](../CONTRIBUTING.md)이 소유합니다.

## 작업별 읽기 경로

| 작업 | 먼저 읽을 기준 | 변경·확인할 위치 |
| --- | --- | --- |
| 제품에 PIP 적용 | [토큰 사용법](../packages/tokens/README.md), [UI 사용법](../packages/ui/README.md) | 소비 제품의 설치 버전·CSS import·테마·화면; [portable skill](https://github.com/WhiteKiwi/skills/tree/main/skills/kiwi-design-system)의 integration 경로 |
| 사용 중 개선점 발견 | [기여 흐름](../CONTRIBUTING.md#사용에서-개선으로), [설계 원칙](../DESIGN.md) | 기존 issue/PR·API를 확인하고 재현 사례와 원하는 결과를 남김; 명확한 변경은 PR, 열린 판단은 issue |
| 토큰·테마 변경 | [색 계약](guidelines.md#color-contracts) | [theme.css](../packages/tokens/src/theme.css), 영향을 받는 UI와 카탈로그, [대비 검사](../scripts/check-design.mjs) |
| 컴포넌트·API·상태 변경 | [UI 사용법](../packages/ui/README.md), [상태 계약](guidelines.md#state-ownership) | [UI source](../packages/ui/src), [exports](../packages/ui/src/index.ts), package README, 카탈로그 예제·목록과 관련 검사 |
| 카탈로그 예제·설명 변경 | [가이드라인](guidelines.md), [문서 앱 지침](../apps/docs/AGENTS.md) | [page.tsx](../apps/docs/src/app/page.tsx), [design-standards.tsx](../apps/docs/src/app/design-standards.tsx), 관련 metadata·styles |
| README·표지·시스템 문서 정리 | [저장소 표면 계약](repository-surfaces.md), 아래 문서 소유 위치 | 해당 Markdown·[assets](../assets)와 연결 문서 |
| 버전·패키지 배포 변경 | [npm release](npm-release.md) | package manifests·lockfile·릴리스 노트·[release script](../scripts/release.mjs)·[workflow](../.github/workflows/npm-release.yml) |

공개 사이트의 배포 정의는 [deploy.yml](../.github/workflows/deploy.yml)에 있습니다. DNS·호스팅 운영은 [infra의 PIP 문서](https://github.com/WhiteKiwi/infra/tree/main/services/kiwi-design-system)를 따릅니다.

## 문서의 소유 위치

| 문서 | 유지할 내용 |
| --- | --- |
| [README](../README.md) | 정체성·미션·대표 슬로건, 패키지 선택과 최소 사용 예제 |
| [DESIGN](../DESIGN.md) | 설계 원칙·시각적 분위기·계층별 책임과 선택 이유 |
| [guidelines](guidelines.md) | 색·상태·반응형·접근성의 상세 계약, 컴포넌트 목록과 도입 기준 |
| 패키지 [tokens](../packages/tokens/README.md) / [ui](../packages/ui/README.md) README | 설치·공개 API·실제 사용법·제약 |
| [카탈로그 소스](../apps/docs/src/app) | 구현된 컴포넌트와 계약을 보여 주는 예제 |
| [CONTRIBUTING](../CONTRIBUTING.md) | 기여 흐름·개발 환경·변경 단위·검증과 PR 작성 |
| [AGENTS](../AGENTS.md) | AI의 작업 진입점·변경 의무·완료 기준 |
| [repository-surfaces](repository-surfaces.md) | README·release artwork의 표현 기준 |
| [npm-release](npm-release.md) | 버전 정책·패키징·게시 절차 |
| [references](../references/README.md) | 외부 참고 근거, 적용한 부분과 한계 |
| 이 문서 | 작업별 탐색 경로와 문서 유지 기준 |

토큰 값과 공개 API의 현재 구현은 소스와 package manifest에서 확인합니다. 문서는 의도와 사용 계약을 설명합니다. 둘이 다르면 관련 코드·검사·이력을 확인해 차이를 해소하고, 확인 전에는 문서를 근거로 구현 완료를 단정하지 않습니다.

## 작게 유지하는 방법

- 같은 규칙의 상세 설명은 한 문서에서 갱신합니다. README의 요약과 카탈로그 예제는 그 문서로 연결하고, 규칙이 바뀌면 함께 맞춥니다.
- 현재 계약을 직접 수정하고 일상적인 판단·검증 결과는 PR에 기록합니다. 재사용할 설명이 생기면 관련 문서에 이유와 제약을 보강합니다.
- 새 문서는 기존 문서로 설명하기 어려운 독립 주제가 있을 때 추가합니다. 이 안내와 실제 읽기 경로에서 연결하고 상대 링크·anchor를 검사합니다.
- 파일을 옮기기 전에는 문서·스크립트·workflow·외부 skill의 참조를 확인합니다. 릴리스 기록은 당시 사실로 보존하며 현재 사용법과 구분합니다.
- `reference`, `candidate`, `approved`, `implemented`를 구분합니다. 소스 반영, 실제 렌더링 검증, npm 게시, 제품 적용의 결과를 각각 확인합니다.

## 릴리스 기록

- [0.1.1](releases-0.1.1.md) — 패키지 사용 안내와 라이선스 구성 개선.

패키지 버전은 각 `packages/*/package.json`이 소유합니다. 가이드라인의 `v0.3`은 디자인 계약 버전이며 npm 버전과 다릅니다. 그 밖의 변경 이력은 Git과 PR에서 조회합니다.
