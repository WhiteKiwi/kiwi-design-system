# 0.2.5

## LinkedCard layout fix

LinkedCard의 자식을 `.kiwi-card-link__body` 안에서 StaticCard처럼 세로로
쌓습니다. 모바일에서 LINKED CARD label과 제목이 같은 줄에 겹치던 문제를
수정하며 OPEN ↗ 화살표는 하단에 남습니다.

## ThemeControl API removal

ThemeControl의 `variant="segmented"`는 **0.2.5에서 제거**되었습니다.
ThemeControl은 아이콘 전용입니다. `variant`·`label`·`hideLabel` props와
fieldset 속성을 제거하고 button 속성을 사용합니다. Vanilla
`themeControlMarkup()`에서도 `variant`·`name`·`legend`·`hideLegend` 옵션과
radio markup·binding을 제거했습니다. 호출부에서 제거된 props·옵션을 지우고
아이콘 버튼을 사용하세요. 하위 호환 shim은 제공하지 않습니다.

`commitThemePreference(key, "auto")`는 기기 설정으로 돌아가는 programmatic
reset으로 유지합니다. 헤더 control에는 reset UI가 없습니다.
`SegmentedControl`과 독립 `.kiwi-segmented*` 스타일은 변경하지 않습니다.
아이콘의 접근성 이름, bootstrap, 저장소 키, canvas 색상과 motion 계약은
유지합니다. 상세 사용법은 [UI README](../packages/ui/README.md#screen-theme)와
[native patterns](native-patterns.md#screen-theme)에 있습니다.

## Package versions

`@whitekiwi/tokens`와 `@whitekiwi/ui`를 함께 **0.2.5**로 올립니다.
Token 값은 변경하지 않았습니다. 버전 준비·로컬 pack 검증은 npm 게시,
카탈로그 배포와 소비 제품 적용을 의미하지 않습니다.
