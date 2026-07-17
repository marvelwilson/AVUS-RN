

import { useColorScheme } from "@/src/components/useColorScheme";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useEffect } from "react";


import AppProvider from "@/src/providers/AppProvider";
import { magic } from "@/src/sdk/magic/magic";
import { useSettingsStore } from "@/src/store/settings";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary 
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(protected)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 450, fade: true });

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const systemTheme = useColorScheme();

  const pref = useSettingsStore((s) => s.theme);

  const colorScheme =
    pref === "system"
      ? systemTheme
      : pref;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>

        <AppProvider>

          <StatusBar
            style={
              colorScheme === "dark"
                ? "light"
                : "dark"
            }
          />
          <Stack>
            <Stack.Screen
              name="index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="onboarding"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="auth/signin"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="auth/lock"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(protected)"
              options={{ headerShown: false }}
            />
          </Stack>

        </AppProvider>

        <magic.Relayer />

      </ThemeProvider>

    </GestureHandlerRootView>
  );
}
