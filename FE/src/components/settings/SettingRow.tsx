import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import { ChevronRight } from "lucide-react-native";

interface Props {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
}

export default function SettingRow({
  title,
  subtitle,
 icon,
  right,
  onPress,
}: Props) {
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const border = useThemeColor({}, "border");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.left}>
        {icon}

        <View style={{ marginLeft: icon ? 14 : 0 }}>
          <Text
            style={[
              styles.title,
              {
                color: text,
              },
            ]}
          >
            {title}
          </Text>

          {!!subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: sub,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {right ?? (
        <ChevronRight
          size={18}
          color="#9CA3AF"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 3,
    opacity: 0.75,
  },
});