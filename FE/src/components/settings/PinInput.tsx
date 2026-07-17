import { useEffect, useRef } from "react";
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";

interface Props {
  value: string;
  onChange: (pin: string) => void;
  length?: number;
  autoFocus?: boolean;
}

export default function PinInput({
  value,
  onChange,
  length = 4,
  autoFocus = true,
}: Props) {
  const inputRef = useRef<TextInput>(null);

  const border = useThemeColor({}, "border");
  const text = useThemeColor({}, "text");
  const card = useThemeColor({}, "card");

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, []);

  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => inputRef.current?.focus()}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(txt) =>
          onChange(txt.replace(/\D/g, "").slice(0, length))
        }
        keyboardType="number-pad"
        maxLength={length}
        caretHidden
        secureTextEntry
        style={styles.hiddenInput}
      />

      <View style={styles.boxContainer}>
        {Array.from({ length }).map((_, index) => {
          const filled = value[index];

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  borderColor: border,
                  backgroundColor: card,
                },
              ]}
            >
              {filled && (
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: text,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },

  hiddenInput: {
    position: "absolute",
    opacity: 0,
  },

  boxContainer: {
    flexDirection: "row",
    gap: 14,
  },

  box: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});