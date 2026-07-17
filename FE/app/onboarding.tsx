import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight } from "lucide-react-native";
import { useThemeColor } from "@/src/components/Themed";

import { Slide, type OnboardingIllustration } from "@/src/components/wallet/onboarding";
import { setLaunched } from "@/src/utils/storage";

type OnboardingSlide = {
  eyebrow: string;
  title: string;
  description: string;
  illustration: OnboardingIllustration;
};

const slides: OnboardingSlide[] = [
  {
    eyebrow: "Simple funding",
    title: "One wallet. Every network.",
    description: "Receive supported assets from leading networks through one simple deposit experience—without the usual bridge maze.",
    illustration: "routing",
  },
  {
    eyebrow: "Built for trust",
    title: "Your money stays yours.",
    description: "AVUS keeps you in control with secure, non-custodial wallet infrastructure and clear confirmation before every action.",
    illustration: "security",
  },
  {
    eyebrow: "Meet FAN",
    title: "Wallet actions, in your words.",
    description: "Ask naturally, review the details, then act. FAN makes sending, receiving, and understanding your wallet feel effortless.",
    illustration: "fan",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList<OnboardingSlide>>(null);
  const background = useThemeColor({}, "background");
  const surface = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "subtext");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");
  const contrast = background === "#000000" ? "#FFFFFF" : "#FFFFFF";
  const buttonText = background === "#000000" ? "#000000" : "#FFFFFF";

  const finish = async () => {
    await setLaunched();
    router.replace("/auth/signin");
  };

  const next = async () => {
    if (index < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
      return;
    }
    await finish();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <Text style={[styles.brand, { color: text }]}>AVUS</Text>
        {index < slides.length - 1 ? <Pressable onPress={() => void finish()} hitSlop={12}><Text style={[styles.skip, { color: muted }]}>Skip</Text></Pressable> : <View style={styles.skipSpace} />}
      </View>

      <FlatList
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.illustration}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => <Slide {...item} accent={secondary} width={width} palette={{ background, surface, text, muted, border, contrast }} />}
      />

      <View style={styles.footer}>
        <View style={styles.progressRow}>
          <View style={styles.dots}>
            {slides.map((slide, itemIndex) => (
              <View key={slide.illustration} style={[styles.dot, { backgroundColor: border }, itemIndex === index && { width: 28, backgroundColor: secondary }]} />
            ))}
          </View>
          <Text style={[styles.count, { color: muted }]}>{index + 1} / {slides.length}</Text>
        </View>
        <Pressable style={[styles.button, { backgroundColor: secondary }]} onPress={() => void next()}>
          <Text style={[styles.buttonText, { color: buttonText }]}>{index === slides.length - 1 ? "Open my wallet" : "Continue"}</Text>
          <View style={[styles.buttonIcon, { backgroundColor: background }]}><ArrowRight size={19} color={text} /></View>
        </Pressable>
        <Text style={[styles.footnote, { color: muted }]}>Secure by design. Simple by default.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050816" },
  header: { height: 58, paddingHorizontal: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 3 },
  skip: { color: "#94A3B8", fontSize: 14, fontWeight: "700" }, skipSpace: { width: 30 },
  footer: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  progressRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  dots: { flexDirection: "row", gap: 7 }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#334155" }, activeDot: { width: 28, backgroundColor: "#60A5FA" },
  count: { color: "#64748B", fontSize: 12, fontWeight: "700" },
  button: { height: 60, borderRadius: 20, backgroundColor: "#FFFFFF", paddingLeft: 22, paddingRight: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  buttonText: { color: "#07111F", fontSize: 16, fontWeight: "900" }, buttonIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#67E8F9", alignItems: "center", justifyContent: "center" },
  footnote: { color: "#475569", fontSize: 11, fontWeight: "600", textAlign: "center", marginTop: 13, letterSpacing: 0.2 },
});
