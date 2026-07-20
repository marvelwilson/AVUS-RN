import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import { ArrowUpRight, CheckCircle2, Coins, Wallet } from "lucide-react-native";
import SummaryRow from "./SummaryRow";


type Props = {
  amount: string;
  symbol?: string;
  usd?: string;
  from?: string;
  to?: string;
  network?: string;
  fee?: string;
  total?: string;
  loading?: boolean;
  onConfirm?(): void;
};

export default function TransactionSummary({
  amount,
  symbol = "USDC",
  usd = "$0.00",
  from = "Main Wallet",
  to,
  network = "Ethereum",
  fee = "$0.00",
  total,
  loading,
  onConfirm,
}: Props) {
  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const primary = useThemeColor({}, "primary");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: card,
          },
        ]}
      >
        <Text
          style={[
            styles.amount,
            {
              color: text,
            },
          ]}
        >
          {amount}
        </Text>

        <Text
          style={[
            styles.symbol,
            {
              color: primary,
            },
          ]}
        >
          {symbol}
        </Text>

        <Text
          style={[
            styles.usd,
            {
              color: sub,
            },
          ]}
        >
          ≈ {usd}
        </Text>

        <View style={styles.divider} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: card,
            },
          ]}
        >
          <SummaryRow
            icon={
              <Wallet
                size={20}
                color={primary}
              />
            }
            label="From"
            value="Main Wallet"
          />

          <SummaryRow
            icon={
              <ArrowUpRight
                size={20}
                color={primary}
              />
            }
            label="Recipient"
            value={`${to?.slice(
              0,
              8
            )}...${to?.slice(-6)}`}
          />

          <SummaryRow
            icon={<Coins size={20} color={primary} />}
            label="Network"
            value={network}
          />

          <SummaryRow
            icon={
              <Coins
                size={20}
                color={primary}
              />
            }
            label="Network Fee"
            value={fee}
          />

          <SummaryRow
            icon={
              <CheckCircle2
                size={20}
                color={primary}
              />
            }
            label="Total"
            value={`$${total ?? '0.00'}`}
            last
          />
        </View>
      </View>


    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 5,
  },

  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 24,
  },

  amount: {
    textAlign: "center",
    fontSize: 44,
    fontWeight: "700",
  },

  symbol: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
  },

  usd: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: "#2D2D2D",
    marginVertical: 28,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },

  label: {
    fontSize: 15,
  },

  value: {
    flex: 1,
    textAlign: "right",
    marginLeft: 25,
    fontSize: 15,
  },

});
