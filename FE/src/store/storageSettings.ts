import { storage } from "./mmkv";

export const SettingsStorage = {
  getTheme() {
    return (
      storage.getString("theme") ??
      "system"
    ) as "system" | "light" | "dark";
  },

  setTheme(theme: "system" | "light" | "dark") {
    storage.set("theme", theme);
  },

  getFanMuted() {
    return storage.getBoolean("fanMuted") ?? false;
  },

  setFanMuted(value: boolean) {
    storage.set("fanMuted", value);
  },

  getSessionDuration() {
    const value = storage.getNumber("sessionDuration");
    return value === 3 || value === 7 ? value : 1;
  },

  setSessionDuration(value: 1 | 3 | 7) {
    storage.set("sessionDuration", value);
  },

  hasPin() {
    return storage.getBoolean("hasPin") ?? false;
  },

  setHasPin(value: boolean) {
    storage.set("hasPin", value);
  },

  getHideBalance() {
    return storage.getBoolean("hideBalance") ?? false;
  },

  setHideBalance(value: boolean) {
    storage.set("hideBalance", value);
  },

  getLanguage() {
    return storage.getString("language") ?? "en";
  },

  setLanguage(lang: string) {
    storage.set("language", lang);
  },

  getSponsoredGas() {
    return storage.getBoolean("sponsoredGas") ?? true;
  },

  setSponsoredGas(value: boolean) {
    storage.set("sponsoredGas", value);
  },
};
