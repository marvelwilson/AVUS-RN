import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "@/src/components/Themed";

type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({
  title,
  subtitle,
}: Props) {
  const router = useRouter();

  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const card = useThemeColor({}, "card");

  function handleNav() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(protected)/home");
    }
  }

  return (
    <SafeAreaView
      pointerEvents="box-none"
      edges={["top"]}
      style={styles.safeArea}
    >
      <View style={styles.container}>
        <Pressable
          onPress={handleNav}
          style={[
            styles.backButton,
            {
              backgroundColor: card,
            },
          ]}
        >
          <ChevronLeft
            size={22}
            color={text}
            strokeWidth={2.5}
          />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: subtext,
                },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    ...StyleSheet.absoluteFillObject,

    zIndex: 9999,
    elevation: 9999,

    justifyContent: "flex-start",

    pointerEvents: "box-none",
  },

  container: {
    height: 72,

    marginHorizontal: 16,
    marginTop: 8,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 22,

    paddingHorizontal: 12,

    backgroundColor: "rgba(15,15,20,0.72)",

    zIndex: 9999,
    elevation: 9999,
  },

  backButton: {
    width: 46,
    height: 46,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  titleContainer: {
    flex: 1,

    alignItems: "center",

    paddingHorizontal: 12,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },

  placeholder: {
    width: 46,
  },
});