/** GUI Challenges / Adam Argyle theme-switch, 82317d0d04c4f38ddf781439e282aa67ecb5b7f6.
 * Ported for PIP: unique mask IDs, 16px display, currentColor and motion readiness.
 * Upstream repository LICENSE: Apache-2.0; theme-switch/package.json: ISC.
 * See ../THIRD_PARTY.md and ../LICENSE-APACHE-2.0.
 */
export function themeGlyphMarkup(id: string): string {
  id = id.replace(/[^A-Za-z0-9_-]/g, "");
  return `<svg class="kiwi-theme__glyph" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24">
        <mask class="moon" id="${id}-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle class="sun" cx="12" cy="12" r="6" mask="url(#${id}-mask)" fill="currentColor" />
        <g class="sun-beams" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
         </g>
      </svg>`;
}
