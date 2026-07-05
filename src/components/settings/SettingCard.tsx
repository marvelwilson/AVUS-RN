import { useThemeColor } from "@/src/components/Themed";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export default function SettingCard({
  children,
}: PropsWithChildren) {
  const background = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
          borderColor: border,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 4,
    overflow: "hidden",
    marginBottom: 22,
  },
});