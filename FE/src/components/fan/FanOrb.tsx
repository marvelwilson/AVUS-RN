import { useEffect, useMemo, useRef, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { GestureDetector } from "react-native-gesture-handler";

import {
    MessageCircle,
    Mic,
} from "lucide-react-native";

import { useThemeColor } from "@/src/components/Themed";
import useFan from "@/src/hooks/useFan";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import useFanGesture from "./FanGesture";

const SIZE = 72;
const HINTS = [
    '👋 Say "Hey FAN"',
    "🎤 Tap to speak",
    "💬 Double tap to chat",
    '💸 "Send 20 USD"',
    '📈 "Show my balance"',
];
export default function FanOrb() {
    const {
        muted,
        message,
        toggle,
        startListening,
    } = useFan();
    const [hintIndex, setHintIndex] = useState(0);
    const card = useThemeColor({}, "card");
    const text = useThemeColor({}, "text");

    const lastTap = useRef(0);

    const {
        gesture,
        animatedStyle,
    } = useFanGesture();

    async function handlePress() {

        const now = Date.now();

        if (now - lastTap.current < 250) {
            toggle();
            lastTap.current = 0;
            return;

        }

        lastTap.current = now;

        setTimeout(() => {
            if (lastTap.current === now && !muted) {
                void startListening();
            }
        }, 260);

    }
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-8);

    useEffect(() => {
        opacity.value = withTiming(1, {
            duration: 700,
        });

        translateY.value = withTiming(0, {
            duration: 700,
        });

        const interval = setInterval(() => {
            opacity.value = withTiming(0, {
                duration: 250,
            });

            translateY.value = withTiming(-8, {
                duration: 250,
            });

            setTimeout(() => {
                setHintIndex((prev) => (prev + 1) % HINTS.length);

                translateY.value = -8;

                opacity.value = withTiming(1, {
                    duration: 400,
                });

                translateY.value = withTiming(0, {
                    duration: 400,
                });
            }, 260);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const tooltipStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            {
                translateY: translateY.value,
            },
        ],
    }));

    const tooltipMessage = useMemo(() => {
        if (message && message !== 'Say "Hey FAN"') {
            return message;
        }

        return HINTS[hintIndex];
    }, [message, hintIndex]);

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    styles.wrapper,
                    animatedStyle,
                ]}
            >
                <Pressable onPress={handlePress}>
                    <Animated.View
                        style={[
                            styles.tooltip,
                            tooltipStyle,
                        ]}
                    >
                        <View style={styles.tooltipTail} />

                        <Text
                            style={[
                                styles.tooltipText,
                                {
                                    color: text,
                                },
                            ]}
                        >
                            {tooltipMessage}
                        </Text>
                    </Animated.View>
                    <View style={styles.outerRing}>

                        <MessageCircle
                            size={88}
                            color="#3B82F6"
                            strokeWidth={1.8}
                            style={styles.chatOutline}
                        />

                        <View
                            style={[
                                styles.orb,
                                {
                                    backgroundColor: card,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.inner,
                                    {
                                        backgroundColor: '#3B82F6',
                                    },
                                ]}
                            />

                            {muted ? (
                                <MessageCircle
                                    color="#fff"
                                    size={28}
                                />
                            ) : (
                                <Mic
                                    color="#fff"
                                    size={28}
                                />
                            )}
                        </View>
                    </View>


                </Pressable>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        zIndex: 9999,
        elevation: 9999,
    },

    outerRing: {
        width: 88,
        height: 88,
        justifyContent: "center",
        alignItems: "center",
    },

    chatOutline: {
        position: "absolute",
        opacity: 0.95,
    },

    orb: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#3B82F6",
        shadowOpacity: 0.45,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 8,
        },

        elevation: 15,
    },

    inner: {
        position: "absolute",
        width: 48,
        height: 48,
        borderRadius: 24,
        opacity: 0.9,
    },

    tooltip: {
        position: "absolute",

        bottom: 96,
        left: -100,

        backgroundColor: "#1F2937",

        minWidth: 180,
        maxWidth: 280,

        paddingHorizontal: 20,
        paddingVertical: 14,

        borderRadius: 18,

        justifyContent: "center",

        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 8,
    },

    tooltipTail: {
        position: "absolute",

        left: 138,
        bottom: -8,

        width: 16,
        height: 16,

        backgroundColor: "#1F2937",

        transform: [
            {
                rotate: "45deg",
            },
        ],
    },

    tooltipText: {
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 20,
    },
});
