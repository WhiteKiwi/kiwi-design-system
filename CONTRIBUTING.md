# Contributing

PIP의 토큰·컴포넌트·문서에 대한 개선을 환영합니다. 버그는 최소 재현 사례를, 새 API는 실제 사용 사례와 기존 API로 부족한 점을 함께 설명해 주세요.

## Local development

Node.js 24+와 pnpm 10.33.0을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

변경한 컴포넌트와 상태는 문서 카탈로그에서 확인할 수 있습니다. 디자인 기준은 [guidelines](docs/guidelines.md)를 따릅니다.

## Changes and review

- 토큰은 `packages/tokens/src/theme.css`, 컴포넌트는 `packages/ui/src`에서 관리합니다.
- 공개 API가 바뀌면 export, 패키지 README, 카탈로그의 예제·목록과 관련 검증을 함께 갱신합니다.
- 큰 변경은 독립적으로 검증할 수 있는 단위로 나누되 동작 변경과 그 문서·테스트는 같은 PR에 둡니다.
- PR에는 문제, 변경 후 동작, 호환성 영향과 검증 결과를 기록합니다. 커밋은 `{type}: {imperative summary}` 형식을 사용합니다.

```sh
pnpm check
pnpm release:check
pnpm release:pack
```

위 명령은 lint·타입·빌드·색 대비·정적 렌더링 계약·릴리스 로직과 실제 패키지 파일을 검증하며 npm에 게시하지 않습니다. UI나 토큰 변경은 light/dark, 키보드·포커스, reduced motion, 320px·390px·desktop의 실제 렌더링도 확인해 주세요. 확인하지 못한 항목은 PR에 명시합니다.

## Releases

두 공개 패키지는 같은 버전으로 릴리스합니다. npm 게시와 문서 사이트 배포는 별도입니다. 버전 변경, 산출물 확인과 게시 절차는 [npm release](docs/npm-release.md)에 정리되어 있습니다.
