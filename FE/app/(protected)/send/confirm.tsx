import { useLocalSearchParams, useFocusEffect, router, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { parseUnits, zeroAddress } from "viem";

import AuthStatusCard from "@/src/components/AuthStatusCard";
import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import TransactionSummary from "@/src/components/transaction/TransactionSummary";
import TransactionService from "@/src/services/transaction.service";
import VerifyPinModal from "@/src/components/settings/VerifyPinModal";
import { useSettingsStore } from "@/src/store/settings";
import { StatusModal } from "@/src/store/status-modal";
import { restoreFormat, formatCurrency, NumberCurrency } from "@/src/utils/CurrencyFormat";
import { useWalletStore } from "@/src/store/wallet";
export default function ConfirmSend() {
  const router = useRouter();

  const { address, amount, token = "ETH", tokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", chainId = "42161", network = "Arbitrum", decimals = "18", destinationUsd = "0", } = useLocalSearchParams<{
    address: string;
    amount: string;
    token?: string;
    tokenAddress?: string;
    chainId?: string;
    network?: string;
    decimals?: string;
    destinationUsd?: string;
  }>();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [pinVisible, setPinVisible] = useState(false);
  const hasPin = useSettingsStore((state) => state.hasPin);
  const [fee, setFee] = useState("Estimating…");
  const usdBalance = useWalletStore((state) => state.totalUsd);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  useFocusEffect(
    useCallback(() => {
      return () => {
        setStatus("idle");
        setError("");
        setPinVisible(false);
        setFee("Estimating…");

        router.setParams({
          address: undefined,
          amount: undefined,
          token: undefined,
          tokenAddress: undefined,
          chainId: undefined,
          network: undefined,
          decimals: undefined,
          destinationUsd: undefined,
        });
      };
    }, [router])
  );

  useEffect(() => {
    if (!address || !amount) return;

    TransactionService.estimate({
      recipient: address as `0x${string}`,

      amount: parseUnits(
        String(restoreFormat(amount)),
        Number(decimals),
      ),

      destination: {
        chainId: Number(chainId),
        token: (tokenAddress || zeroAddress) as `0x${string}`,
      },

      source: undefined,

      decimals: Number(decimals),
    })
      .then((estimate) => {
        console.log(estimate)
        setFee(
          estimate.sponsored
            ? "Sponsored"
            : `$${estimate.feeUsd.toFixed(2)}`
        );
      })
      .catch((cause) => {
        console.warn("Fee estimate failed", cause);
        setFee("processing..");
      });

  }, [
    address,
    amount,
    chainId,
    decimals,
    token,
    tokenAddress,
  ]);


  async function confirmTransaction() {
    if (!address || !amount) return;

    if (usdBalance < 0.5) {
      setStatus("error");

      setError("Insufficient balance. you can transfer a minimum of $0.5");

      return;
    }
    setStatus("sending");
    setError("");
    try {
      await TransactionService.send({
        recipient: address as `0x${string}`,

        amount: parseUnits(
          String(restoreFormat(amount)),
          Number(decimals),
        ),

        destination: {
          chainId: Number(chainId),
          token: (tokenAddress || zeroAddress) as `0x${string}`,
          symbol: token,
          network,

        },

        decimals

      });
      setStatus("success");
    } catch (cause) {
      setStatus("error");
      console.log("The error:", cause.message)
      setError("The transaction could not be submitted. Please try again later.");
    }
  }

  const mainAmount = NumberCurrency(Number(amount), 0, 6)

  function requestConfirmation() {
    if (!hasPin) {
      StatusModal.error("PIN required", "Create a security PIN in Settings before sending funds.");
      return;
    }
    setPinVisible(true);
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
          <Pressable onPress={() => router.replace("/(protected)/activity")} style={[styles.button, { backgroundColor: primary }]}><Text style={[styles.buttonText, { color: card }]}>View activity</Text></Pressable>
        ) : status === "error" ? (
          <Pressable onPress={() => setStatus("idle")} style={[styles.button, { backgroundColor: primary }]}><Text style={[styles.buttonText, { color: card }]}>Try again</Text></Pressable>
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
          amount={mainAmount}
          symbol={token}
          usd={`$${formatCurrency(destinationUsd)}`}
          to={address}
          total={formatCurrency(destinationUsd)}
          network={network}
          fee={fee}
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
          onPress={requestConfirmation}
          style={[
            styles.button,
            {
              backgroundColor: primary,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: card }]}>
            Confirm & Send
          </Text>
        </Pressable>
      </View>
      <VerifyPinModal
        visible={pinVisible}
        title="Confirm transaction"
        subtitle={`Enter your PIN to send ${mainAmount} ${token} on ${network}.`}
        onCancel={() => setPinVisible(false)}
        onSuccess={() => {
          setPinVisible(false);
          void confirmTransaction();
        }}
      />
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
    fontSize: 17,
    fontWeight: "700",
  },
});
