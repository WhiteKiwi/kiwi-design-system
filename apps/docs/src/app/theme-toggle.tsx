"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <button
      className="docs-theme-toggle"
      onClick={() =>
        setTheme((value) => (value === "light" ? "dark" : "light"))
      }
      type="button"
    >
      {theme === "light" ? "DARK" : "LIGHT"} ↗
    </button>
  );
}
