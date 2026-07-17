
import "react-native-reanimated";

import { router } from "expo-router";
import { useEffect } from "react";
import AuthLoading from "./auth/loading";

import AuthService from "@/src/services/auth.service";
import { useSettingsStore } from "@/src/store/settings";
import { getPin, getSessionExpiry } from "@/src/utils/secureStorage";
import { isFirstLaunch } from "@/src/utils/storage";

export default function Index() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    bootstrap();
  }, []);

  async function redirectAuthenticated() {
    const pin = await getPin();

    if (pin) {
      router.replace("/auth/lock");
      return;
    }

    router.replace("/(protected)/settings");
  }

  async function bootstrap() {
    try {
      /**
       * First Launch
       */
      if (isFirstLaunch()) {
        router.dismissAll();
        router.replace("/onboarding");
        return;
      }

      /**
       * Restore Session
       */
      const expiry = await getSessionExpiry();

      if (!expiry || Date.now() >= expiry) {
        await AuthService.logout();
        router.dismissAll();
        router.replace("/auth/signin");
        return;
      }

      const user = await Promise.race([
        AuthService.restoreSession(),
        new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 10000);
        }),
      ]);

      if (!user) {
        router.dismissAll();
        router.replace("/auth/signin");
        return;
      }

      /**
       * Session Expiry
       */
      await redirectAuthenticated();
    } catch (error) {
      console.error(error);

      void AuthService.logout().catch((logoutError) => {
        console.warn("Session cleanup failed during bootstrap.", logoutError);
      });

      router.dismissAll();
      router.replace("/auth/signin");
    }
  }

  if (!theme) {
    return null;
  }

  return <AuthLoading />;
}
