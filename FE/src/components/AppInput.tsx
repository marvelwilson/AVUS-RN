import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Pressable,
} from "react-native";

import { useThemeColor } from "./Themed";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  secure?: boolean; // enables toggle visibility
}

export default function AppInput({
  label,
  error,
  secure,
  style,
  ...rest
}: AppInputProps) {
  const [show, setShow] = useState(false);
  const isSecure = secure && !show;

  const textColor = useThemeColor({}, "text");
  const borderColor = error ? "#ef4444" : useThemeColor({}, "border");
  const bgColor = useThemeColor({}, "background");
  const subColor = useThemeColor({}, "subtext");

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: subColor }]}>{label}</Text> : null}

      <View style={styles.inputRow}>
        <TextInput
          {...rest}
          style={[
            styles.input,
            {
              color: textColor,
              backgroundColor: bgColor,
              borderColor,
            },
            style,
          ]}
          placeholderTextColor={subColor}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {secure ? (
          <Pressable onPress={() => setShow((s) => !s)} style={styles.toggle}>
            <Text style={{ color: subColor }}>{show ? "HIDE" : "SHOW"}</Text>
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  toggle: {
    position: "absolute",
    right: 14,
    padding: 6,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: "#ef4444",
  },
});
