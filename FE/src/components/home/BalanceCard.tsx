import { Eye, EyeOff, RefreshCw } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { useWallet } from "@/src/hooks/useWallet";

function formatToken(amount: bigint, decimals: number) {
  const value = Number(amount) / 10 ** decimals;
  return value.toLocaleString(undefined, { minimumFractionDigits: value < 1 ? 2 : 0, maximumFractionDigits: 6 });
}

export default function BalanceCard() {
  const [hidden, setHidden] = useState(false);
  const { balances, loading } = useWallet();

  const stablecoinValue = balances
    .filter((asset: any) => ["USDC", "USDT", "DAI"].includes(asset.ticker ?? asset.symbol))
    .reduce((sum: number, asset: any) => sum + Number(asset.amount) / 10 ** Number(asset.decimals ?? 18), 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>CHAIN-ABSTRACTED BALANCE</Text><Text style={styles.label}>Available across supported networks</Text></View>
        {loading ? <RefreshCw color="#fff" size={20} /> : <Pressable onPress={() => setHidden((value) => !value)}>{hidden ? <EyeOff color="#fff" /> : <Eye color="#fff" />}</Pressable>}
      </View>
      <Text style={styles.balance}>{hidden ? "••••••" : `≈ $${stablecoinValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Text>
      <Text style={styles.caption}>Stablecoin value · other assets shown below</Text>
      <View style={styles.assets}>
        {balances.slice(0, 3).map((asset: any) => (
          <View key={asset.ticker ?? asset.symbol} style={styles.asset}>
            <Text style={styles.assetSymbol}>{asset.ticker ?? asset.symbol}</Text>
            <Text style={styles.assetAmount}>{hidden ? "••••" : formatToken(BigInt(asset.amount), Number(asset.decimals ?? 18))}</Text>
          </View>
        ))}
        {!balances.length ? <Text style={styles.empty}>No funded CAB assets yet</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#4F46E5", borderRadius: 28, padding: 22, shadowColor: "#312E81", shadowOpacity: 0.22, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, eyebrow: { color: "#E0E7FF", fontSize: 11, fontWeight: "900", letterSpacing: 0.7 }, label: { color: "#C7D2FE", marginTop: 4, fontSize: 12 },
  balance: { color: "#fff", fontSize: 36, fontWeight: "800", marginTop: 20 }, caption: { color: "#C7D2FE", fontSize: 11, marginTop: 3 }, assets: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 20 },
  asset: { backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 9 }, assetSymbol: { color: "#C7D2FE", fontSize: 10, fontWeight: "800" }, assetAmount: { color: "#fff", fontWeight: "800", marginTop: 2 }, empty: { color: "#E0E7FF", paddingVertical: 8 },
});
