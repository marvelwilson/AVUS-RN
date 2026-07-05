import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";
import { Slide } from "@/src/components/wallet/onboarding";
import { setLaunched } from "@/src/utils/storage";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "One Address. Any Chain.",
    desc: "Send Bitcoin, Tron, Ethereum, or any token — it all arrives safely with no bridging.",
    icon: "link",
    color: "#4F46E5",
  },
  {
    title: "Smart Routing Address (SRA)",
    desc: "A single deposit address that accepts funds from every exchange, wallet, and blockchain.",
    icon: "globe",
    color: "#10B981",
  },
  {
    title: "Floating AI Navigator (FAN)",
    desc: "Speak naturally. FAN handles the rest — send, deposit, view reciept, all seamlessly.",
    icon: "sparkles",
    color: "#F59E0B",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const backgroundColor = useThemeColor({}, "background");
  const primary = useThemeColor({}, "primary");



  const next = async () => {
    if (index < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      await setLaunched();
      router.replace("/auth/signin");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <Slide {...item} />
        )}
      />

      {/* footer */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === index ? primary : "#ccc" },
                index === i && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Pressable
          style={[styles.btn, { backgroundColor: primary }]}
          onPress={next}
        >
          <Text style={[styles.btnText, { color: backgroundColor }]}>
            {index === slides.length - 1 ? "Get Started" : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  desc: {
    fontSize: 16,
    textAlign: "center",
  },

  footer: {
    padding: 20,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  activeDot: {
    // color driven by inline style from theme primary
  },

  btn: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    fontWeight: "600",
  },
});
