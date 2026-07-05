import { create } from "zustand";
import { storage } from "./mmkv";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  login: (
    user: AuthUser,
    accessToken?: string,
    refreshToken?: string
  ) => void;

  logout: () => void;

  hydrate: () => void;
}

const KEYS = {
  USER: "user",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,

  hydrate: () => {
    try {
      const userString = storage.getString(KEYS.USER);

      const accessToken =
        storage.getString(KEYS.ACCESS_TOKEN) ?? null;

      const refreshToken =
        storage.getString(KEYS.REFRESH_TOKEN) ?? null;

      set({
        user: userString
          ? JSON.parse(userString)
          : null,

        isAuthenticated: !!userString,

        accessToken,
        refreshToken,
      });
    } catch (e) {
      console.log(e);
    }
  },

  login: (
    user,
    accessToken = "",
    refreshToken = ""
  ) => {

    storage.set(KEYS.USER, JSON.stringify(user));
    storage.set(KEYS.ACCESS_TOKEN, accessToken);
    storage.set(KEYS.REFRESH_TOKEN, refreshToken);

    set({
      user,
      isAuthenticated: true,
      accessToken,
      refreshToken,
    });
  },

  logout: () => {

    storage.remove(KEYS.USER);
    storage.remove(KEYS.ACCESS_TOKEN);
    storage.remove(KEYS.REFRESH_TOKEN);

    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    });
  },
}));