import * as Clipboard from "expo-clipboard";
import { Share2 } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";

import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import AddressCard from "./AddressCard";
import CopyAddressButton from "./CopyAddressButton";

const ADDRESS =
    "avus1w4jg7h2g8jd92jd8s82jd92jd8sjd92";

export default function ReceiveQRCode() {
    const background = useThemeColor({}, "background");
    const card = useThemeColor({}, "card");
    const text = useThemeColor({}, "text");
    const sub = useThemeColor({}, "subtext");
    const primary = useThemeColor({}, "primary");

    async function copyAddress() {
        await Clipboard.setStringAsync(ADDRESS);
        Alert.alert("Copied", "SRA address copied.");
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
            <Text
                style={[
                    styles.title,
                    {
                        color: text,
                    },
                ]}
            >
                Receive
            </Text>

            <Text
                style={[
                    styles.subtitle,
                    {
                        color: sub,
                    },
                ]}
            >
                Share this Smart Routing Address (SRA)
            </Text>

            <View
                style={[
                    styles.qrCard,
                    {
                        backgroundColor: card,
                    },
                ]}
            >
                <QRCode
                    value={ADDRESS}
                    size={230}
                    backgroundColor="white"
                    color="black"
                />

                <Text
                    style={[
                        styles.network,
                        {
                            color: sub,
                        },
                    ]}
                >
                    Universal Deposit Address
                </Text>
            </View>
            <AddressCard
                address="avus1w4jg7h2g8jd92jd8s82jd92jd8sjd92"
            />


            <CopyAddressButton
                address={ADDRESS}
            />

            <View style={styles.info}>
                <Text
                    style={[
                        styles.infoTitle,
                        {
                            color: text,
                        },
                    ]}
                >
                    Smart Routing Address
                </Text>

                <Text
                    style={[
                        styles.infoText,
                        {
                            color: sub,
                        },
                    ]}
                >
                    Send BTC, ETH, SOL, TRX, USDT or supported
                    assets to this single address. AVUS
                    automatically routes deposits to the correct
                    wallet.
                </Text>
            </View>

            <Pressable
                style={[
                    styles.shareButton,
                    {
                        backgroundColor: primary,
                    },
                ]}
            >
                <Share2
                    color="#fff"
                    size={20}
                />

                <Text style={styles.shareText}>
                    Share Address
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 8,
        fontSize: 15,
        marginBottom: 28,
    },

    qrCard: {
        borderRadius: 28,
        padding: 24,
        alignItems: "center",
    },

    network: {
        marginTop: 20,
        fontSize: 15,
    },

    addressCard: {
        marginTop: 24,
        borderRadius: 20,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
    },

    address: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
    },

    iconButton: {
        paddingLeft: 14,
    },

    info: {
        marginTop: 32,
    },

    infoTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 10,
    },

    infoText: {
        lineHeight: 24,
        fontSize: 15,
    },

    shareButton: {
        height: 58,
        borderRadius: 18,
        marginTop: "auto",
        marginBottom: 40,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },

    shareText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});