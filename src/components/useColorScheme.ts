import { useColorScheme as useColorSchemeCore } from "react-native";

import { useSettingsStore } from "@/src/store/settings";

/**
 * Returns the effective color scheme ("light" | "dark").
 * Respects the user preference stored in settings (system / light / dark).
 * Falls back to system when preference is "system".
 * This powers the entire app theme toggle.
 */
export function useColorScheme(): "light" | "dark" {
  const pref = useSettingsStore((s) => s.theme);
  const system = useColorSchemeCore();

  if (pref === "system") {
    return system === "dark" ? "dark" : "light";
  }
  return pref;
}
