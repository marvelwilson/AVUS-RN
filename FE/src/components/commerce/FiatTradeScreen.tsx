import { Banknote, CreditCard, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import { useMagicProfile } from "@/src/hooks/useMagicProfile";
import { useWalletStore } from "@/src/store/wallet";

export default function FiatTradeScreen({ mode }: { mode: "buy" | "sell" }) {
  const params = useLocalSearchParams<{ amount?: string }>();
  const [amount, setAmount] = useState(params.amount ?? "");
  const profile = useMagicProfile();
  const wallet = useWalletStore((state) => state.sra);
  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "border");
  const buying = mode === "buy";

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={buying ? "Buy crypto" : "Sell crypto"} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: card }]}>
          <Banknote color={primary} size={30} />
          <Text style={[styles.title, { color: text }]}>{buying ? "Fund your AVUS wallet" : "Withdraw to your bank"}</Text>
          <Text style={[styles.subtitle, { color: subtext }]}>Your verified Magic account and wallet details are supplied automatically.</Text>
        </View>

        <Text style={[styles.label, { color: text }]}>{buying ? "You pay" : "You sell"}</Text>
        <View style={[styles.input, { backgroundColor: card, borderColor: border }]}>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={subtext} style={[styles.amount, { color: text }]} />
          <Text style={{ color: text, fontWeight: "700" }}>{buying ? "USD" : "USDC"}</Text>
        </View>

        <View style={[styles.details, { backgroundColor: card }]}>
          <View style={styles.detailRow}><Text style={{ color: subtext }}>Magic account</Text><Text numberOfLines={1} style={[styles.detailValue, { color: text }]}>{profile.email ?? "Loading…"}</Text></View>
          <View style={styles.detailRow}><Text style={{ color: subtext }}>AVUS wallet</Text><Text numberOfLines={1} style={[styles.detailValue, { color: text }]}>{wallet ?? profile.wallet ?? "Loading…"}</Text></View>
          <View style={styles.detailRow}><Text style={{ color: subtext }}>{buying ? "Receive" : "Payout"}</Text><Text style={[styles.detailValue, { color: text }]}>{buying ? "USDC to CAB" : "Verified bank account"}</Text></View>
        </View>

        <View style={[styles.notice, { borderColor: border }]}><ShieldCheck color={primary} size={20} /><Text style={{ color: subtext, flex: 1 }}>A licensed on/off-ramp provider is required before real fiat orders can be enabled.</Text></View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable disabled style={[styles.button, { backgroundColor: primary, opacity: 0.55 }]}><CreditCard color="#fff" size={20} /><Text style={styles.buttonText}>Coming soon</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, content: { padding: 20, gap: 16 }, hero: { padding: 22, borderRadius: 22, gap: 10 },
  title: { fontSize: 24, fontWeight: "800" }, subtitle: { fontSize: 14, lineHeight: 21 }, label: { fontSize: 16, fontWeight: "700", marginTop: 6 },
  input: { height: 76, borderRadius: 18, borderWidth: 1, paddingHorizontal: 18, flexDirection: "row", alignItems: "center" }, amount: { flex: 1, fontSize: 30, fontWeight: "700" },
  details: { borderRadius: 18, padding: 18, gap: 16 }, detailRow: { flexDirection: "row", justifyContent: "space-between", gap: 18 }, detailValue: { flex: 1, textAlign: "right", fontWeight: "600" },
  notice: { borderWidth: 1, borderRadius: 16, padding: 14, flexDirection: "row", gap: 10 }, footer: { padding: 20, paddingBottom: 30 },
  button: { height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10 }, buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
