import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { useThemeColor } from "@/src/components/Themed";

type Props = {
  address: string;
};

export default function QRCard({ address }: Props) {
  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const border = useThemeColor({}, "border");

  const shortAddress =
    address.length > 26
      ? `${address.slice(0, 12)}...${address.slice(-12)}`
      : address;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: card,
          borderColor: border,
        },
      ]}
    >
      <View style={styles.qrWrapper}>
        <QRCode
          value={address}
          size={220}
          backgroundColor="#FFFFFF"
          color="#000000"
          quietZone={12}
        />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: text,
          },
        ]}
      >
        Smart Routing Address
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: sub,
          },
        ]}
      >
        Receive from any supported blockchain using one address.
      </Text>

      <View
        style={[
          styles.addressContainer,
          {
            backgroundColor: background,
          },
        ]}
      >
        <Text
          style={[
            styles.address,
            {
              color: text,
            },
          ]}
          numberOfLines={1}
        >
          {shortAddress}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
  },

  qrWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 24,
    marginBottom: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  addressContainer: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  address: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});