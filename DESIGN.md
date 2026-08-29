# PIP Design Contract

Status: **implemented · v0.3**

## Atmosphere

**Quiet canvas. Electric kiwi. Human evidence.**

PIP은 흰 여백과 검은 편집 구조를 기본으로 삼고, kiwi green은 행동과 기억이 필요한 순간에만 점화한다. UI는 실제 작업과 근거보다 먼저 보이지 않는다.

## Operating rules

1. 한 viewport에서는 큰 초록 면, 큰 초록 글자, 큰 초록 수치 중 하나만 선택한다.
2. 일반 화면의 약 90%는 neutral area로 유지한다.
3. 정보 표면과 이동 표면을 외형만으로 섞지 않는다. 이동은 전체 영역 link와 focus-visible로 드러낸다.
4. Border보다 간격, 정렬, surface 차이를 먼저 사용한다.
5. Normal text는 4.5:1, large text·필수 boundary·focus는 3:1 이상을 release gate로 삼는다.
6. 색은 상태의 유일한 신호가 될 수 없다.
7. Mobile은 desktop의 축소가 아니라 동일한 우선순위의 재구성이다.

## System flow

```text
Foundation → Primitive → Component → Pattern → Page
```

- Foundation은 색, type, space, radius, motion의 역할을 정한다.
- Primitive는 focus, keyboard, disclosure처럼 어려운 behavior를 해결한다.
- Component는 semantic token과 명시적인 state contract만 사용한다.
- Pattern은 반복되는 정보 구조이며 두 번째 consumer가 생긴 뒤 승격한다.
- Page는 product context에 맞춰 조합하며 raw value를 새로 고르지 않는다.

## Interaction contract

모든 interactive family는 light·dark 각각의 rest, hover, active, focus-visible, disabled를 설명해야 한다. Component source에서 primitive hex나 임의의 `color-mix()`로 상태를 만들지 않고 semantic state token을 사용한다.

Motion은 150–220ms의 짧은 feedback에 한정하며 `prefers-reduced-motion`에서 제거한다. 44px 기본 target을 유지한다.

## Responsive treatment

- `preserve`: brand thesis, 실제 evidence, 핵심 action
- `recompose`: heading grid, token table, component specimen
- `collapse`: 상세 계약과 보조 설명
- `defer`: product-specific 사례와 긴 migration guide

320px과 390px에서 가로 overflow, 한국어 줄바꿈, focus 순서와 touch target을 확인한다.

## Adoption gate

Native semantic HTML을 우선한다. 외부 primitive나 registry component는 license, dependency, keyboard, focus, reduced motion, responsive behavior를 확인한 뒤 PIP token과 API에 맞게 소유한다. `reference`, `candidate`, `approved`, `implemented`를 같은 의미로 사용하지 않는다.
