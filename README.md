# PIP — WhiteKiwi Design System

WhiteKiwi의 브랜드 원칙, semantic token과 React UI contract를 공개적으로 관리하는 design system입니다.

Documentation: <https://design.whitekiwi.link>

## Architecture

```text
Foundation → Primitive → Component → Pattern → Page
```

- `@whitekiwi/tokens`: color, spacing, typography, radius, motion과 responsive foundation
- `@whitekiwi/ui`: 접근 가능한 React component와 명시적인 static/interactive variant
- `@whitekiwi/docs`: guideline, component catalogue와 responsive visual QA surface

## Commands

```bash
pnpm install
pnpm dev
pnpm check
```

## Adoption policy

Native semantic HTML을 우선합니다. Dialog, Tooltip, Tabs, Toast처럼 keyboard와 focus 관리가 복잡한 동작만 Radix primitive를 사용합니다. Page는 raw color를 고르거나 독자적인 card interaction을 만들지 않고 token과 component variant를 조합합니다.

첫 번째 consumer는 `WhiteKiwi/portfolio`입니다. 독립 build와 시각 parity를 확인한 뒤 점진적으로 workspace/package dependency로 전환합니다.
