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
  ScrollView,
  View,
} from "react-native";

import {
  Send,
  Mic,
  Sparkles,
  X,
} from "lucide-react-native";

import { useThemeColor } from "@/src/components/Themed";
import PolicyManager from "@/src/sdk/fan/policy/manager";
import conversationService from "@/src/sdk/fan/services/conversation.service";
import STTService from "@/src/sdk/fan/services/stt.service";
type Props = {
  visible: boolean;
  onClose: () => void;
  onSend?: (message: string) => void;
};

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

export default function FanChatSheet({
  visible,
  onClose,
  onSend,
}: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);

  const translateY = useRef(new Animated.Value(500)).current;
  const scrollRef = useRef<ScrollView>(null);

  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const secondary = useThemeColor({}, "secondary");
  const border = useThemeColor({}, "border");
  const tabIconDefault = useThemeColor({}, "tabIconDefault");


  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      /**
       * Clear the conversation + any in-progress intent draft
       * once the sheet has fully closed, so re-opening always
       * starts fresh instead of resuming a stale flow.
       */
      if (!visible) {
        setMessages([]);
        setMessage("");
        conversationService.reset?.();
      }
    });
  }, [visible]);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    /**
     * Push the scroll position to the newest message whenever
     * the list grows, so the latest message is always visible
     * while still letting the user scroll up manually.
     */
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages, sending]);

  async function submit(input?: string) {

    const value =
      (input ?? message).trim();

    if (!value) {

      return;

    }

    setMessage("");
    setMessages((current) => [...current, { id: `${Date.now()}-user`, role: "user", text: value }]);
    setSending(true);

    try {


      const response = await conversationService.send(value, { speak: false, publishToOrb: false });
      if (response?.message) {
        setMessages((current) => [...current, { id: `${Date.now()}-fan`, role: "assistant", text: response.message }]);
      }

    } catch (error) {

      console.error(error);
      setMessages((current) => [...current, { id: `${Date.now()}-error`, role: "assistant", text: "I couldn't complete that request. Please try again." }]);

    } finally {
      setSending(false);

    }

  }

  async function dictate() {
    if (sending || listening) return;
    setListening(true);
    try {
      const speech = await STTService.start();
      const transcript = speech.transcript.trim();
      if (transcript) await submit(transcript);
    } catch (error) {
      console.warn("FAN voice input failed.", error);
      setMessages((current) => [...current, { id: `${Date.now()}-voice-error`, role: "assistant", text: "I couldn't hear that. Check microphone and speech-recognition permissions, then try again." }]);
    } finally {
      setListening(false);
    }
  }
  const policy = PolicyManager.get();

  const suggestions = policy?.ui.suggestions

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
                  color={secondary}
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
              {suggestions?.map((item: any) => (
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

            <ScrollView
              ref={scrollRef}
              style={styles.chat}
              contentContainerStyle={styles.chatContent}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.length === 0 ? (
                <Text style={[styles.emptyChat, { color: sub }]}>Your conversation with FAN will stay here.</Text>
              ) : messages.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.bubble,
                    item.role === "user" ? styles.userBubble : styles.fanBubble,
                    { backgroundColor: item.role === "user" ? secondary : card },
                  ]}
                >
                  <Text style={{ color: item.role === "user" ? "#fff" : text }}>{item.text}</Text>
                </View>
              ))}
              {sending ? <Text style={[styles.thinking, { color: sub }]}>FAN is thinking…</Text> : null}
            </ScrollView>

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
                  editable={!sending}
                  style={[
                    styles.input,
                    {
                      color: text,
                    },
                  ]}
                />

                <View style={styles.actions}>

                  <Pressable
                    style={[styles.voiceButton, { borderColor: border }]}
                    onPress={dictate}
                    disabled={sending || listening}
                    accessibilityLabel={listening ? "Listening" : "Speak to FAN"}
                  >
                    <Mic size={18} color={secondary} />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.sendButton,
                      {
                        backgroundColor: secondary,
                      },
                    ]}
                    onPress={() => void submit()}
                    disabled={sending}
                  >
                    <Send
                      size={18}
                      color={tabIconDefault}
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
    marginBottom: 16,
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
    minHeight: 48,
    maxHeight: 100,
    fontSize: 16,
    textAlignVertical: "top",
  },

  actions: {
    marginTop: 18,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  chat: { maxHeight: 220, marginBottom: 16 },
  chatContent: { gap: 10, paddingVertical: 4 },
  emptyChat: { textAlign: "center", paddingVertical: 18 },
  bubble: { maxWidth: "84%", paddingHorizontal: 14, paddingVertical: 11, borderRadius: 16 },
  userBubble: { alignSelf: "flex-end", borderBottomRightRadius: 5 },
  fanBubble: { alignSelf: "flex-start", borderBottomLeftRadius: 5 },
  thinking: { fontSize: 13, fontStyle: "italic" },
});
