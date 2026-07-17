import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import { CheckCircle2, Clock3, Copy, ExternalLink, XCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import HistoryService from "@/src/services/history.service";
import { StatusModal } from "@/src/store/status-modal";
import type { TransactionRecord } from "@/src/store/history";

const explorers: Record<number, string> = { 1: "https://etherscan.io/tx/", 10: "https://optimistic.etherscan.io/tx/", 8453: "https://basescan.org/tx/", 42161: "https://arbiscan.io/tx/" };

function amountOf(tx: TransactionRecord) {
  const decimals = Number(tx.metadata?.decimals ?? (["USDC", "USDT"].includes(tx.token) ? 6 : 18));
  return `${(Number(tx.amount) / 10 ** decimals).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${tx.token}`;
}
const short = (value?: string) => value ? `${value.slice(0, 10)}…${value.slice(-8)}` : "Not available";

export default function TransactionReceipt() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tx, setTx] = useState<TransactionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const background = useThemeColor({}, "background"); const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text"); const sub = useThemeColor({}, "subtext");
  const border = useThemeColor({}, "border"); const secondary = useThemeColor({}, "secondary");

  useEffect(() => {
    if (!id) return;
    void HistoryService.transaction(id).then(setTx).catch((error) => StatusModal.error("Receipt unavailable", error instanceof Error ? error.message : "Could not load this transaction.")).finally(() => setLoading(false));
  }, [id]);

  async function openExplorer() {
    if (!tx?.txHash) return;
    const explorer = explorers[tx.chainId ?? 42161];
    if (!explorer) return StatusModal.error("Explorer unavailable", "No explorer is configured for this network.");
    try { await Linking.openURL(`${explorer}${tx.txHash}`); } catch { StatusModal.error("Could not open explorer", "Copy the hash and open it in your preferred explorer."); }
  }
  async function copyHash() { if (tx?.txHash) { await Clipboard.setStringAsync(tx.txHash); StatusModal.success("Copied", "Transaction hash copied."); } }

  if (loading) return <View style={[styles.loading, { backgroundColor: background }]}><ActivityIndicator color={secondary} /></View>;
  if (!tx) return <View style={[styles.container, { backgroundColor: background }]}><ScreenHeader title="Receipt" /><Text style={[styles.empty, { color: sub }]}>This receipt could not be loaded.</Text></View>;

  const success = tx.status === "SUCCESS";
  const failed = tx.status === "FAILED" || tx.status === "CANCELLED";
  const StatusIcon = success ? CheckCircle2 : failed ? XCircle : Clock3;
  const statusColor = success ? "#16A34A" : failed ? "#EF4444" : "#F59E0B";

  return <View style={[styles.container, { backgroundColor: background }]}><ScreenHeader title="Transaction receipt" /><ScrollView contentContainerStyle={styles.content}>
    <View style={[styles.summary, { backgroundColor: card, borderColor: border }]}><StatusIcon size={48} color={statusColor} /><Text style={[styles.status, { color: statusColor }]}>{success ? "Transaction complete" : failed ? "Transaction failed" : "Transaction processing"}</Text><Text style={[styles.amount, { color: text }]}>{amountOf(tx)}</Text><Text style={{ color: sub }}>{new Date(tx.createdAt).toLocaleString()}</Text></View>
    <View style={[styles.details, { backgroundColor: card, borderColor: border }]}><Text style={[styles.heading, { color: text }]}>Receipt details</Text><Row label="Type" value={tx.type} text={text} sub={sub} /><Row label="Status" value={tx.status} text={text} sub={sub} /><Row label="Network" value={`${tx.network}${tx.chainId ? ` · ${tx.chainId}` : ""}`} text={text} sub={sub} /><Row label="From" value={short(tx.sender)} text={text} sub={sub} /><Row label="To" value={short(tx.recipient)} text={text} sub={sub} /><Row label="Source" value={tx.source} text={text} sub={sub} /></View>
    {tx.txHash ? <View style={[styles.hashCard, { backgroundColor: card, borderColor: border }]}><Text style={[styles.hashLabel, { color: sub }]}>TRANSACTION HASH</Text><Text selectable style={[styles.hash, { color: text }]}>{tx.txHash}</Text><View style={styles.actions}><Pressable onPress={copyHash} style={[styles.copy, { borderColor: border }]}><Copy size={17} color={text} /><Text style={{ color: text, fontWeight: "700" }}>Copy</Text></Pressable><Pressable onPress={openExplorer} style={[styles.explorer, { backgroundColor: secondary }]}><ExternalLink size={17} color="#FFF" /><Text style={styles.explorerText}>View on explorer</Text></Pressable></View></View> : <View style={[styles.note, { borderColor: border }]}><Text style={{ color: sub, lineHeight: 20 }}>{failed ? "This transaction failed before an on-chain hash was produced. This in-app receipt remains available for your records." : "The explorer link will appear after submission on-chain."}</Text></View>}
  </ScrollView></View>;
}

function Row({ label, value, text, sub }: { label: string; value: string; text: string; sub: string }) { return <View style={styles.row}><Text style={{ color: sub }}>{label}</Text><Text numberOfLines={2} style={[styles.value, { color: text }]}>{value}</Text></View>; }

const styles = StyleSheet.create({
  container: { flex: 1 }, loading: { flex: 1, justifyContent: "center", alignItems: "center" }, empty: { padding: 24, textAlign: "center" }, content: { padding: 20, paddingBottom: 40, gap: 16 },
  summary: { borderWidth: 1, borderRadius: 24, padding: 24, alignItems: "center", gap: 9 }, status: { fontSize: 15, fontWeight: "800" }, amount: { fontSize: 28, fontWeight: "900" },
  details: { borderWidth: 1, borderRadius: 20, padding: 18, gap: 16 }, heading: { fontSize: 17, fontWeight: "800" }, row: { flexDirection: "row", justifyContent: "space-between", gap: 20 }, value: { flex: 1, textAlign: "right", fontWeight: "700" },
  hashCard: { borderWidth: 1, borderRadius: 20, padding: 18 }, hashLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1.2 }, hash: { fontSize: 12, lineHeight: 18, marginTop: 8 }, actions: { flexDirection: "row", gap: 10, marginTop: 18 }, copy: { height: 48, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, flexDirection: "row", gap: 7, alignItems: "center" }, explorer: { flex: 1, height: 48, borderRadius: 14, flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center" }, explorerText: { color: "#FFF", fontWeight: "800" }, note: { borderWidth: 1, borderRadius: 16, padding: 16 },
});
