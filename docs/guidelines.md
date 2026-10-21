# PIP Design Guidelines v0.3

Status: **implemented** — 디자인 계약의 버전이며 npm 패키지 버전과 별도로 관리한다.

## Thesis

목적과 설계 원칙, 시각적 분위기는 [DESIGN.md](../DESIGN.md)를 따른다. 이 문서는 구현과 검토에 사용하는 상세 계약을 소유한다. 작업별 읽기 경로는 [문서 안내](README.md), 검증 명령은 [기여 안내](../CONTRIBUTING.md#검증)에 있다.

## Release contracts

1. 한 viewport에서는 큰 초록 면, 큰 초록 글자, 큰 초록 수치 중 하나만 선택한다.
2. 일반 화면은 약 90%의 neutral area를 목표로 한다.
3. Static card에는 lift, pointer cursor, 반전과 화살표가 없다.
4. Navigational card는 전체 영역이 하나의 link이며 rest·hover·focus·pressed 상태를 가진다.
5. Border는 section 시작, 필수 control boundary와 interaction state에만 쓴다.
6. Mobile은 desktop 축소판이 아니라 동일한 정보 우선순위의 재구성이다.
7. Normal text는 WCAG AA 4.5:1, large text와 필수 UI 경계·focus는 3:1 이상이어야 한다.
8. 색만으로 상태와 의미를 전달하지 않는다.
9. Registry reference는 candidate일 뿐이며 license, dependency, keyboard, focus, reduced motion을 검토하기 전에는 approved가 아니다.
10. 공통 UI의 의미와 동작은 시스템이, 데이터·업무 로직과 콘텐츠의 맥락은 제품이 소유한다.

## Interaction and responsive contracts

- 모든 interactive family는 light·dark 각각의 rest, hover, active, focus-visible, disabled를 설명한다. API에 없는 상태는 지원하지 않음을 명시한다.
- Motion은 150–220ms의 짧은 feedback에 한정하며 `prefers-reduced-motion`에서 제거한다. 44px 기본 target을 유지한다.
- Border보다 간격, 정렬, surface 차이를 먼저 사용한다.
- 작은 화면에서도 brand thesis, 실제 evidence와 핵심 action을 유지한다. Heading grid·token table·component specimen은 재구성하고, 상세 계약·보조 설명은 접을 수 있다. 제품 전용 사례·긴 migration guide는 뒤로 배치한다.
- 320px과 390px에서 가로 overflow, 한국어 줄바꿈, focus 순서와 touch target을 확인한다.
- 외부 primitive나 registry component는 native semantic HTML로 해결할 수 있는지 먼저 검토한다. License, dependency, keyboard, focus, reduced motion, responsive behavior를 확인한 뒤 PIP token과 API에 맞게 소유한다.

## Color contracts

- Primitive는 neutral, kiwi, semantic status 세 family로 분리한다.
- `kiwi-signal`은 brand field이고 success가 아니다.
- Component는 primitive hex를 직접 고르지 않고 semantic role만 사용한다.
- Light와 dark는 같은 role을 유지하되 서로 다른 값을 매핑한다.
- 일반 text/background pair의 목표는 WCAG 2.2 AA 4.5:1이다. `scripts/check-design.mjs`는 지원하는 불투명 semantic pair를 측정하며, alpha·gradient·중첩 surface와 전체 접근성은 실제 렌더링에서 별도로 검증한다.
- Primary action의 hover·active와 disabled pair는 component 내부 조합이 아니라 semantic state token으로 관리한다.

## System layers

[DESIGN.md의 System flow](../DESIGN.md#system-flow)가 계층별 책임과 현재 구현 위치를 정의한다. Component는 primitive hex나 임의의 `color-mix()`로 상태를 만들지 않고 semantic state token을 사용한다.

## Component inventory

| Family | Components | Contract |
| --- | --- | --- |
| Controls | `Button`, `TextField`, `TextLink` | rest, hover, focus, disabled와 invalid 상태 |
| Feedback | `Badge`, `Callout` | neutral, brand와 status tone; text label 필수 |
| Editorial | `StaticCard`, `LinkedCard`, `SectionHeading`, `CollectionHeading` | 정보와 navigation affordance 분리 |
| Disclosure | `Disclosure` | Radix Collapsible 기반 keyboard behavior |

구현은 Radix behavior, shadcn 방식의 소유 가능한 component source, Tailwind-compatible semantic
token을 조합한다. 새 component는 카탈로그 specimen과 inventory를 같은 변경에서 추가한다.

## State ownership

| Family | Rest / hover / active | Focus-visible | Disabled / invalid |
| --- | --- | --- | --- |
| Primary Button | brand-field / brand-field-hover / brand-field-active, all with on-brand text | 2px focus token, separated from fill | disabled-surface + disabled-text |
| Secondary / ghost Button | neutral or transparent / control-hover / control-active | 2px focus token | disabled pair; no active action |
| Danger Button | error / error-hover / error-active with surface-raised foreground | 2px focus token | disabled pair |
| TextField | surface-raised + control-border; hover/active keep the same pair | 2px focus token | disabled pair; invalid uses error boundary and linked error text |
| TextLink | interactive / interactive-hover / interactive-active | 2px focus token | no disabled-link API; render plain text when unavailable |
| LinkedCard | tone pair / brand-soft + text / brand-field-active + on-brand; arrow inherits foreground | separated two-ring focus | no disabled-card API; use StaticCard when unavailable |
| Disclosure | same transparent/text pair; open state changes content and indicator | 2px focus token | no disabled prop in current API |

The website's primary-action matrix illustrates that family only. CSS and actual rendered contexts determine final contrast; nested content must not override its foreground contract without rechecking.

## Verification and repository surfaces

- 필수 control boundary는 장식용 border와 분리해 3:1 gate로 검증한다.
- LinkedCard는 tone별 rest와 theme별 hover·active에서 글자와 화살표의 foreground를 함께 유지한다.
- TextField는 id 생략 시 고유 id를 생성하고 hint/error와 외부 aria-describedby를 연결한다.
- Button은 기본 type=button이며 form 제출은 명시적으로 type=submit을 선택한다.
- Reduced motion은 개별 UI package에서도 적용되며 docs의 global CSS에 의존하지 않는다.
- [Repository surfaces](repository-surfaces.md)는 README·release artwork의 브랜드 적용 계약이다.

## Governance

각 계층의 책임과 구현 상태를 명확히 기록한다. 외부 자료는 참고 근거이며 PIP의 시각적 기준을 대신하지 않는다.

- 새 시각적 값은 기존 semantic role로 표현할 수 있는지 먼저 확인한다. 실제 사용 사례에서 새 역할이 필요하면 token 후보로 검토한다. 사용 횟수나 소비 제품 수를 충족해야만 제안할 수 있는 것은 아니다.
- Component가 새로운 interaction을 만들면 light·dark의 rest·hover·focus·pressed·disabled matrix를 함께 작성한다.
- Pattern은 공통으로 사용할 구성과 판단 근거를 담고, 제품 전용 데이터·업무 로직은 포함하지 않는다.
- Core token 변경은 docs, package와 실제 consumer visual QA를 같은 변경 단위에서 검토한다.
- 외부 자료와 구현 상태는 `reference → candidate → approved → implemented` 순서로 기록한다.
- 새 interactive family는 light·dark의 rest, hover, active, focus-visible, disabled 표를 문서에 추가한다.

사용 중 발견한 개선은 [기여 흐름](../CONTRIBUTING.md#사용에서-개선으로)으로 연결한다. 새로운 컴포넌트·조합의 판단 근거는 관련 계약에 남기고, 원칙 자체의 변경은 [DESIGN.md](../DESIGN.md#원칙을-발전시키는-방법)에서 다룬다.
