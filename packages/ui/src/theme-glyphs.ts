/** Phosphor Regular placeholder, MIT, version 2.1.1, pending designer pick.
 * Sun/moon proportions adapted to one masked circle; glyph + morph are provisional.
 * https://github.com/phosphor-icons/core
 */
export function themeGlyphMarkup(id: string): string {
  id = id.replace(/[^A-Za-z0-9_-]/g, "");
  return `<svg class="kiwi-theme__glyph" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" aria-hidden="true" focusable="false">
  <defs>
    <mask id="${id}-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="320" height="256">
      <rect width="320" height="256" fill="white" />
      <circle class="kiwi-theme__occluder" cx="304" cy="90.667" r="56" fill="black" />
    </mask>
    <clipPath id="${id}-clip"><circle cx="128" cy="128" r="56" /></clipPath>
  </defs>
  <g class="kiwi-theme__core" fill="none" stroke="currentColor" stroke-width="16">
    <circle cx="128" cy="128" r="56" mask="url(#${id}-mask)" />
    <g clip-path="url(#${id}-clip)"><circle class="kiwi-theme__occluder" cx="304" cy="90.667" r="56" /></g>
  </g>
  <g class="kiwi-theme__rays" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round">
    <path d="M128 16v24m0 176v24M16 128h24m176 0h24M48 48l16 16m128 128 16 16M48 208l16-16M192 64l16-16" />
  </g>
</svg>`;
}
