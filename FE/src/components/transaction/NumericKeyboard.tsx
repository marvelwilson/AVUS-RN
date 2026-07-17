import { StyleSheet, View } from "react-native";

import NumberPad from "./NumberPad";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function NumericKeyboard({
  value,
  onChange,
}: Props) {
  function handleKeyPress(key: string) {
    // Prevent multiple decimal points
    if (key === "." && value.includes(".")) {
      return;
    }

    // Prevent leading zeroes
    if (value === "0" && key !== ".") {
      onChange(key);
      return;
    }

    // Max 9 digits before decimal
    const whole = value.split(".")[0];

    if (!value.includes(".") && whole.length >= 9) {
      return;
    }

    // Max 6 decimal places
    if (value.includes(".")) {
      const decimals = value.split(".")[1];

      if (decimals.length >= 6) {
        return;
      }
    }

    if (value === "" && key === ".") {
      onChange("0.");
      return;
    }

    onChange(value + key);
  }

  function handleDelete() {
    onChange(value.slice(0, -1));
  }

  return (
    <View style={styles.container}>
      <NumberPad
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 12,
  },
});