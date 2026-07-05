import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import PrimaryButton from "@/src/components/PrimaryButton";
import PinInput from "./PinInput";

import { useThemeColor } from "@/src/components/Themed";
import { changePin, verifyPin } from "@/src/utils/pin";

interface Props {
  visible: boolean;
  onClose(): void;
}

export default function ChangePinModal({
  visible,
  onClose,
}: Props) {
  const [step, setStep] = useState(1);

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const background = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible]);

  function reset() {
    setStep(1);
    setOldPin("");
    setNewPin("");
    setConfirmPin("");
  }

  async function next() {
    switch (step) {
      case 1: {
        if (oldPin.length !== 4) return;

        const valid = await verifyPin(oldPin);

        if (!valid) {
          Alert.alert(
            "Incorrect PIN",
            "The PIN you entered is incorrect."
          );
          setOldPin("");
          return;
        }

        setStep(2);
        return;
      }

      case 2: {
        if (newPin.length !== 4) return;

        if (newPin === oldPin) {
          Alert.alert(
            "Invalid PIN",
            "Your new PIN must be different."
          );
          return;
        }

        setStep(3);
        return;
      }

      case 3: {
        if (confirmPin.length !== 4) return;

        if (confirmPin !== newPin) {
          Alert.alert(
            "PIN Mismatch",
            "The PINs do not match."
          );

          setConfirmPin("");

          return;
        }

        await changePin(oldPin, newPin);

        Alert.alert(
          "Success",
          "PIN changed successfully."
        );

        reset();

        onClose();

        return;
      }
    }
  }

  function getTitle() {
    switch (step) {
      case 1:
        return "Current PIN";

      case 2:
        return "New PIN";

      default:
        return "Confirm PIN";
    }
  }

  function getSubtitle() {
    switch (step) {
      case 1:
        return "Enter your existing PIN";

      case 2:
        return "Create a new PIN";

      default:
        return "Re-enter your new PIN";
    }
  }

  function getValue() {
    switch (step) {
      case 1:
        return oldPin;

      case 2:
        return newPin;

      default:
        return confirmPin;
    }
  }

  function getSetter() {
    switch (step) {
      case 1:
        return setOldPin;

      case 2:
        return setNewPin;

      default:
        return setConfirmPin;
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
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
            {getTitle()}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: sub,
              },
            ]}
          >
            {getSubtitle()}
          </Text>

          <PinInput
            value={getValue()}
            onChange={getSetter()}
          />

          <View style={{ marginTop: 30 }}>
            <PrimaryButton
              title={
                step === 3
                  ? "Save PIN"
                  : "Continue"
              }
              onPress={next}
            />
          </View>

          <Text
            style={styles.cancel}
            onPress={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Text>
        </View>
      </Pressable>
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
    marginBottom: 28,
  },

  cancel: {
    textAlign: "center",
    marginTop: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
});