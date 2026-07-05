import { ReactNode } from "react";
import {
    Platform,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import { BlurView } from "expo-blur";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function GlassCard({
  children,
  style,
}: Props) {
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={45}
        tint="default"
        style={[styles.card, style]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: card,
          borderColor: border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 6,
    overflow: "hidden",
  },
});