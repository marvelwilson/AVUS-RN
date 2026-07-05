import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Card from "./Card";
import { useThemeColor } from "./Themed";
import { useSettingsStore, type ThemePref } from "@/src/store/settings";

type Option = {
  value: ThemePref;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const OPTIONS: Option[] = [
  { value: "system", label: "System", icon: "phone-portrait-outline" },
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
];

export default function ThemeToggle() {
  const pref = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "subtext");
  const cardBg = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");

  return (
    <Card style={{ marginTop: 16 }}>
      <Text style={[styles.title, { color: textColor }]}>Appearance</Text>
      <Text style={[styles.subtitle, { color: subtextColor }]}>
        Choose how AVUS looks on this device.
      </Text>

      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const isActive = pref === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setTheme(opt.value)}
              style={[
                styles.option,
                {
                  backgroundColor: isActive ? primary : cardBg,
                  borderColor: isActive ? primary : borderColor,
                },
              ]}
            >
              <Ionicons
                name={opt.icon}
                size={22}
                color={isActive ? (pref === "dark" ? "#000" : "#fff") : textColor}
              />
              <Text
                style={[
                  styles.label,
                  { color: isActive ? (pref === "dark" ? "#000" : "#fff") : textColor },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});
