import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import TransactionSummary from "@/src/components/transaction/TransactionSummary";

export default function ConfirmSend() {
  const router = useRouter();

  const { address, amount } = useLocalSearchParams<{
    address: string;
    amount: string;
  }>();

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");


  async function confirmTransaction() {
    Alert.alert(
      "Transaction Sent",
      "Your transaction has been submitted.",
      [
        {
          text: "Done",
          onPress: () => router.replace("/(protected)/home"),
        },
      ]
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
          amount={amount}
          usd={`$${amount}`}
          to={address}
          total={amount}
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