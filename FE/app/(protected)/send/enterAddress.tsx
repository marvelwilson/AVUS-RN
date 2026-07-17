import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScanLine } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import PrimaryButton from "@/src/components/PrimaryButton";
import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import { useFanDraftStore } from "@/src/store/fan-draft";
import { StatusModal } from "@/src/store/status-modal";

export default function EnterAddress() {
  const router = useRouter();

  const { recipient } = useLocalSearchParams<{ recipient?: string }>();

  const [address, setAddress] = useState(recipient ?? "");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");

  async function pasteAddress() {
    const value = await Clipboard.getStringAsync();

    if (!value) {
      StatusModal.error("Clipboard Empty", "No wallet address found.");
      return;
    }
    useFanDraftStore
      .getState()
      .merge({

        recipient: value,

      });
      
    setAddress(value.trim());
  }

  function continueNext() {
    if (!address.trim()) {
      StatusModal.error("Address Required", "Please enter a wallet address.");
      return;
    }

    router.push({
      pathname: "/(protected)/send/asset",
      params: {
        address,
      },
    });
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
      <ScreenHeader title="Recipient Address" />

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: text,
            },
          ]}
        >
          Where would you like to send?
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: subtext,
            },
          ]}
        >
          Paste or scan the recipient wallet address.
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: card,
              borderColor: border,
            },
          ]}
        >
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="0x..."
            placeholderTextColor={subtext}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.input,
              {
                color: text,
              },
            ]}
          />

          <Pressable onPress={pasteAddress}>
            <Text
              style={[
                styles.paste,
                {
                  color: primary,
                },
              ]}
            >
              Paste
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/(protected)/scan")}
          style={[
            styles.scanCard,
            {
              backgroundColor: card,
            },
          ]}
        >
          <ScanLine
            size={22}
            color={primary}
          />

          <View style={{ marginLeft: 14 }}>
            <Text
              style={[
                styles.scanTitle,
                {
                  color: text,
                },
              ]}
            >
              Scan QR Code
            </Text>

            <Text
              style={[
                styles.scanSubtitle,
                {
                  color: subtext,
                },
              ]}
            >
              Use your camera instead
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={continueNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },

  inputContainer: {
    minHeight: 150,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },

  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    textAlignVertical: "top",
  },

  paste: {
    alignSelf: "flex-end",
    marginTop: 14,
    fontWeight: "700",
    fontSize: 15,
  },

  scanCard: {
    marginTop: 20,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  scanTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  scanSubtitle: {
    marginTop: 3,
    fontSize: 14,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
});
