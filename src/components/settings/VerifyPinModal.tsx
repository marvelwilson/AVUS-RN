import { useEffect, useState } from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    View,
} from "react-native";

import PrimaryButton from "@/src/components/PrimaryButton";
import PinInput from "./PinInput";

import { useThemeColor } from "@/src/components/Themed";
import { verifyPin } from "@/src/utils/pin";

interface Props {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onSuccess(): void;
  onCancel?(): void;
}

export default function VerifyPinModal({
  visible,
  title = "Enter PIN",
  subtitle = "Enter your 4-digit security PIN",
  onSuccess,
  onCancel,
}: Props) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const shake = useState(new Animated.Value(0))[0];

  const background = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");

  useEffect(() => {
    if (!visible) {
      setPin("");
      setLoading(false);
    }
  }, [visible]);

  function playShake() {
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }

  async function handleVerify() {
    if (pin.length !== 4) return;

    setLoading(true);

    const valid = await verifyPin(pin);

    setLoading(false);

    if (!valid) {
      playShake();
      setPin("");
      return;
    }

    setPin("");
    onSuccess();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: background,
              transform: [{ translateX: shake }],
            },
          ]}
        >
          <Text style={[styles.title, { color: text }]}>
            {title}
          </Text>

          <Text style={[styles.subtitle, { color: sub }]}>
            {subtitle}
          </Text>

          <PinInput
            value={pin}
            onChange={setPin}
          />

          <View style={{ marginTop: 30 }}>
            <PrimaryButton
              title={loading ? "Verifying..." : "Unlock"}
              onPress={handleVerify}
            />
          </View>

          {onCancel && (
            <Text
              onPress={onCancel}
              style={styles.cancel}
            >
              Cancel
            </Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0007",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modal: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    textAlign: "center",
  },

  cancel: {
    marginTop: 18,
    textAlign: "center",
    color: "#6B7280",
    fontWeight: "600",
  },
});