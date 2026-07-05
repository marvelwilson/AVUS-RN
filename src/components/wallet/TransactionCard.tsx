import { StyleSheet, Text, View } from "react-native";

import Card from "../Card";
// import { Transaction } from "../../services/blockchain/transactions";

interface Props {
  tx: any;
}

export default function TransactionCard({ tx }: Props) {
  const isOut = tx.direction === "out";
  const sign = isOut ? "-" : "+";
  const color = isOut ? "#334155" : "#16a34a";

  const date = new Date(tx.timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const shortAddr = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Card style={styles.card} padded={false}>
      <View style={styles.inner}>
        <View>
          <Text style={styles.asset}>{tx.asset}</Text>
          <Text style={styles.addr}>
            {isOut ? "To " : "From "}
            {shortAddr(isOut ? tx.to : tx.from)}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.amount, { color }]}>
            {sign}
            {tx.value}
          </Text>
          <Text style={styles.date}>
            {tx.status === "pending" ? "Pending" : date}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  asset: {
    fontWeight: "700",
    fontSize: 16,
  },
  addr: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
  },
  amount: {
    fontWeight: "700",
    fontSize: 16,
  },
  date: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
});
