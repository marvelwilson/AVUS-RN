import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { zeroAddress } from "viem";

import PrimaryButton from "@/src/components/PrimaryButton";
import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import PolicyManager from "@/src/sdk/fan/policy/manager";
import type { FanChainPolicy } from "@/src/sdk/fan/types/policy";
import { useWalletStore } from "@/src/store/wallet";
import marketApi from "@/src/api/market.api";
import { NumberCurrency } from "@/src/utils/CurrencyFormat";

export default function ChooseAsset() {
  const router = useRouter();
  const { address } = useLocalSearchParams<{ address: string }>();
  const usdBalance = useWalletStore((state) => state.totalUsd);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [chains, setChains] = useState<FanChainPolicy[]>([]);
  const [chainId, setChainId] = useState<number>();
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);

  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "border");

  useEffect(() => {
    void (async () => {
      const manifest = PolicyManager.get() ?? await PolicyManager.load();
      const enabled = manifest.assets.supportedChains.filter((chain) => chain.enabled && chain.sendEnabled && chain.chainId);
      setChains(enabled);
      setChainId(enabled[0]?.chainId);
      setLoading(false);
    })().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, []);

  const selectedChain = chains.find((chain) => chain.chainId === chainId);
  const availableTokens = useMemo(
    () => selectedChain ? (selectedChain.sendTokens ?? selectedChain.tokens) : [],
    [selectedChain],
  );
  useEffect(() => {
    if (!availableTokens.length) return;
    void marketApi.prices(availableTokens.map(asset => asset.symbol)).then(setPrices).catch(console.error);
  }, [availableTokens]);

  useEffect(() => {
    if (!availableTokens.some((asset) => asset.symbol === token)) {
      setToken(availableTokens[0]?.symbol);
    }
  }, [availableTokens, token]);

  function continueNext() {
    const asset = availableTokens.find((item) => item.symbol === token);
    if (!asset || !selectedChain || !chainId || !token) return;
    const isNative = token === selectedChain.nativeToken;
    const tokenAddress = isNative
      ? zeroAddress
      : (selectedChain.sendTokens ?? selectedChain.tokens).find((item) => item.symbol === token)?.address;
    if (!tokenAddress) return;
    router.push({
      pathname: "/(protected)/send/amount",
      params: {
        address,
        chainId: String(chainId),
        network: selectedChain.name,
        token,
        tokenAddress,
        decimals: String(["USDC", "USDT"].includes(token) ? 6 : token === "WBTC" ? 8 : 18),
        usdBalance: String(usdBalance),
        tokenPrice: String(prices[token.toUpperCase()] ?? 0),
      },
    });
  }

  if (loading) return <View style={[styles.center, { backgroundColor: background }]}><ActivityIndicator color={primary} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Choose network & token" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.balanceCard, { backgroundColor: card }]}>
          <Text style={{ color: subtext }}>Available to spend</Text>
          <Text style={[styles.usdBalance, { color: text }]}>${NumberCurrency(usdBalance)}</Text>
          <Text style={{ color: subtext }}>AVUS automatically uses your balance across supported chains.</Text>
        </View>
        <Text style={[styles.label, { color: text }]}>Network</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {chains.map((chain) => (
            <Pressable key={chain.id} onPress={() => setChainId(chain.chainId)} style={[styles.chip, { backgroundColor: chainId === chain.chainId ? primary : card, borderColor: border }]}>
              <Text style={{ color: chainId === chain.chainId ? card : text, fontWeight: "700" }}>{chain.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={[styles.label, { color: text }]}>Recipient receives</Text>
        {availableTokens.length ? availableTokens.map((asset) => {
          const symbol = asset.symbol;
          const selected = token === symbol;
          return (
            <Pressable key={symbol} onPress={() => setToken(symbol)} style={[styles.asset, { backgroundColor: card, borderColor: selected ? primary : border }]}>
              <View><Text style={[styles.assetName, { color: text }]}>{symbol}</Text><Text style={{ color: subtext }}>{symbol} on {selectedChain?.name}</Text></View>
              {selected ? <Check color={primary} size={22} /> : null}
            </Pressable>
          );
        }) : <Text style={[styles.empty, { color: subtext }]}>No destination token is available for this network.</Text>}
      </ScrollView>
      <View style={styles.footer}><PrimaryButton title="Continue" onPress={continueNext} disabled={!token || usdBalance <= 0 || !prices[token.toUpperCase()]} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 20, gap: 14 }, label: { fontSize: 18, fontWeight: "700", marginTop: 8 },
  balanceCard: { borderRadius: 18, padding: 18, gap: 4 }, usdBalance: { fontSize: 28, fontWeight: "800" },
  row: { gap: 10 }, chip: { borderWidth: 1, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12 },
  asset: { borderWidth: 1, borderRadius: 18, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  assetName: { fontSize: 17, fontWeight: "700", marginBottom: 5 }, empty: { textAlign: "center", paddingVertical: 28 },
  footer: { paddingHorizontal: 20, paddingBottom: 30 },
});
