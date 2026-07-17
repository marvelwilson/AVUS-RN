import { create } from "zustand";

import { saveSessionExpiry } from "@/src/utils/secureStorage";
import { SettingsStorage } from "./storageSettings";


export type SessionDuration = 1 | 3 | 7;

export type ThemePref =
  | "system"
  | "light"
  | "dark";

interface SettingsState {
  theme: ThemePref;

  fanMuted: boolean;

  hasPin: boolean;

  sessionDuration: SessionDuration;

  sponsoredGas: boolean;
  gasSponsorshipEligible: boolean;

  setTheme(theme: ThemePref): Promise<void>;

  setFanMuted(value: boolean): void;

  setSponsoredGas(value: boolean): void;
  setGasSponsorshipEligible(value: boolean): void;

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

  sponsoredGas: SettingsStorage.getSponsoredGas(),
  gasSponsorshipEligible: false,

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

  setSponsoredGas(value) {
    if (value && !useSettingsStore.getState().gasSponsorshipEligible) return;
    SettingsStorage.setSponsoredGas(value);
    set({ sponsoredGas: value });
  },

  setGasSponsorshipEligible(value) {
    if (!value) SettingsStorage.setSponsoredGas(false);
    set(state => ({ gasSponsorshipEligible: value, sponsoredGas: value ? state.sponsoredGas : false }));
  },

  setHasPin(value) {

    SettingsStorage.setHasPin(value);

    set({
      hasPin: value,
    });

  },

  async setSessionDuration(value) {

    SettingsStorage.setSessionDuration(value);

    await saveSessionExpiry(Date.now() + value * 86400000);

    set({
      sessionDuration: value,
    });

  },

}));
