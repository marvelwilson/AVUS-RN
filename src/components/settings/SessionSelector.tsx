import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import { useSettingsStore } from "@/src/store/settings";

const OPTIONS = [
  {
    label: "Never",
    value: 0,
  },
  {
    label: "1 Day",
    value: 1,
  },
  {
    label: "2 Days",
    value: 2,
  },
];

export default function SessionSelector() {
  const selected = useSettingsStore(
    (s) => s.sessionDuration
  );

  const setSelected = useSettingsStore(
    (s) => s.setSessionDuration
  );

  const text = useThemeColor({}, "text");
  const primary = "#4F46E5";

  return (
    <View style={styles.container}>
      {OPTIONS.map((item) => {
        const active =
          selected === item.value;

        return (
          <Pressable
            key={item.value}
            onPress={() =>
              setSelected(item.value as 0 | 1 | 2)
            }
            style={[
              styles.option,
              active && {
                backgroundColor: primary,
              },
            ]}
          >
            <Text
              style={{
                color: active
                  ? "#fff"
                  : text,
                fontWeight: "600",
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  option: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});