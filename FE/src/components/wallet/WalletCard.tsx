import { StyleSheet, Text, View } from "react-native";

import Card from "../Card";

interface WalletCardProps {
  address: string | null;
  chain: string;
  portfolioValue?: string; // formatted e.g. "$1,234.56"
}

export default function WalletCard({
  address,
  chain,
  portfolioValue = "$0.00",
}: WalletCardProps) {
  const short = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Wallet not initialized";

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Portfolio</Text>
        <Text style={styles.chain}>{chain.toUpperCase()}</Text>
      </View>

      <Text style={styles.value}>{portfolioValue}</Text>

      <Text style={styles.address}>{short}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  chain: {
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    color: "#334155",
  },
  value: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: "#64748B",
    fontFamily: "SpaceMono",
  },
});
