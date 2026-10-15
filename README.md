<p align="center">
  <img src="assets/pip-cover.svg" alt="PIP — WhiteKiwi Design System" width="100%">
</p>

<p align="center">
  <strong>Quiet canvas. Electric kiwi. Human evidence.</strong><br>
  WhiteKiwi의 제품을 하나의 시각 언어로 연결하는 디자인 시스템.
</p>

<p align="center">
  <a href="https://design.whitekiwi.link/">Explore PIP</a> ·
  <a href="docs/guidelines.md">Design principles</a> ·
  <a href="references/README.md">References</a>
</p>

---

## Small parts. One clear system.

PIP은 색과 간격, 컴포넌트의 상태와 움직임을 함께 정의합니다. 화면이 달라도 같은 역할은 같은 방식으로 읽히고, 같은 행동은 일관된 반응을 갖도록 설계했습니다.

흰 여백과 검은 타이포그래피가 읽기와 구조를 맡고, kiwi green은 중요한 행동과 기억할 장면을 강조합니다. 장식보다 콘텐츠와 실제 결과가 먼저 보이는 인터페이스를 지향합니다.

## Inside PIP

| 구성 | 담고 있는 것 |
| --- | --- |
| **[@whitekiwi/tokens](packages/tokens)** | Light·dark 테마, 의미에 따른 색 역할, 간격, 서체, radius와 motion |
| **[@whitekiwi/ui](packages/ui)** | 토큰 위에 구현한 React 컴포넌트와 상호작용 상태 |
| **[Public catalog](https://design.whitekiwi.link/)** | 색과 역할, 컴포넌트 예제, 패턴과 상태별 설계 기준 |

컴포넌트는 네 가지 역할로 구성됩니다.

- **Controls** — Button, TextField, TextLink
- **Feedback** — Badge, Callout
- **Editorial** — StaticCard, LinkedCard, SectionHeading, CollectionHeading
- **Disclosure** — 펼치기와 접기를 위한 Disclosure

## A system of responsibilities

```text
Foundation → Primitive → Component → Pattern → Page
시각적 역할      동작          인터페이스       공통 구성      제품 맥락
```

Foundation은 시각적 기준을, Primitive는 키보드와 포커스 같은 동작을 담당합니다. Component는 이를 명확한 API와 상태로 묶고, Pattern과 Page는 실제 콘텐츠와 제품 맥락에 맞춰 구성합니다.

Native HTML의 의미를 기본으로 삼고, 복잡한 동작에는 Radix primitive를 사용합니다. 컴포넌트의 시각적 기준은 외부 라이브러리가 아닌 PIP의 semantic token이 결정합니다.

## Clear by design

- **One signal.** 한 화면에서 강조의 중심을 하나로 유지합니다.
- **Honest interaction.** 읽는 표면과 누를 수 있는 표면을 구분하고, 포커스와 상태를 드러냅니다.
- **Two themes, shared meaning.** Light와 dark는 같은 역할을 유지하면서 각 배경에 맞는 값을 갖습니다.
- **Content first.** 작은 화면에서도 정보의 우선순위를 유지하고 구성을 다시 잡습니다.

명시한 색 조합은 일반 텍스트 4.5:1, 큰 텍스트와 필수 UI 경계 3:1을 기준으로 검증합니다. 키보드·포커스·reduced motion도 컴포넌트 계약에 포함됩니다. 실제 제품의 조합과 사용자 정의 스타일은 별도의 검증 대상입니다. [전체 설계 기준 →](docs/guidelines.md)

## Repository

```text
packages/tokens/  semantic tokens and themes
packages/ui/      React components and styles
apps/docs/        public catalog and visual specimens
docs/            design contracts and release records
references/      sources and design rationale
```

구현의 기준은 [theme.css](packages/tokens/src/theme.css)와 [UI source](packages/ui/src)입니다. [설계 문서](docs/guidelines.md)는 역할과 상태의 계약을, [reference base](references/README.md)는 참고한 시스템과 선택의 근거를 설명합니다.

---

[MIT](LICENSE) · WhiteKiwi. 외부 의존성과 별도 라이선스의 자산은 각자의 라이선스를 유지합니다.
