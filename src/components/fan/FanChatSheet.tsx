import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Mic,
  Send,
  Sparkles,
  X,
} from "lucide-react-native";

import { useThemeColor } from "@/src/components/Themed";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSend?: (message: string) => void;
};

export default function FanChatSheet({
  visible,
  onClose,
  onSend,
}: Props) {
  const [message, setMessage] = useState("");

  const translateY = useRef(new Animated.Value(500)).current;

  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "border");

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  function submit() {
    const value = message.trim();

    if (!value) return;

    onSend?.(value);

    setMessage("");
  }

  const suggestions = [
    "Send 10 USD",
    "Buy Crypto",
    "Move assets to USDC",
    "Receive Funds",
    "Scan Wallet Address",
    "Recent Transactions",
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: background,
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Sparkles
                  color={primary}
                  size={22}
                />

                <Text
                  style={[
                    styles.title,
                    {
                      color: text,
                    },
                  ]}
                >
                  FAN Assistant
                </Text>
              </View>

              <Pressable onPress={onClose}>
                <X
                  size={22}
                  color={text}
                />
              </Pressable>
            </View>

            <Text
              style={[
                styles.subtitle,
                {
                  color: sub,
                },
              ]}
            >
              Ask anything or execute wallet commands.
            </Text>

            <View style={styles.suggestionContainer}>
              {suggestions.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setMessage(item)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: card,
                      borderColor: border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: text,
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <KeyboardAvoidingView
              behavior={
                Platform.OS === "ios"
                  ? "padding"
                  : undefined
              }
            >
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
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Ask FAN..."
                  placeholderTextColor={sub}
                  multiline
                  style={[
                    styles.input,
                    {
                      color: text,
                    },
                  ]}
                />

                <View style={styles.actions}>
                  <Pressable style={styles.iconButton}>
                    <Mic
                      size={22}
                      color={primary}
                    />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.sendButton,
                      {
                        backgroundColor: primary,
                      },
                    ]}
                    onPress={submit}
                  >
                    <Send
                      size={18}
                      color="#fff"
                    />
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,.35)",
  },

  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 34,
    minHeight: 430,
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 100,
    backgroundColor: "#9CA3AF",
    alignSelf: "center",
    marginBottom: 22,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
  },

  suggestionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },

  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
  },

  inputContainer: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },

  input: {
    minHeight: 100,
    fontSize: 16,
    textAlignVertical: "top",
  },

  actions: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconButton: {
    padding: 10,
  },

  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});