import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { ArrowDown, LockKeyhole, WalletCards } from "lucide-react-native";
import { useThemeColor } from "@/src/components/Themed";

export default function AuthLoading() {
  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "subtext");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");
  const logo = require("@/assets/images/icon.jpg");

  return (
    <View style={[styles.container, { backgroundColor: background }]} accessibilityLabel="AVUS is securing your wallet session">
      <View style={styles.brandRow}>
        <Image source={logo} style={styles.logo} />
        <Text style={[styles.brand, { color: text }]}>AVUS</Text>
      </View>

      <View style={styles.illustration}>
        <View style={[styles.orbit, styles.orbitLarge, { borderColor: `${secondary}38` }]} />
        <View style={[styles.orbit, styles.orbitSmall, { borderColor: `${secondary}55` }]} />
        <View style={[styles.node, styles.nodeTop, { backgroundColor: secondary, borderColor: card }]} />
        <View style={[styles.node, styles.nodeRight, { backgroundColor: secondary, borderColor: card }]} />
        <View style={[styles.node, styles.nodeLeft, { backgroundColor: secondary, borderColor: card }]} />

        <View style={[styles.walletCard, { backgroundColor: card, borderColor: border, shadowColor: secondary }]}>
          <View style={styles.walletTopRow}>
            <View style={[styles.walletIcon, { backgroundColor: secondary }]}>
              <WalletCards size={24} color="#FFFFFF" />
            </View>
            <LockKeyhole size={20} color="#93C5FD" />
          </View>
          <View style={[styles.balanceLine, { backgroundColor: text }]} />
          <View style={[styles.balanceLineShort, { backgroundColor: muted }]} />
        </View>

        <View style={[styles.flowBadge, { backgroundColor: secondary, borderColor: background }]}>
          <ArrowDown size={18} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={[styles.title, { color: text }]}>Your wallet. Every network.</Text>
        <Text style={[styles.titleAccent, { color: secondary }]}>One secure home.</Text>
        <Text style={[styles.description, { color: muted }]}>
          Move, receive, and manage your digital assets with confidence.
        </Text>
      </View>

      <View style={styles.status}>
        <ActivityIndicator size="small" color={secondary} />
        <Text style={[styles.statusText, { color: muted }]}>Securing your session…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
    paddingHorizontal: 28,
    paddingTop: 68,
    paddingBottom: 42,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: {
    width: 36,
    height: 36,
  },
  brand: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", letterSpacing: 3 },
  illustration: {
    width: 282,
    height: 282,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 54,
    marginBottom: 40,
  },
  orbit: { position: "absolute", borderWidth: 1, borderColor: "rgba(96,165,250,0.22)", borderRadius: 999 },
  orbitLarge: { width: 278, height: 278 },
  orbitSmall: { width: 216, height: 216, borderColor: "rgba(129,140,248,0.22)" },
  node: { position: "absolute", width: 12, height: 12, borderRadius: 6, backgroundColor: "#60A5FA", borderWidth: 3, borderColor: "#172554" },
  nodeTop: { top: 16, left: 134 },
  nodeRight: { right: 20, top: 174, backgroundColor: "#818CF8" },
  nodeLeft: { left: 22, top: 86, backgroundColor: "#22D3EE" },
  walletCard: {
    width: 190,
    height: 126,
    borderRadius: 26,
    padding: 20,
    backgroundColor: "#172554",
    borderWidth: 1,
    borderColor: "rgba(147,197,253,0.28)",
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  walletTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  walletIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center" },
  balanceLine: { width: 102, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.88)", marginTop: 18 },
  balanceLineShort: { width: 66, height: 6, borderRadius: 3, backgroundColor: "rgba(147,197,253,0.42)", marginTop: 8 },
  flowBadge: { position: "absolute", bottom: 30, width: 42, height: 42, borderRadius: 21, backgroundColor: "#67E8F9", alignItems: "center", justifyContent: "center", borderWidth: 5, borderColor: "#050816" },
  copy: { alignItems: "center", paddingHorizontal: 2 },
  title: { color: "#F8FAFC", fontSize: 28, lineHeight: 35, fontWeight: "800", textAlign: "center", letterSpacing: -0.6 },
  titleAccent: { color: "#60A5FA", fontSize: 28, lineHeight: 35, fontWeight: "800", textAlign: "center", letterSpacing: -0.6 },
  description: { color: "#94A3B8", fontSize: 15, lineHeight: 23, textAlign: "center", marginTop: 16, maxWidth: 310 },
  status: { marginTop: "auto", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  statusText: { color: "#94A3B8", fontSize: 13, fontWeight: "600", letterSpacing: 0.2 },
});
