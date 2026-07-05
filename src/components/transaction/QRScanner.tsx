import { useEffect, useState } from "react";
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import {
    ChevronLeft,
    Flashlight,
    FlashlightOff,
    Image as ImageIcon,
} from "lucide-react-native";

import { useThemeColor } from "@/src/components/Themed";

const SIZE = Dimensions.get("window").width * 0.72;

export default function QRScanner() {
    const [permission, requestPermission] = useCameraPermissions();

    const [flash, setFlash] = useState(false);

    const background = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View
                style={[
                    styles.permission,
                    {
                        backgroundColor: background,
                    },
                ]}
            >
                <Text
                    style={{
                        color: text,
                        fontSize: 18,
                        fontWeight: "700",
                    }}
                >
                    Camera Permission Required
                </Text>

                <Text
                    style={{
                        color: "#8E8E93",
                        marginTop: 8,
                        textAlign: "center",
                        lineHeight: 22,
                    }}
                >
                    AVUS uses your camera to scan wallet QR codes.
                </Text>

                <Pressable
                    style={[
                        styles.allowButton,
                        {
                            backgroundColor: primary,
                        },
                    ]}
                    onPress={requestPermission}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                        }}
                    >
                        Allow Camera
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                enableTorch={flash}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={({ data }) => {
                    router.replace({
                        pathname: "/send/amount",
                        params: {
                            address: data,
                        },
                    });
                }}
            />

            {/* Dark Overlay */}

            <View style={styles.overlay}>
                <View style={styles.topOverlay} />

                <View style={styles.middle}>
                    <View style={styles.sideOverlay} />

                    <View style={styles.scanArea}>
                        <View
                            style={[
                                styles.corner,
                                styles.topLeft,
                                {
                                    borderColor: primary,
                                },
                            ]}
                        />

                        <View
                            style={[
                                styles.corner,
                                styles.topRight,
                                {
                                    borderColor: primary,
                                },
                            ]}
                        />

                        <View
                            style={[
                                styles.corner,
                                styles.bottomLeft,
                                {
                                    borderColor: primary,
                                },
                            ]}
                        />

                        <View
                            style={[
                                styles.corner,
                                styles.bottomRight,
                                {
                                    borderColor: primary,
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.sideOverlay} />
                </View>

                <View style={styles.bottomOverlay}>
                    <Text style={styles.title}>
                        Scan Wallet Address
                    </Text>

                    <Text style={styles.subtitle}>
                        Scan an AVUS or compatible wallet QR code.
                    </Text>

                    <View style={styles.actions}>
                        <Pressable
                            style={styles.action}
                            onPress={() => router.back()}
                        >
                            <ChevronLeft
                                color="#fff"
                                size={22}
                            />
                        </Pressable>

                        <Pressable
                            style={styles.action}
                            onPress={() =>
                                setFlash(!flash)
                            }
                        >
                            {flash ? (
                                <FlashlightOff
                                    color="#fff"
                                    size={22}
                                />
                            ) : (
                                <Flashlight
                                    color="#fff"
                                    size={22}
                                />
                            )}
                        </Pressable>

                        <Pressable style={styles.action}>
                            <ImageIcon
                                color="#fff"
                                size={22}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    overlay: {
        flex: 1,
    },

    topOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.65)",
    },

    middle: {
        flexDirection: "row",
    },

    sideOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.65)",
    },

    scanArea: {
        width: SIZE,
        height: SIZE,
    },

    bottomOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.65)",
        justifyContent: "space-between",
        paddingBottom: 40,
        paddingHorizontal: 30,
        paddingTop: 35,
    },

    title: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 24,
        textAlign: "center",
    },

    subtitle: {
        color: "#BDBDBD",
        marginTop: 10,
        textAlign: "center",
        fontSize: 15,
        lineHeight: 22,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 40,
    },

    action: {
        width: 58,
        height: 58,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,.12)",
        justifyContent: "center",
        alignItems: "center",
    },

    permission: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
    },

    allowButton: {
        marginTop: 30,
        height: 54,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },

    corner: {
        position: "absolute",
        width: 42,
        height: 42,
        borderWidth: 4,
    },

    topLeft: {
        left: 0,
        top: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },

    topRight: {
        right: 0,
        top: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },

    bottomLeft: {
        left: 0,
        bottom: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },

    bottomRight: {
        right: 0,
        bottom: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
});