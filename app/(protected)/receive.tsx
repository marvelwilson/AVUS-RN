import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import QRCode from "react-native-qrcode-svg";

import { Copy, Share2, ShieldCheck } from "lucide-react-native";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";

export default function Receive() {
  const address = '0x87h28uiaksu378yuwgewu782938298uewyei'

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "border");

  async function copyAddress() {
    if (!address) return;

    await Clipboard.setStringAsync(address);

    Alert.alert(
      "Copied",
      "Smart Routing Address copied."
    );
  }

  async function shareAddress() {
    if (!address) return;

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Sharing unavailable");
      return;
    }

    Alert.alert(
      "Share",
      address
    );
  }
  const copyColor = text != 'white' ? 'black' : 'white'
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <ScreenHeader title="Receive" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.qrCard,
            {
              backgroundColor: card,
              borderColor: border,
            },
          ]}
        >
          <View style={styles.qrBox}>
            <QRCode
              value={address || ""}
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
                color: subtext,
              },
            ]}
          >
            Receive crypto from any supported blockchain using one address.
          </Text>
        </View>

        <View
          style={[
            styles.addressCard,
            {
              backgroundColor: card,
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
            Your SRA Address
          </Text>

          <Text
            selectable
            style={[
              styles.address,
              {
                color: text,
              },
            ]}
          >
            {address}
          </Text>
        </View>

        <View style={styles.buttons}>
          <Pressable
            onPress={copyAddress}
            style={[
              styles.button,
              {
                backgroundColor: primary,
              },
            ]}
          >
            <Copy
              size={18}
              color={copyColor}
            />

            <Text style={[styles.buttonText, {
              color: copyColor,
            }]}>
              Copy
            </Text>
          </Pressable>

          <Pressable
            onPress={shareAddress}
            style={[
              styles.button,
              {
                backgroundColor: card,
              },
            ]}
          >
            <Share2
              size={18}
              color={text}
            />

            <Text
              style={[
                styles.shareText,
                {
                  color: text,
                },
              ]}
            >
              Share
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.notice,
            {
              backgroundColor: card,
            },
          ]}
        >
          <ShieldCheck
            size={18}
            color="#22C55E"
          />

          <Text
            style={[
              styles.noticeText,
              {
                color: subtext,
              },
            ]}
          >
            Funds sent to your Smart Routing Address are automatically routed to
            the correct supported blockchain.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  qrCard: {
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
  },

  qrBox: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 24,
  },

  subtitle: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },

  addressCard: {
    marginTop: 24,
    borderRadius: 20,
    padding: 20,
  },

  label: {
    fontSize: 13,
    marginBottom: 10,
  },

  address: {
    fontFamily: "SpaceMono",
    fontSize: 15,
    lineHeight: 24,
  },

  buttons: {
    flexDirection: "row",
    gap: 14,
    marginTop: 24,
  },

  button: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  shareText: {
    fontWeight: "700",
    fontSize: 15,
  },

  notice: {
    marginTop: 24,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },

  noticeText: {
    flex: 1,
    lineHeight: 22,
    fontSize: 14,
  },
});