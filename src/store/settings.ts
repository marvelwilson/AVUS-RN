import { create } from "zustand";

import { saveSessionExpiry } from "@/src/utils/secureStorage";
import { SettingsStorage } from "./storageSettings";


export type SessionDuration = 0 | 1 | 2;

export type ThemePref =
  | "system"
  | "light"
  | "dark";

interface SettingsState {
  theme: ThemePref;

  fanMuted: boolean;

  hasPin: boolean;

  sessionDuration: SessionDuration;

  setTheme(theme: ThemePref): Promise<void>;

  setFanMuted(value: boolean): void;

  setHasPin(value: boolean): void;

  setSessionDuration(
    value: SessionDuration
  ): Promise<void>;
}

export const useSettingsStore =
create<SettingsState>((set) => ({

  theme: SettingsStorage.getTheme(),

  fanMuted: SettingsStorage.getFanMuted(),

  hasPin: SettingsStorage.hasPin(),

  sessionDuration:
    SettingsStorage.getSessionDuration(),

  async setTheme(theme) {

    SettingsStorage.setTheme(theme);

    set({ theme });

  },

  setFanMuted(value) {

    SettingsStorage.setFanMuted(value);

    set({
      fanMuted: value,
    });

  },

  setHasPin(value) {

    SettingsStorage.setHasPin(value);

    set({
      hasPin: value,
    });

  },

  async setSessionDuration(value) {

    SettingsStorage.setSessionDuration(value);

    switch (value) {

      case 0:

        await saveSessionExpiry(0);

        break;

      case 1:

        await saveSessionExpiry(
          Date.now() + 86400000
        );

        break;

      case 2:

        await saveSessionExpiry(
          Date.now() + 172800000
        );

        break;
    }

    set({
      sessionDuration: value,
    });

  },

}));