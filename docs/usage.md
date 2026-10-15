# Use PIP in a product

PIP은 공통 토큰과 UI 동작을 제공하고, 소비 프로젝트는 데이터·업무 로직·화면 구성을 소유합니다. 먼저 [컴포넌트 카탈로그](https://design.whitekiwi.link/#components)와 설치한 버전의 API를 확인합니다. GitHub `main`의 소스와 문서에는 아직 배포되지 않은 변경이 있을 수 있습니다.

## Install

| 환경 | 설치 | 상세 안내 |
| --- | --- | --- |
| React 19+ | `npm install @whitekiwi/ui @whitekiwi/tokens` | [UI API와 제약](../packages/ui/README.md) |
| CSS·Vue·Svelte·일반 HTML | `npm install @whitekiwi/tokens` | [토큰과 테마](../packages/tokens/README.md) |

앱이 React와 React DOM 런타임을 관리합니다. UI는 ESM과 TypeScript 선언을 제공하며, 현재 테스트하는 React 버전은 19입니다. 다른 major에서는 앱 수준 호환성을 확인합니다. Tailwind는 필수가 아닙니다.

두 PIP 패키지를 함께 사용하면 같은 버전을 설치하고 앱의 lockfile을 커밋합니다. 설치 상태는 `npm ls @whitekiwi/ui @whitekiwi/tokens` 또는 앱 패키지 매니저의 동등한 명령으로 확인합니다.

## Integrate

프레임워크가 허용하는 전역 CSS 진입점에서 한 번만, 토큰 → UI → 앱 순으로 가져옵니다. 토큰만 쓰는 앱은 UI import를 생략합니다.

```tsx
import "@whitekiwi/tokens/theme.css";
import "@whitekiwi/ui/styles.css";
import "./app.css";
```

```tsx
import { Button, TextField } from "@whitekiwi/ui";

export function ProfileForm() {
  return (
    <form action="/profile" method="post">
      <TextField label="표시 이름" name="displayName" autoComplete="nickname" required />
      <Button type="submit">저장</Button>
    </form>
  );
}
```

예시의 `/profile` 처리와 필드 간 간격은 앱에서 구현합니다. Button의 기본 type은 `button`입니다. 폼 제출은 `submit`을 명시합니다. TextField의 `error`는 오류 표시와 접근성 연결을 제공하며 입력 검증 자체는 앱이 담당합니다.

| 항목 | 앱에서 결정할 내용 |
| --- | --- |
| 테마 | `<html data-theme="light">` 또는 `dark`. 시스템 모드는 속성을 제거하며 `auto`를 지정하지 않음 |
| 테마 저장 | 사용자 선택 저장, 전환 UI, 첫 paint 전 테마 적용 |
| CSS·폰트 | reset, 폰트 로딩, 페이지 layout과 spacing. 값은 semantic token 사용 |
| 서버 렌더링 | UI entry는 `"use client"`를 유지. 이벤트 핸들러와 `cn` 호출은 client module에 배치 |
| 접근성 | 실제 label·heading·link, 키보드 흐름, 동적 알림과 앱 전체 contrast 검증 |

세부 API와 예외는 [UI README](../packages/ui/README.md), 색 역할과 override는 [tokens README](../packages/tokens/README.md)를 기준으로 삼습니다. 내부 `src` 경로 대신 공개 export로 import합니다.

## When something is missing

1. 설치한 버전, 기존 API·토큰, 최신 소스와 관련 issue/PR을 확인합니다. 이미 구현됐다면 호환성을 검토한 뒤 업데이트합니다.
2. 기존 컴포넌트의 조합으로 해결되는 제품 요구는 앱에서 구성합니다.
3. 공통 결함·접근성 문제·범용 컴포넌트 또는 variant 부족은 [기여 가이드](../CONTRIBUTING.md#decide-where-the-change-belongs)에 따라 이 저장소에서 개선합니다.
4. 패키지 산출물로 소비 프로젝트를 검증하고, 릴리스 후 배포 버전을 설치해 연결을 완료합니다.

앱의 layout 조정과 의도적인 테마 설정은 앱 CSS에서 처리할 수 있습니다. 공통 컴포넌트의 결함을 고치기 위해 source를 복사하거나 내부 selector를 덮어써야 한다면 공통 개선을 먼저 검토합니다. 긴급 우회는 이유, 관련 issue/PR, 담당자, 제거 조건을 남깁니다. 후속 배포 버전을 적용할 때 우회 코드를 제거합니다.

저장소 접근 권한이나 작업 범위 때문에 직접 개선할 수 없다면 재현 코드·설치 버전·필요한 API를 정리해 인계합니다. issue/PR을 만들었다고 보고할 때는 실제 링크를 남깁니다.

## Agent setup

소비 프로젝트에서 사용하는 `AGENTS.md` 등 에이전트 지침에 아래 블록을 넣습니다. npm 설치만으로 이 저장소의 지침이 소비 프로젝트에 자동 적용되지는 않습니다. 읽는 버전과 실제 의존성 버전을 함께 확인합니다.

```md
## PIP design system

- Use @whitekiwi/tokens and @whitekiwi/ui before creating equivalent local UI.
- Read https://github.com/WhiteKiwi/kiwi-design-system/blob/main/docs/usage.md
  and https://github.com/WhiteKiwi/kiwi-design-system/blob/main/DESIGN.md.
- Check installed versions and existing APIs before changing behavior; main may contain unreleased work.
- For shared bugs, accessibility fixes, or reusable component gaps, follow
  https://github.com/WhiteKiwi/kiwi-design-system/blob/main/CONTRIBUTING.md
  and improve the design-system repository within the authorized task scope.
- Keep product data, business logic, and page composition in this app. A second
  consumer is required for promoting product-specific patterns, not for bug fixes
  or a general-purpose component supported by a concrete use case.
- Verify the packed packages in this app. Track any temporary workaround and
  remove it when adopting the published fix. Link related PRs and record tested versions.
```

## Upgrade

릴리스 노트와 API·token 변경을 읽고 UI와 tokens를 같은 릴리스로 업데이트합니다. 실제 페이지에서 light/dark, 키보드, 좁은 화면, 오류 상태를 확인합니다. 의존 버전·lockfile·필요한 migration을 같은 변경에 포함합니다.

새 기능은 소스의 merge만으로 이용 가능해지지 않습니다. 미공개 변경을 시험하는 절차는 [Test in a consumer](../CONTRIBUTING.md#test-in-a-consumer), npm 공개 절차는 [npm release](npm-release.md)를 참조합니다.
