# Kiwi Design Guidelines v0.1

## Thesis

**Quiet canvas. Electric kiwi. Human evidence.**

- White는 여백과 빠른 이해를 만든다.
- Black은 정확성과 편집 구조를 만든다.
- Kiwi green은 호기심과 추진력이 필요한 순간에만 점화한다.
- UI는 evidence보다 먼저 보이지 않는다.

## Release contracts

1. 한 viewport에서는 큰 초록 면, 큰 초록 글자, 큰 초록 수치 중 하나만 선택한다.
2. 일반 화면은 약 90%의 neutral area를 목표로 한다.
3. Static card에는 lift, pointer cursor, 반전과 화살표가 없다.
4. Navigational card는 전체 영역이 하나의 link이며 rest·hover·focus·pressed 상태를 가진다.
5. Border는 section 시작, 필수 control boundary와 interaction state에만 쓴다.
6. Mobile은 desktop 축소판이 아니라 동일한 정보 우선순위의 재구성이다.
7. Normal text는 WCAG AA 4.5:1, large text와 필수 UI는 3:1 이상이어야 한다.
8. 색만으로 상태와 의미를 전달하지 않는다.

## Governance

- 새 raw value가 두 번 등장하면 token 후보, 세 번 등장하면 semantic role로 검토한다.
- Component가 새로운 interaction을 만들면 light·dark의 rest·hover·focus·pressed·disabled matrix를 함께 작성한다.
- Portfolio-specific story layout은 두 번째 consumer가 생기기 전까지 core component로 승격하지 않는다.
- Core token 변경은 docs, package와 실제 consumer visual QA를 같은 변경 단위에서 검토한다.

