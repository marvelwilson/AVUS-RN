import { Delete } from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";

type Props = {
  onKeyPress: (value: string) => void;
  onDelete: () => void;
};

const keys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "delete"],
];

export default function NumberPad({
  onKeyPress,
  onDelete,
}: Props) {
  const text = useThemeColor({}, "text");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={styles.row}
        >
          {row.map((item) => (
            <Pressable
              key={item}
              style={({ pressed }) => [
                styles.key,
                {
                  backgroundColor:
                    pressed ? primary : card,
                },
              ]}
              onPress={() =>
                item === "delete"
                  ? onDelete()
                  : onKeyPress(item)
              }
            >
              {item === "delete" ? (
                <Delete
                  size={24}
                  color={text}
                />
              ) : (
                <Text
                  style={[
                    styles.keyText,
                    {
                      color: text,
                    },
                  ]}
                >
                  {item}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    gap: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  key: {
    width: 90,
    height: 64,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  keyText: {
    fontSize: 28,
    fontWeight: "600",
  },
});