import { themeControlMarkup } from "@whitekiwi/ui/theme";

export function ThemeSpecimens() {
  return (["light", "dark"] as const).map((theme) => (
    <div
      className="docs-theme-specimen docs-theme-preview"
      data-theme={theme}
      key={theme}
      title={`${theme} · 기본 아이콘 정적 미리보기`}
      inert
    >
      <header>
        <span>PIP · {theme.toUpperCase()}</span>
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: shared package markup with fixed specimen IDs and themes
          dangerouslySetInnerHTML={{
            __html: themeControlMarkup({
              id: `docs-theme-${theme}`,
              theme,
            }),
          }}
        />
      </header>
    </div>
  ));
}
