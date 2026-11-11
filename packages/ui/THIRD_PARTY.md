# Third-party notice

The sun-and-moon SVG and motion in `src/theme-glyphs.ts` and `src/styles.css`
(and their built output) are ported from GUI Challenges / Adam Argyle,
[theme-switch](https://github.com/argyleink/gui-challenges/tree/82317d0d04c4f38ddf781439e282aa67ecb5b7f6/theme-switch),
commit `82317d0d04c4f38ddf781439e282aa67ecb5b7f6`.

Upstream's repository LICENSE is Apache-2.0, reproduced in
[LICENSE-APACHE-2.0](LICENSE-APACHE-2.0). Its `theme-switch/package.json` declares
ISC; these are inconsistent upstream metadata, and both facts are preserved here.

WhiteKiwi modified the port for unique mask IDs, a 16px display within a 44px
button, inherited currentColor without hover recoloring, resolved-theme selectors,
inline Open Props easing values, and motion readiness after initial theme sync.
The original 24×24 geometry and motion durations are retained. No Open Props
runtime dependency is included. WhiteKiwi's package remains MIT; this notice does
not relicense the upstream material.
