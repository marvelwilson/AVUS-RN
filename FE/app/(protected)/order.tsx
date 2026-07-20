import { BookOpen, Car, CheckCircle2, Hotel, Plane, ShoppingBag, Utensils } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import commerceApi, { CommerceProduct } from "@/src/api/commerce.api";
import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import TransactionService from "@/src/services/transaction.service";
import WalletService from "@/src/services/wallet.service";
import { StatusModal } from "@/src/store/status-modal";
import { useWalletStore } from "@/src/store/wallet";
import { restoreFormat } from "@/src/utils/CurrencyFormat";
import { getChainName } from "@/src/constants/chains";

const comingSoon = [
  { title: "Food", icon: Utensils }, { title: "Flights", icon: Plane },
  { title: "Hotels", icon: Hotel }, { title: "Transport", icon: Car }, { title: "Books", icon: BookOpen },
];

export default function Order() {
  const [products, setProducts] = useState<CommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string>();
  const balances = useWalletStore((state) => state.balances) as any[];
  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");

  useEffect(() => { void commerceApi.products().then(setProducts).catch(() => StatusModal.error("Marketplace", "The catalog is temporarily unavailable.")).finally(() => setLoading(false)); }, []);

  async function pay(product: CommerceProduct) {
    if (paying) return;
    setPaying(product._id);
    try {
      const quote = await commerceApi.createOrder(product._id);

      // The checkout quote is authoritative. Reflect any catalog price change
      // before checking funds or building the transaction.
      if (quote.total !== product.price || quote.decimals !== product.decimals || quote.token !== product.token) {
        setProducts((current) => current.map((item) => item._id === product._id
          ? { ...item, price: quote.total, decimals: quote.decimals, token: quote.token, tokenAddress: quote.tokenAddress, chainId: quote.chainId }
          : item));
      }

      await WalletService.refresh();
      const liveBalances = useWalletStore.getState().balances as any[];
      const quotedToken = quote.token.toUpperCase();
      const asset = liveBalances.find((item) =>
        String(item.ticker ?? item.symbol ?? "").toUpperCase() === quotedToken,
      );
      const available = asset ? BigInt(asset.amount) : 0n;
      const required = BigInt(quote.total);

      if (available < required) {
        const availableDisplay = Number(available) / 10 ** quote.decimals;
        const requiredDisplay = Number(required) / 10 ** quote.decimals;
        StatusModal.error(
          "Insufficient balance",
          `This item now costs ${requiredDisplay.toFixed(2)} ${quote.token}. Your available balance is ${availableDisplay.toFixed(2)} ${quote.token}.`,
        );
        return;
      }

      const result = await TransactionService.send({
        recipient: quote.merchantWallet,
        amount: parseUnits(
          String(restoreFormat(quote.total)),
          Number(quote.decimals),
        ),
        destination: {
          chainId: quote.chainId,
          token: quote.tokenAddress,
          symbol: quote.token,
          network: getChainName(quote.chainId)
        },
        decimals: quote.decimals
      });

      const txHash = result.receipt?.receipt?.inputUiHashes;
      await commerceApi.submitPayment(quote._id, result.uiHash, txHash);
      StatusModal.success("Payment submitted", "Your order is being verified on Arbitrum.");
    } catch (error) {
      StatusModal.error("Payment not completed", error instanceof Error ? error.message : "Please try again.");
    } finally { setPaying(undefined); }
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}><ScreenHeader title="AVUS Marketplace" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: card }]}><ShoppingBag color={primary} size={30} /><Text style={[styles.title, { color: text }]}>Shop with your CAB balance</Text><Text style={{ color: subtext, lineHeight: 20 }}>Prices and merchant payout addresses come from a protected AVUS checkout quote.</Text></View>
        <Text style={[styles.section, { color: text }]}>Shopping</Text>
        {loading ? <ActivityIndicator color={primary} /> : products.length ? products.map((product) => {
          const displayPrice = Number(product.price) / 10 ** product.decimals;
          const matchingBalance = balances.find((item) => String(item.ticker ?? item.symbol ?? "").toUpperCase() === product.token.toUpperCase());
          const available = matchingBalance ? BigInt(matchingBalance.amount) : 0n;
          const appearsAffordable = available >= BigInt(product.price);
          return <View key={product._id} style={[styles.product, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.productInfo}><Text style={[styles.productName, { color: text }]}>{product.name}</Text><Text style={{ color: subtext }}>{product.description}</Text><Text style={[styles.price, { color: primary }]}>{displayPrice.toFixed(2)} {product.token}</Text>{!appearsAffordable ? <Text style={styles.lowBalance}>Balance may be insufficient</Text> : null}</View>
            <Pressable disabled={!!paying} onPress={() => pay(product)} style={[styles.pay, { backgroundColor: primary, opacity: paying ? 0.6 : 1 }]}>{paying === product._id ? <ActivityIndicator color={secondary} /> : <Text style={[styles.payText, { color: card }]}>Pay</Text>}</Pressable>
          </View>;
        }) : <Text style={[styles.empty, { color: subtext }]}>Set COMMERCE_MERCHANT_WALLET on the backend to publish the starter catalog.</Text>}
        <Text style={[styles.section, { color: text }]}>More services</Text>
        <View style={styles.grid}>{comingSoon.map(({ title, icon: Icon }) => <View key={title} style={[styles.service, { backgroundColor: card, borderColor: border }]}><Icon color={primary} size={22} /><Text style={{ color: text, fontWeight: "700" }}>{title}</Text><View style={styles.badge}><CheckCircle2 size={12} color={primary} /><Text style={{ color: primary, fontSize: 10, fontWeight: "900" }}>COMING SOON</Text></View></View>)}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, content: { padding: 20, paddingBottom: 40, gap: 14 }, hero: { borderRadius: 22, padding: 20, gap: 9 }, title: { fontSize: 24, fontWeight: "800" }, section: { fontSize: 19, fontWeight: "800", marginTop: 10 },
  product: { borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }, productInfo: { flex: 1, gap: 5 }, productName: { fontSize: 16, fontWeight: "800" }, price: { fontSize: 15, fontWeight: "800", marginTop: 4 },
  pay: { minWidth: 68, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" }, payText: { fontWeight: "800" }, empty: { textAlign: "center", padding: 24, lineHeight: 20 },
  lowBalance: { color: "#EF4444", fontSize: 11, fontWeight: "700", marginTop: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 }, service: { width: "47%", borderWidth: 1, borderRadius: 17, padding: 15, gap: 9 }, badge: { flexDirection: "row", gap: 4, alignItems: "center" },
});
