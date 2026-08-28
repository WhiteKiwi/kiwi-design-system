"use client";

import { useEffect, useState } from "react";

type Theme = "auto" | "light" | "dark";

const themes: Theme[] = ["auto", "light", "dark"];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("auto");

  useEffect(() => {
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
      return;
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <fieldset className="docs-theme-toggle">
      <legend className="docs-sr-only">Theme</legend>
      {themes.map((value) => (
        <button
          aria-pressed={theme === value}
          key={value}
          onClick={() => setTheme(value)}
          type="button"
        >
          {value.toUpperCase()}
        </button>
      ))}
    </fieldset>
  );
}
