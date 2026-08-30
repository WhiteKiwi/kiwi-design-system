# Reference base

설계 결정을 다시 검증할 때 사용하는 공식·원문 중심 자료입니다. 비교가 필요한 정보는 `source → use → limit` 순서의 table로 유지합니다.

## Systems and foundations

| Source | Use | Limit |
| --- | --- | --- |
| [SEED Design System](https://seed-design.io/) | Foundation, Component, Pattern으로 나뉜 운영 구조 | WhiteKiwi의 브랜드 값이나 제품 문법을 대신하지 않음 |
| [SEED Design Token](https://seed-design.io/foundations/design-token) | Scale token과 Semantic token 계층 | 실제 role과 naming은 PIP의 job에서 출발 |
| [Carbon Tile](https://carbondesignsystem.com/components/tile/usage/) | Static, clickable, selectable, expandable tile의 affordance 분리 | Carbon의 시각 밀도는 제품 맥락 전용 |
| [Atlassian Elevation](https://atlassian.design/foundations/elevation/) | Surface와 interaction state, 과도한 elevation 제한 | Atlassian의 product pattern을 그대로 가져오지 않음 |
| [Adobe Spectrum Color](https://spectrum.adobe.com/page/color-system/) | 지각·접근성 기반 color semantics | enterprise density와 component anatomy는 별도 판단 |
| [GOV.UK Design System](https://design-system.service.gov.uk/) | 근거, maturity와 공개 contribution governance | 공공 서비스의 identity는 해당 맥락 전용 |

## Behavior, implementation, and QA

| Source | Use | Limit |
| --- | --- | --- |
| [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction) | 접근 가능한 unstyled behavior primitive | 시각적 contrast, target, label은 제품 책임 |
| [Radix Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility) | WAI-ARIA, keyboard navigation과 focus management | 제품 전체의 접근성을 자동 보장하지 않음 |
| [shadcn/ui](https://ui.shadcn.com/) | open-code component ownership 방식 | 복사한 source와 upgrade 비용은 제품이 소유 |
| [Tailwind Theme Variables](https://tailwindcss.com/docs/theme) | token을 utility API로 노출하는 방식 | utility 이름이 semantic model을 대신하지 않음 |
| [WCAG 2.2 Contrast Minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum) | text contrast release gate | 시각적 hierarchy와 브랜드 품질은 별도 검토 |
| [WCAG 2.2 Non-text Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) | control boundary와 focus contrast release gate | color 외의 keyboard·semantics 검증도 필요 |
| [Storybook](https://storybook.js.org/) | 격리된 component state와 반복 가능한 visual review | 통합 page, routing, data QA를 대신하지 않음 |
| [Awesome Design MD](https://github.com/VoltAgent/awesome-design-md) | 저장소 안에서 agent가 읽는 짧은 디자인 계약 | 예시의 taste를 제품 규칙으로 복사하지 않음 |

## Curated discovery maps

| Index | Best for | Use with caution |
| --- | --- | --- |
| [Awesome](https://github.com/sindresorhus/awesome) | curation scope와 contribution grammar | 디자인 authority가 아닌 index의 index |
| [Awesome Design Systems](https://github.com/alexpate/awesome-design-systems) | 공개 design system과 capability tag 비교 | 링크의 현재 상태를 재확인 |
| [Awesome Design Systems by klaufel](https://github.com/klaufel/awesome-design-systems) | token, testing, talks, books, tools까지 탐색 | canonical source로 다시 검증 |
| [Awesome Design Tools](https://github.com/goabstract/Awesome-Design-Tools) | job 중심 tool과 workflow 탐색 | 포함 자체가 품질 보증은 아님 |
| [Design Resources for Developers](https://github.com/bradtraversy/design-resources-for-developers) | UI library, asset, template의 폭넓은 발견 | 항목별 license와 접근성 검토 |
| [Awesome Styleguides](https://github.com/streamich/awesome-styleguides) | styleguide와 documentation 구조 비교 | legacy 또는 중단된 link가 섞일 수 있음 |
| [Awesome Tailwind CSS](https://github.com/aniftyco/awesome-tailwindcss) | 현재 Tailwind ecosystem 탐색 | PIP token과 accessibility 적합성은 별도 |
| [Awesome React Components](https://github.com/brillout/awesome-react-components) | interaction job별 React 구현 후보 | component별 유지보수와 license 확인 |
| [Awesome Storybook](https://github.com/lauthieb/awesome-storybook) | addon, docs, visual QA workflow | 설치된 major version 호환성 확인 |

## Adoption stance

각 source는 하나의 구체적인 판단에만 사용하며 전체 시각 언어를 복사하지 않는다. Native semantic HTML을 우선하고, 외부 primitive나 registry source는 canonical source, license, dependency, keyboard, focus, reduced motion과 기존 token 적합성을 확인한다.

`reference`, `candidate`, `approved`, `implemented`는 서로 다른 상태다. 공개 문서에는 실제 코드와 QA가 함께 완료된 항목만 implemented로 표시한다.
