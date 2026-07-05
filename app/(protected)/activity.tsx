import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import TransactionCard from "../../src/components/wallet/TransactionCard";
// import { getTransactions, Transaction } from "../../src/services/blockchain/transactions";
import { useThemeColor } from "../../src/components/Themed";
import { useWalletStore } from "../../src/store/wallet";

export default function Activity() {
  const wallet = useWalletStore();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const subColor = useThemeColor({}, "subtext");

  useEffect(() => {
    if (!wallet.address) return;

    let active = true;
    setLoading(true);

    // getTransactions(wallet.address, wallet.chain as any)
    //   .then((list) => {
    //     if (active) setTxs(list);
    //   })
    //   .finally(() => active && setLoading(false));

    // return () => {
    //   active = false;
    // };
  }, [wallet.address, wallet.chain]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Activity</Text>

      {loading && <Text style={[styles.hint, { color: subColor }]}>Loading...</Text>}

      <FlatList
        data={txs}
        keyExtractor={(item) => item.hash}
        renderItem={({ item }) => <TransactionCard tx={item} />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: subColor }]}>
            {wallet.address ? "No transactions recorded yet." : "No wallet found. Set one up via onboarding."}
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
