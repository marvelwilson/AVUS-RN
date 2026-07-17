import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import Card from "../Card";
// import { Transaction } from "../../services/blockchain/transactions";

interface Props {
  tx: any;
}

export default function TransactionCard({ tx }: Props) {
  const isOut = tx.type === "SEND";
  const sign = isOut ? "-" : "+";
  const color = isOut ? "#334155" : "#16a34a";

  const date = new Date(tx.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const shortAddr = (addr?: string) =>
    !addr ? "Unknown wallet" :
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Card style={styles.card} padded={false}>
      <Pressable style={({ pressed }) => [styles.inner, { opacity: pressed ? 0.65 : 1 }]} onPress={() => router.push({ pathname: "/transaction/[id]", params: { id: tx._id } })}>
        <View>
          <Text style={styles.asset}>{tx.token}</Text>
          <Text style={styles.addr}>
            {isOut ? "To " : "From "}
            {shortAddr(isOut ? tx.recipient : tx.sender)}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.amount, { color }]}>
            {sign}
            {tx.amount} {tx.token}
          </Text>
          <Text style={styles.date}>
            {tx.status === "PENDING" || tx.status === "PROCESSING" ? "Pending" : tx.status === "FAILED" ? "Failed" : date}
          </Text>
        </View>
        <ChevronRight size={17} color="#94A3B8" />
      </Pressable>
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
