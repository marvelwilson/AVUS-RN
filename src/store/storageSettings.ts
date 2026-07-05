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
    return (storage.getNumber("sessionDuration") ??
      1) as 0 | 1 | 2;
  },

  setSessionDuration(value: 0 | 1 | 2) {
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
  }
};