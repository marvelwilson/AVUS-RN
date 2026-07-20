import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowUpRight } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import AmountInput from "@/src/components/transaction/AmountInput";
import NumericKeyboard from "@/src/components/transaction/NumericKeyboard";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import { formatCurrency, restoreFormat } from "@/src/utils/CurrencyFormat";
import { useFanDraftStore } from "@/src/store/fan-draft";

export default function SendAmount() {
  const router = useRouter();

  const { address, chainId, network, token = "ETH", tokenAddress, decimals = "18", usdBalance = "0", tokenPrice = "0" } = useLocalSearchParams<{
    address: string;
    chainId: string;
    network: string;
    token: string;
    tokenAddress: string;
    decimals: string;
    usdBalance: string;
    tokenPrice: string;
  }>();

  // What the user types on the keypad is USD.
  const [usdInput, setUsdInput] = useState("");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }, [address]);

  const price = Number(tokenPrice);
  const balance = Number(usdBalance);

  // Formatted USD amount (what's displayed/typed).
  const usdAmount = formatCurrency(usdInput);
  const usdValue = Number(usdAmount) || 0;

  // Token amount is DERIVED from the USD entered, using the rate.
  const tokenAmount = price > 0 ? restoreFormat(usdAmount) / price : 0;

  const canContinue = usdValue > 0 && price > 0 && usdValue <= balance;

  // Side effects (store writes) belong in an effect, not the render body.
  useEffect(() => {
    useFanDraftStore.getState().merge({
      amount: tokenAmount,
    });
  }, [tokenAmount]);
    
  function continueToConfirm() {
    if (!canContinue) return;
    router.push({
      pathname: "/(protected)/send/confirm",
      params: {
        address,
        amount: String(tokenAmount), // token amount actually being sent
        token,
        tokenAddress,
        chainId,
        network,
        decimals,
        destinationUsd: String(usdAmount), // USD the user entered
      },
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <ScreenHeader title="Send" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.receiverCard,
            {
              backgroundColor: card,
            },
          ]}
        >
          <View
            style={[
              styles.icon,
              {
                backgroundColor: primary,
              },
            ]}
          >
            <ArrowUpRight
              size={18}
              color={text}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.label,
                {
                  color: subtext,
                },
              ]}
            >
              Recipient
            </Text>

            <Text
              numberOfLines={1}
              style={[
                styles.address,
                {
                  color: text,
                },
              ]}
            >
              {shortAddress}
            </Text>
          </View>
        </View>

        {/*
          value: the USD amount the user is typing (primary, editable).
          destinationUsd here is repurposed to show the converted TOKEN amount
          as the secondary "≈ X ETH" line — swap this prop/usage to match
          whatever AmountInput actually expects for its secondary line.
        */}
        <AmountInput
          value={usdAmount}
          balance={String(balance)}
          tokenSymbol={token}
          tokenAmount={tokenAmount}
        />

        <NumericKeyboard
          value={usdInput}
          onChange={setUsdInput}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={!canContinue}
          onPress={continueToConfirm}
          style={[
            styles.button,
            {
              backgroundColor: canContinue
                ? primary
                : "#A1A1AA",
              opacity: canContinue ? 1 : 0.6,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: card }]}>
            Continue
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },

  receiverCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    marginBottom: 24,
    gap: 14,
  },

  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    marginBottom: 4,
  },

  address: {
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },

  button: {
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "700",
  },
});