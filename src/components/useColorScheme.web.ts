import { useEffect, useState } from "react";

import { useSettingsStore } from "@/src/store/settings";

/**
 * Web version of useColorScheme.
 * - Respects user theme preference from settings store ("system" | "light" | "dark").
 * - When "system", listens to prefers-color-scheme media query for live updates.
 * - Works together with the native version so the whole cross-platform app
 *   (web / iOS / Android) reacts to the theme toggle instantly.
 */
export function useColorScheme(): "light" | "dark" {
  const pref = useSettingsStore((s) => s.theme);
  const [systemPref, setSystemPref] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    if (pref !== "system" || typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      setSystemPref(e.matches ? "dark" : "light");
    };

    // Modern + legacy
    media.addEventListener?.("change", listener);
    media.addListener?.(listener);

    return () => {
      media.removeEventListener?.("change", listener);
      media.removeListener?.(listener);
    };
  }, [pref]);

  if (pref === "system") {
    return systemPref;
  }
  return pref;
}
