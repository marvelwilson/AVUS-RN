import { router } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

import { magic } from "../store/MagicAuth";
import { useAuthStore } from "../store/auth";
import { useSettingsStore } from "../store/settings";
import {
  clearSessionExpiry,
  getSessionExpiry,
} from "../utils/secureStorage";

export function useSessionTimeout() {
  const sessionDuration = useSettingsStore(
    s => s.sessionDuration
  );

  useEffect(() => {
    let subscription: any;

    async function start() {
      const loggedIn =
        await magic.user.isLoggedIn();

      if (!loggedIn) return;

      //---------------------------------
      // Never
      //---------------------------------

      if (sessionDuration === 0) {
        subscription =
          AppState.addEventListener(
            "change",
            async state => {
              if (state === "background") {
                await clearSessionExpiry();
                useAuthStore.getState().logout();
              }
            }
          );

        return;
      }

      //---------------------------------
      // 1 / 2 days
      //---------------------------------

      const expiry =
        (await getSessionExpiry()) ?? 0;

      if (Date.now() >= expiry) {
        await magic.user.logout();
        useAuthStore.getState().logout();
        router.replace("/auth/signin");
      }
    }

    start();

    return () => {
      subscription?.remove();
    };
  }, [sessionDuration]);
}