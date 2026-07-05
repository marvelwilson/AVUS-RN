import { Image, StyleSheet, useColorScheme, View } from "react-native";

import AuthStatusCard from "@/src/components/AuthStatusCard";
import { useThemeColor } from "@/src/components/Themed";
import { useSettingsStore } from "@/src/store/settings";

export default function AuthLoading() {
  const background = useThemeColor({}, "background");
  const pref = useSettingsStore((s) => s.theme);
  const systemTheme = useColorScheme();

  const theme =
    pref === "system"
      ? systemTheme
      : pref;
  const logoImage =
    theme === "dark"
      ? require("@/assets/images/icon-white.png")
      : require("@/assets/images/icon-black.png");
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <Image
        source={logoImage}
        style={styles.logo}
      />

      <AuthStatusCard
        loading
        title="Checking Session"
        description="Securely verifying your wallet..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 40,
  },
});