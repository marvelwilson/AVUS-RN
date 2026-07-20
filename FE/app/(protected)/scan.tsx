import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Flashlight, FlashlightOff, ScanLine } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import QRScannerOverlay from "@/src/components/transaction/QRScannerOverlay";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";
import { useFanDraftStore } from "@/src/store/fan-draft";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");

  if (!permission) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={secondary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.permissionContainer,
          {
            backgroundColor: background,
          },
        ]}
      >
        <ScanLine
          size={70}
          color={primary}
        />

        <Text
          style={[
            styles.permissionTitle,
            {
              color: text,
            },
          ]}
        >
          Camera Permission Required
        </Text>

        <Text style={styles.permissionSubtitle}>
          Allow camera access to scan wallet QR codes.
        </Text>

        <Pressable
          onPress={requestPermission}
          style={[
            styles.button,
            {
              backgroundColor: primary,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: card }]}>
            Continue
          </Text>
        </Pressable>
      </View>
    );
  }

  function onScanned({
    data,
  }: {
    data: string;
  }) {
    if (scanned) return;

    setScanned(true);
    useFanDraftStore
      .getState()
      .merge({

        address: data,

      });
    router.push({
      pathname: "/(protected)/send/asset",
      params: {
        address: data,
      },
    });
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torchEnabled}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={onScanned}
      />

      <ScreenHeader title="Scan QR" />
      <View style={styles.topActions}>
        <Pressable
          onPress={() => setTorchEnabled((prev) => !prev)}
          style={[
            styles.flashButton,
            {
              backgroundColor: torchEnabled
                ? primary
                : "rgba(0,0,0,0.45)",
            },
          ]}
        >
          {torchEnabled ? (
            <Flashlight
              size={22}
              color={card}
            />
          ) : (
            <FlashlightOff
              size={22}
              color={card}
            />
          )}
        </Pressable>
      </View>
      <QRScannerOverlay />

      {scanned && (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={secondary}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  permissionTitle: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 24,
    fontWeight: "700",
  },

  permissionSubtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 15,
    lineHeight: 22,
  },

  button: {
    marginTop: 35,
    width: "100%",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  loading: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.45)",
  },

  topActions: {
    position: "absolute",
    top: 110,
    right: 20,
    zIndex: 100,
  },

  flashButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },
});
