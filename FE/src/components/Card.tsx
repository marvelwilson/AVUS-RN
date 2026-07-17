import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useThemeColor } from "./Themed";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export default function Card({ children, style, padded = true }: CardProps) {
  const backgroundColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
        },
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  padded: {
    padding: 16,
  },
});
