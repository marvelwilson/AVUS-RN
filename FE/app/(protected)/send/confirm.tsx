import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { parseUnits, zeroAddress } from "viem";

import AuthStatusCard from "@/src/components/AuthStatusCard";
import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import TransactionSummary from "@/src/components/transaction/TransactionSummary";
import TransactionService from "@/src/services/transaction.service";
import { restoreFormat } from "@/src/utils/CurrencyFormat";

export default function ConfirmSend() {
  const router = useRouter();

  const { address, amount, token = "ETH", tokenAddress, chainId = "42161", network = "Arbitrum", decimals = "18" } = useLocalSearchParams<{
    address: string;
    amount: string;
    token?: string;
    tokenAddress?: string;
    chainId?: string;
    network?: string;
    decimals?: string;
  }>();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");


  async function confirmTransaction() {
    if (!address || !amount) return;
    setStatus("sending");
    setError("");
    try {
      await TransactionService.send({
        recipient: address as `0x${string}`,
        token: (tokenAddress || zeroAddress) as `0x${string}`,
        amount: parseUnits(restoreFormat(amount), Number(decimals)),
        destinationChainId: Number(chainId),
        tokenSymbol: token,
        decimals: Number(decimals),
      });
      setStatus("success");
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "The transaction could not be submitted. Please try again later.");
    }
  }

  if (status !== "idle") {
    return (
      <View style={[styles.statusContainer, { backgroundColor: background }]}>
        <AuthStatusCard
          loading={status === "sending"}
          success={status === "success"}
          error={status === "error"}
          title={status === "sending" ? "Submitting transaction" : status === "success" ? "Transaction submitted" : "Transaction not sent"}
          description={status === "sending" ? "Routing your transfer through ZeroDev. Do not close the app." : status === "success" ? "Your activity will update as soon as the network confirms it." : error}
        />
        {status === "success" ? (
          <Pressable onPress={() => router.replace("/(protected)/activity")} style={[styles.button, { backgroundColor: primary }]}><Text style={styles.buttonText}>View activity</Text></Pressable>
        ) : status === "error" ? (
          <Pressable onPress={() => setStatus("idle")} style={[styles.button, { backgroundColor: primary }]}><Text style={styles.buttonText}>Try again</Text></Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <ScreenHeader title="Confirm" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TransactionSummary
          amount={`${amount} ${token}`}
          usd={`$${amount}`}
          to={address}
          total={amount}
          network={network}
        />



        <View
          style={[
            styles.notice,
            {
              backgroundColor: card,
            },
          ]}
        >
          <Text
            style={[
              styles.noticeTitle,
              {
                color: text,
              },
            ]}
          >
            Smart Routing Address
          </Text>

          <Text
            style={[
              styles.noticeText,
              {
                color: subtext,
              },
            ]}
          >
            AVUS will automatically route your transfer to the correct
            blockchain. Double-check the amount before continuing.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={confirmTransaction}
          style={[
            styles.button,
            {
              backgroundColor: primary,
            },
          ]}
        >
          <Text style={styles.buttonText}>
            Confirm & Send
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: { flex: 1, justifyContent: "center", gap: 24, padding: 24 },
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },

  notice: {
    marginTop: 24,
    borderRadius: 18,
    padding: 18,
  },

  noticeTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  noticeText: {
    fontSize: 14,
    lineHeight: 22,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },

  button: {
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
