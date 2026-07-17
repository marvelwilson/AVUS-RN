import { router, useFocusEffect } from "expo-router";
import { ExternalLink } from "lucide-react-native";
import { useCallback } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import HistoryService from "@/src/services/history.service";
import { TransactionRecord, useHistoryStore } from "@/src/store/history";

function displayAmount(tx: TransactionRecord) {
  const decimals = Number(tx.metadata?.decimals ?? (tx.token === "USDC" || tx.token === "USDT" ? 6 : 18));
  const value = Number(tx.amount) / 10 ** decimals;
  return `${tx.type === "SEND" ? "−" : "+"}${value.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${tx.token}`;
}

export default function TransactionCard() {
  const { items, loading } = useHistoryStore();
  const text = useThemeColor({}, "text"); const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card"); const primary = useThemeColor({}, "primary");

  useFocusEffect(useCallback(() => {
    void HistoryService.refresh().catch(console.warn);
  }, []));

  function viewReceipt(tx: TransactionRecord) {
    router.push({ pathname: "/transaction/[id]", params: { id: tx._id } });
  }

  return (
    <View style={[styles.card, { backgroundColor: card }]}>
      <View style={styles.header}><Text style={[styles.title, { color: text }]}>Recent transactions</Text><Pressable onPress={() => router.push("/activity")}><Text style={{ color: primary, fontWeight: "700" }}>View all</Text></Pressable></View>
      {loading && !items.length ? <ActivityIndicator color={primary} style={styles.loading} /> : null}
      {!loading && !items.length ? <Text style={[styles.empty, { color: subtext }]}>No transactions recorded yet.</Text> : null}
      {items.slice(0, 5).map((tx) => (
        <Pressable key={tx._id} onPress={() => viewReceipt(tx)} style={styles.row}>
          <View style={styles.details}><Text style={[styles.type, { color: text }]}>{tx.type[0] + tx.type.slice(1).toLowerCase()} {tx.token}</Text><Text style={{ color: subtext, fontSize: 12 }}>{tx.status} · {new Date(tx.createdAt).toLocaleDateString()}</Text></View>
          <View style={styles.right}><Text style={[styles.amount, { color: tx.type === "RECEIVE" ? "#16a34a" : text }]}>{displayAmount(tx)}</Text><View style={styles.receipt}><ExternalLink size={12} color={primary} /><Text style={{ color: primary, fontSize: 11, fontWeight: "700" }}>Receipt</Text></View></View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: 18, marginBottom: 40 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, title: { fontWeight: "800", fontSize: 18 },
  loading: { marginVertical: 24 }, empty: { textAlign: "center", paddingVertical: 24 }, row: { minHeight: 68, flexDirection: "row", alignItems: "center", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#94A3B850" },
  details: { flex: 1, gap: 4 }, type: { fontWeight: "700" }, right: { alignItems: "flex-end", gap: 5 }, amount: { fontWeight: "700", fontSize: 13 }, receipt: { flexDirection: "row", alignItems: "center", gap: 4 },
});
