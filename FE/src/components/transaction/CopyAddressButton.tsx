import * as Clipboard from "expo-clipboard";
import { Check, Copy } from "lucide-react-native";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";

type Props = {
  address: string;
};

export default function CopyAddressButton({
  address,
}: Props) {
  const [copied, setCopied] = useState(false);

  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const primary = useThemeColor({}, "primary");

  async function copyAddress() {
    await Clipboard.setStringAsync(address);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 200);
  }

  const shortAddress =
    address.length > 18
      ? `${address.slice(0, 10)}...${address.slice(-8)}`
      : address;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: card,
        },
      ]}
    >
      <View style={styles.info}>
        <Text
          style={[
            styles.label,
            {
              color: sub,
            },
          ]}
        >
          Smart Routing Address
        </Text>

        <Text
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

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: copied
              ? "#16A34A"
              : primary,
          },
        ]}
        onPress={copyAddress}
      >
        {copied ? (
          <Check
            size={18}
            color="#fff"
          />
        ) : (
          <Copy
            size={18}
            color="#fff"
          />
        )}

        <Text style={[styles.buttonText, {color: text}]}>
          {copied ? "Copied" : "Copy"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  info: {
    flex: 1,
    marginRight: 16,
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
  },

  address: {
    fontSize: 15,
    fontWeight: "600",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 14,
  },

  buttonText: {
    fontWeight: "700",
    marginLeft: 8,
  },
});