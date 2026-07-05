import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";

const { width } = Dimensions.get("window");

const SCAN_SIZE = width * 0.72;

export default function QRScannerOverlay() {
  const text = useThemeColor({}, "text");

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: SCAN_SIZE - 4,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Top */}
      <View style={styles.overlay} />

      {/* Middle */}
      <View style={styles.middle}>
        <View style={styles.overlay} />

        <View
          style={[
            styles.scanArea,
            {
              width: SCAN_SIZE,
              height: SCAN_SIZE,
            },
          ]}
        >
          {/* Corners */}

          <View style={[styles.corner, styles.topLeft]} />

          <View style={[styles.corner, styles.topRight]} />

          <View style={[styles.corner, styles.bottomLeft]} />

          <View style={[styles.corner, styles.bottomRight]} />

          {/* Animated Line */}

          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateY: animation,
                  },
                ],
              },
            ]}
          />
        </View>

        <View style={styles.overlay} />
      </View>

      {/* Bottom */}

      <View style={styles.bottom}>
        <Text
          style={[
            styles.title,
            {
              color: text,
            },
          ]}
        >
          Scan QR Code
        </Text>

        <Text style={styles.subtitle}>
          Position the wallet QR code inside the frame.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  middle: {
    flexDirection: "row",
  },

  scanArea: {
    backgroundColor: "transparent",
  },

  bottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    paddingTop: 35,
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 12,
    color: "#d1d5db",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  scanLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: "#6D5FFD",
    shadowColor: "#6D5FFD",
    shadowOpacity: 1,
    shadowRadius: 8,
  },

  corner: {
    position: "absolute",
    width: 36,
    height: 36,
    borderColor: "#FFFFFF",
  },

  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },

  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 18,
  },
});