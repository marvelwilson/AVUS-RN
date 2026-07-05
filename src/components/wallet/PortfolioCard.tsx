import { StyleSheet, Text, View } from "react-native";

import Card from "../Card";

interface PortfolioCardProps {
  total: string;
  change?: string;
  changePositive?: boolean;
}

export default function PortfolioCard({
  total,
  change = "0%",
  changePositive = true,
}: PortfolioCardProps) {
  return (
    <Card>
      <Text style={styles.label}>Total Portfolio Value</Text>
      <Text style={styles.total}>{total}</Text>
      <Text
        style={[
          styles.change,
          { color: changePositive ? "#16a34a" : "#dc2626" },
        ]}
      >
        {changePositive ? "+" : ""}
        {change}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  total: {
    fontSize: 36,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 4,
  },
  change: {
    fontSize: 15,
    fontWeight: "600",
  },
});
