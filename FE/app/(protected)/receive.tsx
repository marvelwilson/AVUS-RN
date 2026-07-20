import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import QRCode from "react-native-qrcode-svg";

import { ChevronDown, ChevronUp, Copy, Share2, ShieldCheck } from "lucide-react-native";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import { useWallet } from "@/src/hooks/useWallet";
import { AddressType } from "@/src/sdk/zerodev";
import { StatusModal } from "@/src/store/status-modal";
import PolicyManager from "@/src/sdk/fan/policy/manager";
import type { FanChainPolicy } from "@/src/sdk/fan/types/policy";

export default function Receive() {
  const [chains, setChains] = useState<FanChainPolicy[]>([]);
  const [loadingChains, setLoadingChains] = useState(true);
  const [showSupported, setShowSupported] = useState(false);
  const {

    receive,

  } = useWallet();

  const wallet = receive();

  const SmartAccountAddress = wallet.depositAddress as AddressType
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "border");

  useEffect(() => {
    void (async () => {
      const manifest = PolicyManager.get() ?? await PolicyManager.load();
      setChains(manifest.assets.supportedChains.filter((chain) => chain.enabled && chain.receiveEnabled));
    })().catch((error) => {
      console.error("Unable to load SRA receive policy", error);
    }).finally(() => setLoadingChains(false));
  }, []);

  async function copyAddress() {
    if (!SmartAccountAddress) return;

    await Clipboard.setStringAsync(SmartAccountAddress);

    StatusModal.success("Copied", "Smart Routing Address copied.");

    setTimeout(() => {
      StatusModal.hide()
    }, 2000)
  }

  async function shareAddress() {
    if (!SmartAccountAddress) return;

    if (!(await Sharing.isAvailableAsync())) {
      StatusModal.error("Sharing unavailable", "Sharing is not supported on this device.");
      return;
    }

    StatusModal.show({ title: "Share", description: SmartAccountAddress });
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
      <ScreenHeader title=" Receive " />

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
              value={SmartAccountAddress || ""}
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

        <View style={styles.supportedSection}>
          <Pressable onPress={() => setShowSupported(value => !value)} style={[styles.supportedToggle, { backgroundColor: card, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>View supported chains and tokens</Text>
            {showSupported ? <ChevronUp color={text} size={20} /> : <ChevronDown color={text} size={20} />}
          </Pressable>
          {showSupported ? <>
            <Text style={[styles.sectionSubtitle, { color: subtext }]}>Only send the listed tokens on these networks.</Text>
            {loadingChains ? <ActivityIndicator color={primary} /> : chains.map((chain) => (
              <View key={chain.id} style={[styles.chainCard, { backgroundColor: card, borderColor: border }]}>
                <Text style={[styles.chainName, { color: text }]}>{chain.name}</Text>
                <View style={styles.tokenList}>
                  {chain.tokens.map((token) => (
                    <View key={`${chain.id}-${token.symbol}`} style={[styles.tokenChip, { borderColor: border }]}>
                      <Text style={[styles.tokenSymbol, { color: text }]}>{token.symbol}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}</> : null}
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
            {SmartAccountAddress}
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
  supportedSection: { marginTop: 24, gap: 12 },
  supportedToggle: { borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  sectionSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  chainCard: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  chainName: { fontSize: 16, fontWeight: "700" },
  tokenList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tokenChip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  tokenSymbol: { fontSize: 13, fontWeight: "700" },
});
