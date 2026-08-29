# Reference base

설계 결정을 다시 검증할 때 사용하는 공식·원문 중심 자료입니다.

- [SEED Design System](https://seed-design.io/): Foundation, Component, Pattern으로 나뉜 운영 구조
- [SEED Design Token](https://seed-design.io/foundations/design-token): Scale token과 Semantic token 계층
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction): 접근 가능한 unstyled behavior primitive
- [Radix Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility): WAI-ARIA, keyboard navigation과 focus management
- [shadcn/ui](https://ui.shadcn.com/): Open-code component ownership 방식
- [Tailwind Theme Variables](https://tailwindcss.com/docs/theme): Token을 utility API로 노출하는 방식
- [Carbon Tile](https://carbondesignsystem.com/components/tile/usage/): Static, clickable, selectable, expandable tile의 affordance 분리
- [Atlassian Elevation](https://atlassian.design/foundations/elevation/): Surface와 interaction state, 과도한 elevation 제한
- [Adobe Spectrum Color](https://spectrum.adobe.com/page/color-system/): 지각·접근성 기반 color semantics
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum): Text contrast release gate
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast): Control boundary와 focus contrast release gate
- [GOV.UK Design System](https://design-system.service.gov.uk/): 근거, maturity와 공개 contribution governance
- [Storybook](https://storybook.js.org/): 격리된 component state와 반복 가능한 visual review
- [Awesome Design MD](https://github.com/VoltAgent/awesome-design-md): 저장소 안에서 agent가 읽을 수 있는 짧은 디자인 계약

## Adoption stance

각 source는 하나의 구체적인 판단에만 사용하며 전체 시각 언어를 복사하지 않는다. Native semantic HTML을 우선하고, 외부 primitive나 registry source는 canonical source, license, dependency, keyboard, focus, reduced motion과 기존 token 적합성을 확인한다.

`reference`, `candidate`, `approved`, `implemented`는 서로 다른 상태다. 공개 문서에는 실제 코드와 QA가 함께 완료된 항목만 implemented로 표시한다.
