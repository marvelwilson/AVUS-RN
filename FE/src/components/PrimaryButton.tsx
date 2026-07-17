import { Pressable, StyleSheet, Text } from "react-native";

import { useThemeColor } from "./Themed";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({ title, onPress, disabled = false }: Props) {
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");

  return (
    <Pressable disabled={disabled} style={[styles.button, { borderColor, opacity: disabled ? 0.5 : 1 }]} onPress={onPress}>
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
});
