"use client";

import { SegmentedControl } from "@whitekiwi/ui";
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
    <SegmentedControl
      className="docs-theme-toggle"
      label="Theme"
      hideLabel
      value={theme}
      onValueChange={(value) => setTheme(value as Theme)}
      options={themes.map((value) => ({ value, label: value.toUpperCase() }))}
    />
  );
}
