import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import { useSettingsStore } from "@/src/store/settings";
import AuthService from "@/src/services/auth.service";

const OPTIONS = [
  {
    label: "1 Day",
    value: 1,
  },
  {
    label: "3 Days",
    value: 3,
  },
  {
    label: "7 Days",
    value: 7,
  },
];

export default function SessionSelector() {
  const selected = useSettingsStore(
    (s) => s.sessionDuration
  );

  const secondary = useThemeColor({}, "secondary");
  const text = useThemeColor({}, "text");

  return (
    <View style={styles.container}>
      {OPTIONS.map((item) => {
        const active =
          selected === item.value;

        return (
          <Pressable
            key={item.value}
            onPress={() => {
              void AuthService.updateSessionDuration(item.value as 1 | 3 | 7);
            }}
            style={[
              styles.option,
              active && {
                backgroundColor: secondary,
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
