import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useRef, useState } from "react";
import {
    AppState,
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

import PrimaryButton from "@/src/components/PrimaryButton";
import PinInput from "@/src/components/settings/PinInput";
import { useThemeColor } from "@/src/components/Themed";
import { useSettingsStore } from "@/src/store/settings";
import { getPin } from "@/src/utils/secureStorage";
import { router } from "expo-router";
import { StatusModal } from "@/src/store/status-modal";


export default function LockScreen() {
    const [pin, setPin] = useState("");
    const [storedPin, setStoredPin] = useState("");

    const background = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");
    const sub = useThemeColor({}, "subtext");
    const card = useThemeColor({}, "card");
    const primary = useThemeColor({}, "primary");
    const pref = useSettingsStore((s) => s.theme);
    const systemTheme = useColorScheme();
    const authenticating = useRef(false);
    const appState = useRef(AppState.currentState);
    const started = useRef(false);

    async function load() {
        const saved = await getPin();
        setStoredPin(saved ?? "");

        const hasHardware =
            await LocalAuthentication.hasHardwareAsync();

        if (!hasHardware) return;

        const enrolled =
            await LocalAuthentication.isEnrolledAsync();

        if (!enrolled) return;

    }


    async function authenticate() {
        if (authenticating.current) return;

        authenticating.current = true;

        try {
            const result =
                await LocalAuthentication.authenticateAsync({
                    promptMessage: "Unlock AVUS",
                    fallbackLabel: storedPin ? "Use PIN" : "",
                });

            if (result.success) {
                Keyboard.dismiss();

                setTimeout(() => {
                    router.replace("/(protected)/home");
                }, 100);
            }
        } finally {
            authenticating.current = false;
        }
    }

    function verifyPin() {
        if (pin === storedPin) {
            Keyboard.dismiss();

            setTimeout(() => {
                router.replace("/(protected)/home");
            }, 100);

            return;
        }

        StatusModal.error("Incorrect PIN", "The PIN you entered is incorrect.");
        setPin("");
    }
    const theme =
        pref === "system"
            ? systemTheme
            : pref;
    const logoImage =
        theme === "dark"
            ? require("@/assets/images/icon-white.png")
            : require("@/assets/images/icon-black.png");


    useEffect(() => {
        const sub = AppState.addEventListener("change", nextState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextState === "active"
            ) {
                authenticate();
            }

            appState.current = nextState;
        });

        return () => sub.remove();
    }, []);


    useEffect(() => {
        if (started.current) return;

        started.current = true;

        load();
    }, []);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: background,
                },
            ]}
        >
            <Image
                source={logoImage}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text
                style={[
                    styles.title,
                    {
                        color: text,
                    },
                ]}
            >
                Welcome Back
            </Text>

            <Text
                style={[
                    styles.subtitle,
                    {
                        color: sub,
                    },
                ]}
            >
                Unlock AVUS to continue
            </Text>

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: card,
                    },
                ]}
            >
                <PinInput
                    value={pin}
                    onChange={setPin}
                />

                <View style={{ marginTop: 30 }}>
                    <PrimaryButton
                        title="Unlock"
                        onPress={verifyPin}
                    />
                </View>

                <Pressable
                    onPress={authenticate}
                    style={styles.faceButton}
                >
                    <Text
                        style={[
                            styles.faceText,
                            {
                                color: primary,
                            },
                        ]}
                    >
                        Use Face ID / Fingerprint
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },

    logo: {
        width: 90,
        height: 90,
        alignSelf: "center",
        marginBottom: 30,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
    },

    subtitle: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 15,
        marginBottom: 40,
    },

    card: {
        borderRadius: 24,
        padding: 24,
    },

    faceButton: {
        marginTop: 24,
        alignItems: "center",
    },

    faceText: {
        fontWeight: "600",
        fontSize: 15,
    },
});
