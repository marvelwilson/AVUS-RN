import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/components/Themed";

interface Props {
  title: string;
  amount: string;
  time: string;
  incoming?: boolean;
}

export default function TransactionRow({
  title,
  amount,
  time,
  incoming,
}: Props) {
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const border = useThemeColor({}, "border");

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: border,
        },
      ]}
    >
      <View style={styles.left}>
        <View style={styles.icon}>
          {incoming ? (
            <ArrowDownLeft color="#22c55e" size={20} />
          ) : (
            <ArrowUpRight color="#ef4444" size={20} />
          )}
        </View>

        <View>
          <Text style={[styles.title, { color: text }]}>
            {title}
          </Text>

          <Text style={[styles.time, { color: sub }]}>
            {time}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color: incoming ? "#22c55e" : text,
          },
        ]}
      >
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: 14,
  },

  title: {
    fontWeight: "600",
    fontSize: 15,
  },

  time: {
    marginTop: 3,
    fontSize: 12,
  },

  amount: {
    fontWeight: "700",
    fontSize: 15,
  },
});