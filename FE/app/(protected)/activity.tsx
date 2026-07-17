import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import TransactionCard from "../../src/components/wallet/TransactionCard";
import { useThemeColor } from "../../src/components/Themed";
import { useWalletStore } from "../../src/store/wallet";
import { useHistoryStore } from "../../src/store/history";
import HistoryService from "@/src/services/history.service";

export default function Activity() {
  const wallet = useWalletStore();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const subColor = useThemeColor({}, "subtext");

  const {

    items,
    loading,

  } = useHistoryStore();

  useEffect(() => {
    void HistoryService.refresh().catch(console.warn);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Activity</Text>

      {loading && <Text style={[styles.hint, { color: subColor }]}>Loading...</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TransactionCard tx={item} />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: subColor }]}>
            {wallet.eoa ? "No transactions recorded yet." : "No wallet found. Set one up via onboarding."}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "700", marginTop: 40, marginBottom: 16 },
  hint: { marginBottom: 12 },
  empty: { marginTop: 40, textAlign: "center" },
});
