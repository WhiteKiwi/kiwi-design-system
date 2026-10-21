# PIP Design Contract

PIP의 미션과 대표 슬로건은 [README](README.md#미션)에 있습니다. 이 문서는 미션을 설계 원칙과 계층별 책임으로 연결합니다. 구체적인 수치·상태·검증 조건은 [가이드라인](docs/guidelines.md)이 소유합니다.

## 설계 원칙

### 1. 반복을 줄인다

기존 토큰과 컴포넌트의 조합으로 현재 필요를 먼저 해결한다. 공통으로 유용한 개선은 시스템에 반영해 다음 작업에서도 사용할 수 있게 한다. 데이터·업무 로직과 제품에만 필요한 구성은 제품이 소유한다.

새 옵션이나 계층은 실제 사용 사례로 설명한다. 하나의 제품에서 드러난 필요로도 개선할 수 있으며, API의 범위와 유지 비용을 함께 검토한다.

### 2. 이해와 행동을 명확하게 한다

콘텐츠와 실제 결과가 먼저 읽혀야 한다. 정보의 우선순위를 간격과 정렬로 드러내고, 강조는 중요한 행동에 집중한다. 읽는 표면과 누를 수 있는 표면을 구분하며 상태와 포커스를 숨기지 않는다.

시각적 단순함을 위해 label, 상태 설명, 키보드 접근을 제거하지 않는다. 색 외의 단서도 함께 제공한다.

### 3. 같은 의미를 유지한다

같은 역할은 같은 semantic token과 동작 계약을 사용한다. Light·dark는 배경에 맞는 값을 갖고, 작은 화면은 같은 정보 우선순위로 다시 구성한다.

제품의 콘텐츠와 구성이 달라도 공통 UI의 의미는 유지한다. 새 상태는 스타일, 문서, 카탈로그 예제와 검증을 함께 갖춘다.

## Atmosphere

**Quiet canvas. Electric kiwi. Human evidence.**

이 문구는 PIP의 시각적 분위기를 설명한다. White는 여백과 빠른 이해를, black은 정확성과 편집 구조를 만든다. Kiwi green은 행동과 기억이 필요한 순간에 사용한다. UI는 실제 작업과 근거보다 먼저 보이지 않는다.

## System flow

```text
Foundation → Primitive → Component → Pattern → Page
```

| 계층 | 책임 | 현재 위치 |
| --- | --- | --- |
| Foundation | 색·서체·간격·radius·motion의 시각적 역할과 테마 | [theme.css](packages/tokens/src/theme.css) |
| Primitive | 키보드·포커스·펼치기 같은 동작; native HTML을 우선하고 필요한 경우 Radix 사용 | [UI source](packages/ui/src)와 패키지 의존성 |
| Component | 토큰과 동작을 공개 API·명시적 상태로 묶기 | [UI exports](packages/ui/src/index.ts), [styles.css](packages/ui/src/styles.css) |
| Pattern | 공통 정보 구조와 조합, 선택 이유 | [카탈로그](apps/docs/src/app/page.tsx)의 예제; 독립 패키지는 없음 |
| Page | 실제 콘텐츠·데이터·업무 로직과 제품 맥락 | 각 제품 저장소; 이 저장소는 [문서 앱](apps/docs) |

위 계층은 책임 구분이며 각각 새 패키지를 만들라는 규칙이 아니다. Component와 Page는 기존 semantic token을 사용한다. 새 시각적 역할이 필요하면 Foundation부터 검토한다.

## 원칙을 발전시키는 방법

제품에서 발견한 문제와 그 해결 이유를 [기여 흐름](CONTRIBUTING.md#사용에서-개선으로)으로 돌려보낸다. 새 컴포넌트·상태·조합은 구현과 사용 예제, 검증을 함께 남긴다. 반복해서 참고할 판단은 해당 계약에 이유와 적용 범위를 기록한다.

기존 원칙으로 설명되는 선택은 그 원칙의 예제나 세부 계약을 보강한다. 새로운 원칙이 필요하면 해결하는 문제, 기존 원칙으로 부족한 점, 적용 범위와 예외를 PR에서 검토한다. 제안 상태의 원칙을 확정된 계약이나 구현 완료로 표시하지 않는다.

README와 release artwork에는 [저장소 표면 계약](docs/repository-surfaces.md)을 적용한다. 외부 시스템은 [참고 근거](references/README.md)이며 PIP의 시각적 기준을 대신하지 않는다. 문서 소유 위치는 [문서 안내](docs/README.md), 개발과 검증은 [기여 안내](CONTRIBUTING.md)를 따른다.
