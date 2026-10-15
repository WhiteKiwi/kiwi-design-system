<p align="center">
  <img src="assets/pip-cover.svg" alt="PIP — WhiteKiwi Design System" width="100%">
</p>

<p align="center">
  <strong>Quiet canvas. Electric kiwi. Human evidence.</strong><br>
  WhiteKiwi의 공통 디자인 토큰과 React 컴포넌트. 제품에서 사용하고, 필요한 개선을 함께 돌려줍니다.
</p>

<p align="center">
  <a href="https://design.whitekiwi.link/">Component catalog</a> ·
  <a href="docs/usage.md">Usage</a> ·
  <a href="CONTRIBUTING.md">Contributing</a> ·
  <a href="DESIGN.md">Agent contract</a>
</p>

## Start here

| 하려는 일 | 읽을 문서 |
| --- | --- |
| 제품에 설치하고 사용하기 | [사용 가이드](docs/usage.md) |
| 토큰·테마 적용하기 | [@whitekiwi/tokens](packages/tokens/README.md) |
| React 컴포넌트의 API와 제약 확인하기 | [@whitekiwi/ui](packages/ui/README.md) |
| 버그 수정·컴포넌트 추가·공통 개선하기 | [기여 가이드](CONTRIBUTING.md) |
| 소비 프로젝트의 에이전트에 작업 규칙 연결하기 | [Agent setup](docs/usage.md#agent-setup) |
| 디자인 기준 확인하기 | [전체 가이드](docs/guidelines.md) · [간결한 에이전트 계약](DESIGN.md) |
| 패키지 버전 변경·배포하기 | [npm 릴리스](docs/npm-release.md) |
| README·릴리스 이미지 만들기 | [Repository surfaces](docs/repository-surfaces.md) |
| 외부 컴포넌트 도입 근거 확인하기 | [Reference base](references/README.md) |

## Use PIP

React 앱에서는 두 패키지를 함께 설치합니다. React와 React DOM은 19 이상이 필요하며, 현재 검증 기준은 React 19입니다.

```sh
npm install @whitekiwi/ui @whitekiwi/tokens
```

```tsx
// 프레임워크가 허용하는 전역 CSS 진입점에서 한 번만 로드합니다.
import "@whitekiwi/tokens/theme.css";
import "@whitekiwi/ui/styles.css";

import { Button } from "@whitekiwi/ui";

export function SaveButton() {
  return <Button type="submit">저장</Button>;
}
```

React 없이 사용할 때는 `@whitekiwi/tokens`만 설치합니다. 두 패키지를 함께 쓰면 같은 PIP 버전을 유지합니다. 테마, 서버 렌더링, 앱의 CSS 적용 순서는 [사용 가이드](docs/usage.md)를 따릅니다.

## Improve PIP while using it

기존 API와 토큰을 먼저 확인합니다. 작업 중 공통 컴포넌트·토큰·패턴 개선이 유용하다고 판단하면 필요성, 공통화의 이점, 최소 변경 범위를 사용자에게 제안합니다. 동의한 개선은 **이 저장소에 먼저 기여한 뒤 소비 프로젝트에 적용**합니다. 이미 요청하거나 승인한 범위라면 다시 묻지 않습니다.

사용처 수를 조건으로 두지 않습니다. 지금 필요한 구성이라도 공통으로 관리할 가치가 있으면 제안할 수 있습니다. 제품 전용 데이터·업무 로직은 소비 프로젝트에 유지하고, 화면 구성은 합의한 공통 부분만 옮깁니다.

[기여 가이드](CONTRIBUTING.md)는 변경 위치 판단, 구현, 검증, PR과 소비 프로젝트 적용까지 안내합니다. 외부 소스는 license와 behavior를 검토한 뒤 도입합니다.

## Develop

Node.js 24+와 pnpm 10.33.0을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

PR 전에는 `pnpm check`, `pnpm release:check`, `pnpm release:pack`을 실행합니다. CI는 lint, 타입, 빌드, semantic color pair, 정적 렌더링 계약, 릴리스 테스트와 패키지 산출물을 검증합니다. 실제 브라우저의 키보드·포커스·반응형 QA는 [기여 가이드](CONTRIBUTING.md#verify-the-change)에 따라 별도로 수행합니다.

## Repository map

```text
packages/tokens/  CSS semantic tokens and themes
packages/ui/      React components and styles
apps/docs/        public component catalog and visual QA
docs/            usage, design rules, releases, repository surfaces
references/      source map and adoption rationale
CONTRIBUTING.md   change ownership and contribution workflow
DESIGN.md         compact design and improvement contract for agents
```

토큰은 [`theme.css`](packages/tokens/src/theme.css), 컴포넌트는 [`packages/ui/src`](packages/ui/src), 디자인 규칙은 [`docs/guidelines.md`](docs/guidelines.md)가 기준입니다. 카탈로그는 구현된 동작을 보여주며 candidate를 구현 완료로 간주하지 않습니다.

## Delivery

문서 사이트는 `main`의 CI 성공 후 GitHub Pages의 [design.whitekiwi.link](https://design.whitekiwi.link/)로 배포됩니다. `Deploy` 수동 실행도 지원합니다. `deploy/`는 기존 Mac 환경의 rollback helper입니다.

npm 배포는 별도입니다. 두 라이브러리는 같은 버전으로 릴리스하며, **새 `v*` 태그 push가 실제 게시를 시작합니다.** `main` merge나 문서 배포만으로 npm 패키지가 갱신되지는 않습니다. 버전 변경·미리보기·게시 절차는 [npm 릴리스 가이드](docs/npm-release.md)에 모아 둡니다.

## License

[MIT](LICENSE), copyright WhiteKiwi. 두 라이브러리의 배포 파일에도 같은 라이선스가 포함됩니다. 외부 의존성과 별도 라이선스의 자산은 각자의 라이선스를 유지합니다.
