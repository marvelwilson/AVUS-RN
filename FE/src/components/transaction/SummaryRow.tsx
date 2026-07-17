import { useThemeColor } from "@/src/components/Themed";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon?: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
  last?: boolean;
};

export default function SummaryRow({
  icon,
  label,
  value,
  valueColor,
  bold = false,
  last = false,
}: Props) {
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const border = useThemeColor({}, "border");

  return (
    <View
      style={[
        styles.row,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: border,
        },
      ]}
    >
      <View style={styles.left}>
        {icon}
        <Text
          style={[
            styles.label,
            {
              color: subtext,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <Text
        style={[
          styles.value,
          {
            color: valueColor || text,
            fontWeight: bold ? "700" : "500",
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  label: {
    fontSize: 15,
  },

  value: {
    fontSize: 15,
  },
});