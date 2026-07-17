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

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const subtext = useThemeColor({}, "subtext");
  const border = useThemeColor({}, "border");
  const card = useThemeColor({}, "card");

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ backgroundColor: background }}
    >
      <View
        style={[
          styles.container,
          {
            borderBottomColor: border,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/(protected)/home");
            }
          }}
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

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: text,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {subtitle ? (
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
          ) : null}
        </View>

        {/* keeps title centered */}
        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },

  placeholder: {
    width: 44,
  },
});