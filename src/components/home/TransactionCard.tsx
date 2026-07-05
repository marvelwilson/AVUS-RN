import { StyleSheet, Text, View } from "react-native";

import TransactionRow from "./TransactionRow";

import { useThemeColor } from "@/src/components/Themed";

export default function TransactionCard() {
  const text = useThemeColor({}, "text");
  const card = useThemeColor({}, "card");

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: card,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: text,
          },
        ]}
      >
        Recent Transactions
      </Text>

      <TransactionRow
        title="Received USDC"
        amount="+250"
        time="2 min ago"
        incoming
      />

      <TransactionRow
        title="Sent ETH"
        amount="-0.25"
        time="10 min ago"
      />

      <TransactionRow
        title="Swap ETH → USDC"
        amount="Completed"
        time="Today"
      />

      <TransactionRow
        title="Bought ETH"
        amount="$120"
        time="Yesterday"
        incoming
      />

      <TransactionRow
        title="Deposit"
        amount="+500"
        time="2 days ago"
        incoming
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 40,
  },

  title: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },
});