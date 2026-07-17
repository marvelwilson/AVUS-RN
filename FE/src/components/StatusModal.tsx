import { X } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import AuthStatusCard from "./AuthStatusCard";
import { useThemeColor } from "./Themed";
import { useStatusModalStore } from "@/src/store/status-modal";

export default function StatusModalView() {
  const { visible, title, description, kind, hide } = useStatusModalStore();
  const text = useThemeColor({}, "text");

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={hide}>
        <Pressable style={styles.modal} onPress={(event) => event.stopPropagation()}>
          <Pressable accessibilityRole="button" accessibilityLabel="Dismiss message" onPress={hide} style={styles.close}>
            <X size={20} color={text} />
          </Pressable>
          <AuthStatusCard
            success={kind === "success"}
            error={kind === "error"}
            title={title}
            description={description || "Tap outside to dismiss."}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center", padding: 24 },
  modal: { width: "100%", maxWidth: 390, position: "relative" },
  close: { position: "absolute", right: 38, top: 14, zIndex: 2, width: 34, height: 34, alignItems: "center", justifyContent: "center" },
});
