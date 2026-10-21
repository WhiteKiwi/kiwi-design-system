# Contributing

PIP은 실제 제품에서 쓰면서 다듬습니다. 불편한 동작, 빠진 상태, 유용한 조합과 설명의 빈틈을 이 저장소로 돌려보내 주세요. 하나의 사용 사례로도 개선을 시작할 수 있습니다.

## 사용에서 개선으로

**사용 → 발견 → 제안 또는 PR → 구현·문서·검증 → 제품에 다시 적용**

1. **현재 필요를 확인합니다.** 사용 중인 PIP 버전, 기대한 결과, 실제 동작과 작은 재현 사례를 남깁니다. 기존 API·토큰·[이슈](https://github.com/WhiteKiwi/kiwi-design-system/issues)·[PR](https://github.com/WhiteKiwi/kiwi-design-system/pulls)에서 같은 문제나 해결책을 확인합니다.
2. **공유할 부분을 고릅니다.** 기존 API의 조합, 공통 컴포넌트·토큰·패턴 개선, 제품 전용 구현 중 필요한 범위를 선택합니다. 데이터·업무 로직은 제품에 두고, 공유할 동작과 의미를 설명합니다.
3. **작업이 이어질 곳을 남깁니다.** 변경과 검증 방법이 명확하면 작은 PR을 올립니다. 설계 판단이나 구현이 남아 있으면 [개선 이슈](https://github.com/WhiteKiwi/kiwi-design-system/issues/new?template=improvement.yml)에 필요·원하는 결과·열린 질문을 적습니다. 바로 작업할 수 없다면 이 내용을 구체적인 제안으로 전달합니다. 같은 내용을 새 이슈로 복제하지 말고 기존 논의에 연결합니다.
4. **시스템에 함께 반영합니다.** 구현, 사용 예제, 관련 계약과 검증을 같은 변경에서 갱신합니다. 기존 사례에서 배운 이유와 제약을 남겨 다음 작업의 기준으로 사용합니다.
5. **제품에서 확인합니다.** 패키지 변경은 로컬 tarball로 실제 사용 사례를 검증하고, 게시 후 소비 제품의 버전·lockfile과 화면을 확인합니다. 임시 우회 구현에는 관련 issue/PR와 제거 조건을 남기고 개선이 적용되면 제거합니다.

두 번째 제품이나 정해진 사용 횟수를 기다릴 필요는 없습니다. 하나의 사례에서도 공유 가치와 작은 변경 범위를 설명할 수 있어야 합니다. AI의 소비 제품 통합·upstream 기여 절차는 [portable skill](https://github.com/WhiteKiwi/skills/tree/main/skills/kiwi-design-system)을 따릅니다.

반복해서 참고할 선택은 [DESIGN](DESIGN.md)의 원칙이나 [상세 계약](docs/guidelines.md)에 이유와 적용 범위를 보강합니다. 새 원칙은 기존 원칙으로 설명하기 어려운 문제를 해결할 때 제안합니다. 적용 전에는 제안 상태를 표시합니다.

## Local development

Node.js 24+와 pnpm 10.33.0을 사용합니다. 버전 기준은 [package.json](package.json)에 있습니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

변경한 컴포넌트와 상태는 문서 카탈로그에서 확인합니다. 관련 소스와 계약은 [문서 안내](docs/README.md#작업별-읽기-경로)에서 찾습니다.

## 변경 단위

- 토큰은 [theme.css](packages/tokens/src/theme.css), 컴포넌트는 [UI source](packages/ui/src)에서 관리합니다.
- 공개 API가 바뀌면 export, 패키지 README, 카탈로그 예제·목록과 관련 검증을 함께 갱신합니다.
- 새로운 동작은 실제 문제를 검증하는 회귀 검사와 상태 예제를 갖춥니다. 단순 문구 수정에는 구현을 그대로 반복하는 테스트를 추가하지 않습니다.
- 큰 변경은 독립적으로 검증할 수 있는 단위로 나누되, 동작 변경과 그 문서·검증은 같은 PR에 둡니다.
- PR에는 사용 사례, 변경 후 동작, 호환성·마이그레이션 영향, 검증 결과와 후속 제품 적용을 기록합니다. 현재 작업에 해당하지 않는 항목은 이유를 적습니다.
- 커밋은 `{type}: {imperative summary}` 형식을 사용합니다.

## 검증

| 변경 범위 | 필요한 확인 |
| --- | --- |
| Markdown·AI 지침 | 상대 링크·anchor, 예제의 API·경로·명령을 실제 소스와 대조; `git diff --check` |
| README 표지·저장소 artwork | 위 확인과 [표면 계약](docs/repository-surfaces.md)의 light/dark·desktop·320px 렌더링 확인 |
| 토큰·컴포넌트·카탈로그·빌드 설정 | 아래 전체 검사; 영향받는 화면·상태의 실제 렌더링 확인 |
| 패키지 API·의존성·export·배포 구성 | 전체 검사와 tarball 내용·실제 소비 제품 검증; [릴리스 안내](docs/npm-release.md) 적용 |

코드 변경과 릴리스 준비에는 저장소 루트에서 실행합니다. CI도 전체 검사를 실행합니다.

```sh
pnpm check
pnpm release:check
pnpm release:pack
```

`check`는 lint·타입·빌드·색 대비·정적 렌더링 계약·릴리스 로직을 검사합니다. `release:check`와 `release:pack`은 배포 구성과 실제 패키지 파일을 검증하며 npm에 게시하지 않습니다.

UI나 토큰 변경은 light/dark, 관련 rest·hover·active·focus-visible·disabled·invalid 상태, 키보드·포커스, reduced motion, 320px·390px·desktop의 실제 렌더링을 확인합니다. 색 대비와 정적 렌더링 검사만으로 전체 접근성을 확인했다고 쓰지 않습니다. Core token 변경은 실제 소비 제품도 같은 변경 단위에서 검토합니다.

확인한 소스 revision, 명령·환경·결과를 PR에 기록합니다. 확인하지 못한 화면·소비 제품·검사는 미확인 범위와 후속 확인 방법을 명시합니다.

## Releases

두 공개 패키지는 같은 버전으로 릴리스합니다. npm 게시와 문서 사이트 배포는 별도입니다. 버전 변경, 산출물 확인과 게시 절차는 [npm release](docs/npm-release.md)에 정리되어 있습니다.

새 `v*` 태그를 push하면 npm 게시가 시작됩니다. 기여 PR의 머지, npm 게시, 소비 제품 적용은 각각 결과를 확인합니다.
