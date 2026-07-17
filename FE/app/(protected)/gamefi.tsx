import { Gamepad2 } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import { useThemeColor } from "@/src/components/Themed";
import ScreenHeader from "@/src/components/transaction/ScreenHeader";

export default function GameFi() {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const secondary = useThemeColor({}, "secondary");

  const url = `${process.env.EXPO_PUBLIC_SOCKET_URL}/gamefi`;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="GameFi" />
      <View style={styles.heading}><Gamepad2 color={secondary} size={28} /><View><Text style={[styles.title, { color: text }]}>AVUS GameFi</Text><Text style={{ color: subtext }}>Powered by the AVUS platform</Text></View></View>
      <WebView source={{ uri: url }} style={styles.webview} startInLoadingState allowsBackForwardNavigationGestures />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, heading: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16 }, title: { fontSize: 20, fontWeight: "800" }, webview: { flex: 1 },
});
