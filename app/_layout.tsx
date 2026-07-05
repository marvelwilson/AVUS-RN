
import FanProvider from "@/src/components/fan/FanProvider";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import "react-native-get-random-values";
import "react-native-reanimated";
WebBrowser.maybeCompleteAuthSession();

import FanWakeWord from "@/src/components/fan/FanWakeWord";
import { magic } from "@/src/store/MagicAuth";
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



  useEffect(() => {
    FanWakeWord.start(() => {
      console.log("Hey FAN detected");
      // setListening(true);
    });

    return () => FanWakeWord.stop();
  }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <FanProvider>

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
        </FanProvider>

        <magic.Relayer />
      </ThemeProvider>

    </GestureHandlerRootView>
  );
}

