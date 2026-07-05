import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowUpRight } from "lucide-react-native";
import { useMemo, useState } from "react";
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
import { formatCurrency } from "@/src/utils/CurrencyFormat";

export default function SendAmount() {
  const router = useRouter();

  const { address } = useLocalSearchParams<{
    address: string;
  }>();

  const [amount, setAmount] = useState("");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  const shortAddress = useMemo(() => {
    if (!address) return "";

    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }, [address]);
  const Famount = formatCurrency(amount);

  function continueToConfirm() {
    const value = Number(amount);
    if (!value || Number(value) <= 0) return;
    router.push({
      pathname: "/(protected)/send/confirm",
      params: {
        address,
        amount: Famount,
      },
    });
  }

  const balance = 5.25; // Replace with wallet balance
  const canContinue =
    Number(Famount) > 0 &&
    Number(Famount) <= balance;

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
              color="#fff"
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

        <AmountInput value={Famount} balance={balance} />

        <NumericKeyboard
          value={amount}
          onChange={setAmount}
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
          <Text style={styles.buttonText}>
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
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});