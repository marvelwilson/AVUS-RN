import { StyleSheet, Text, View } from "react-native";

import Card from "../Card";

interface Props {
  symbol: string;
  balance: string;
  name?: string;
  valueUsd?: string;
}

export default function AssetCard({ symbol, balance, name, valueUsd }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.symbol}>{symbol}</Text>
          {name ? <Text style={styles.name}>{name}</Text> : null}
        </View>
        <View style={styles.right}>
          <Text style={styles.balance}>{balance}</Text>
          {valueUsd ? <Text style={styles.usd}>{valueUsd}</Text> : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  symbol: {
    fontSize: 18,
    fontWeight: "700",
  },
  name: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
  },
  balance: {
    fontSize: 16,
    fontWeight: "600",
  },
  usd: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 2,
  },
});
