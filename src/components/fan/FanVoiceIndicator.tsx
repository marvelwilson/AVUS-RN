import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    Mic,
    Sparkles,
    Volume2,
} from "lucide-react-native";

import { useThemeColor } from "@/src/components/Themed";
import FanSpeech from "./FanSpeech";


export default function FanVoiceIndicator() {
    const primary = useThemeColor({}, "primary");
    const text = useThemeColor({}, "text");
    const sub = useThemeColor({}, "subtext");
    const card = useThemeColor({}, "card");
    const [state, setState] = useState(FanSpeech.getState());

    const scale = useRef(new Animated.Value(1)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0.35)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.12,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (state === "thinking") {
            Animated.loop(
                Animated.timing(rotate, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotate.stopAnimation();
            rotate.setValue(0);
        }
    }, [state]);

    useEffect(() => {
        if (state === "speaking") {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.25,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            opacity.stopAnimation();
            opacity.setValue(0.35);
        }
    }, [state]);

    const rotation = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const label =
        state === "idle"
            ? 'Say "Hey FAN"'
            : state === "listening"
                ? "Listening..."
                : state === "thinking"
                    ? "Thinking..."
                    : "Speaking...";

    useEffect(() => {
        return FanSpeech.subscribe(setState);
    }, []);
    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.outerRing,
                    {
                        borderColor: primary,
                        opacity,
                        transform: [
                            { scale },
                            { rotate: rotation },
                        ],
                    },
                ]}
            />

            <View
                style={[
                    styles.core,
                    {
                        backgroundColor: card,
                    },
                ]}
            >
                {state === "thinking" ? (
                    <Sparkles
                        size={28}
                        color={primary}
                    />
                ) : state === "speaking" ? (
                    <Volume2
                        size={28}
                        color={primary}
                    />
                ) : (
                    <Mic
                        size={28}
                        color={primary}
                    />
                )}
            </View>

            <Text
                style={[
                    styles.label,
                    {
                        color: text,
                    },
                ]}
            >
                {label}
            </Text>

            <Text
                style={[
                    styles.sub,
                    {
                        color: sub,
                    },
                ]}
            >
                {state === "idle"
                    ? "Voice assistant ready"
                    : "FAN is processing your request"}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
    },

    outerRing: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
    },

    core: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },

    label: {
        marginTop: 22,
        fontSize: 20,
        fontWeight: "700",
    },

    sub: {
        marginTop: 6,
        fontSize: 14,
    },
});