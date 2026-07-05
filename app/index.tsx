import { router } from "expo-router";
import { useEffect } from "react";

import AuthLoading from "./auth/loading";

import { useAuthStore } from "@/src/store/auth";
import { magic } from "@/src/store/MagicAuth";
import { useSettingsStore } from "@/src/store/settings";
import { emailToUsername } from "@/src/utils/EmailtoUsername";
import { getPin, getSessionExpiry } from "@/src/utils/secureStorage";
import { isFirstLaunch } from "@/src/utils/storage";

export default function Index() {
  const theme = useSettingsStore((s) => s.theme);
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    // First launch
    const firstLaunch = await isFirstLaunch();

    if (firstLaunch) {
      router.dismissAll();
      router.replace("/onboarding");
      return;
    }

    // Logged in?
    const loggedIn = await magic.user.isLoggedIn();

    if (!loggedIn) {
      router.dismissAll();
      router.replace("/auth/signin");
      return;
    }

    // Session valid?
    const expiry = await getSessionExpiry();

    if (!expiry) {
      router.dismissAll();
      router.replace("/auth/signin");
      return;
    }

    if (expiry !== 0 && Date.now() >= expiry) {
      await magic.user.logout();

      router.dismissAll();
      router.replace("/auth/signin");
      return;
    }

    const metadata = await magic.user.getInfo();
    const username = emailToUsername(metadata.email ?? '');

    login({
      id: metadata.issuer ?? '',
      name: username,
      email: metadata.email ?? "",
    });
    // Check PIN
    const pin = await getPin();

    if (pin) {
      router.dismissAll();
      router.replace("/auth/lock");
      return;
    }


    if (!pin) {
      router.dismissAll();
      router.replace("/(protected)/settings");
      return;
    }
  }

  if (!theme) {
    return null;
  }

  return <AuthLoading />;
}