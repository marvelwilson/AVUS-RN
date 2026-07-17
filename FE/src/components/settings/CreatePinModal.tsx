import { useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PrimaryButton from "@/src/components/PrimaryButton";
import PinInput from "./PinInput";

import { useThemeColor } from "@/src/components/Themed";
import { useSettingsStore } from "@/src/store/settings";
import { createPin } from "@/src/utils/pin";

interface Props {
  visible: boolean;
  onClose(): void;
}

export default function CreatePinModal({
  visible,
  onClose,
}: Props) {
  const [step, setStep] = useState(1);

  const [firstPin, setFirstPin] = useState("");

  const [confirmPin, setConfirmPin] = useState("");

  const setHasPin = useSettingsStore(
    (s) => s.setHasPin
  );

  const background = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");

  async function handleContinue() {
    if (step === 1) {
      if (firstPin.length !== 4) return;
      setStep(2);
      return;
    }

    if (confirmPin !== firstPin) {
      setConfirmPin("");
      return;
    }

    await createPin(confirmPin);

    setHasPin(true);

    setFirstPin("");
    setConfirmPin("");
    setStep(1);

    onClose();
  }
  useEffect(() => {
    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => sub.remove();
  }, []);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <Pressable
        style={styles.overlay}
      >
        <View
          style={[
            styles.modal,
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
            {step === 1
              ? "Create PIN"
              : "Confirm PIN"}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: sub,
              },
            ]}
          >
            {step === 1
              ? "Create a 4-digit PIN"
              : "Enter it again"}
          </Text>

          <PinInput
            value={
              step === 1
                ? firstPin
                : confirmPin
            }
            onChange={
              step === 1
                ? setFirstPin
                : setConfirmPin
            }
          />

          <View style={{ marginTop: 30 }}>
            <PrimaryButton
              title={
                step === 1
                  ? "Continue"
                  : "Create PIN"
              }
              onPress={handleContinue}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0007",
    padding: 20,
  },

  modal: {
    width: "100%",
    borderRadius: 28,
    padding: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
});