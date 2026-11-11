# 0.2.6

## ThemeControl glyph size

ThemeControl의 hit target은 **44×44**로 유지하고 해·달 glyph는
**22px에서 16px**로 줄입니다. 16px glyph와 44×44 버튼의 조합이 새로운
공통 기준이며 22px 호환 shim은 제공하지 않습니다.

SVG의 `viewBox="0 0 24 24"`와 선택된 공식 theme-switch motion A는
변경하지 않습니다. Timing·easing, 광선 geometry·stroke-width 2·round cap,
light rest의 광선 scale, crescent mask와 고유 mask ID도 유지합니다.
공개 props·helper API는 바뀌지 않으며 소비 제품은 별도 크기 override 없이
새 glyph 크기를 사용합니다. 상세 기준은 [UI README](../packages/ui/README.md#screen-theme)와
[native patterns](native-patterns.md#screen-theme)에 있습니다.

## Package versions

`@whitekiwi/tokens`와 `@whitekiwi/ui`를 함께 **0.2.6**으로 올립니다.
Token 값은 변경하지 않았습니다. 버전 준비·로컬 pack 검증은 npm 게시,
카탈로그 배포와 소비 제품 적용을 의미하지 않습니다.
