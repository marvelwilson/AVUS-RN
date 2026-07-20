import { StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import { NumberCurrency, formatCurrency, restoreFormat } from "@/src/utils/CurrencyFormat";

type Props = {
  value: string; // USD entered by the user
  balance?: string; // Wallet balance in USD
  tokenSymbol?: string; // ETH, USDC, etc.
  tokenAmount?: number; // Calculated token amount
};

export default function AmountInput({
  value,
  balance = "0",
  tokenSymbol = "USDC",
  tokenAmount = 0,
}: Props) {
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  const danger = "#EF4444";

  const usdAmount = Number(restoreFormat(value) || 0);
  const walletBalance = Number(balance);
  
  const insufficient = usdAmount > walletBalance;

  const formattedAmount = formatCurrency(value);

  const formattedBalance = NumberCurrency(walletBalance)

  const formattedTokenAmount = NumberCurrency(tokenAmount, 0, 6)

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: card,
          borderColor: insufficient ? danger : border,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: subtext,
          },
        ]}
      >
        Enter Amount
      </Text>

      <View style={styles.amountRow}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.amount,
            {
              color: insufficient ? danger : text,
            },
          ]}
        >
          ${formattedAmount}
        </Text>
      </View>

      <Text
        style={[
          styles.converted,
          {
            color: subtext,
          },
        ]}
      >
        ≈ {formattedTokenAmount} {tokenSymbol}
      </Text>

      {insufficient && (
        <Text style={styles.error}>
          low balance
        </Text>
      )}

      <View
        style={[
          styles.divider,
          {
            backgroundColor: border,
          },
        ]}
      />

      <View style={styles.balanceRow}>
        <Text
          style={[
            styles.balanceLabel,
            {
              color: subtext,
            },
          ]}
        >
          Available Balance
        </Text>
       
        <Text
          style={[
            styles.balance,
            {
              color: insufficient ? danger : text,
            },
          ]}
        >
          ${formattedBalance} USD
        </Text>
      </View>
      <View style={styles.balanceRow}>
        <Text
          style={[
            styles.balanceLabel,
            {
              color: subtext,
            },
          ]}
        >
          Minimal withdrawal
        </Text>
       
        <Text
          style={[
            styles.balance,
            {
              color: insufficient ? danger : text,
            },
          ]}
        >
          $0.5 USD
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 28,
  },

  label: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 24,
    fontWeight: "500",
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 56,
    fontWeight: "700",
    maxWidth: "90%",
  },

  converted: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
  },

  error: {
    marginTop: 14,
    textAlign: "center",
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    marginVertical: 24,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  balanceLabel: {
    fontSize: 14,
  },

  balance: {
    fontSize: 15,
    fontWeight: "700",
  },
});