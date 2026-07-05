// src/components/AuthStatusCard.tsx

import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "./Themed";

type Props = {
  title: string;
  description: string;
  loading?: boolean;
  success?: boolean;
};

export default function AuthStatusCard({
  title,
  description,
  loading,
  success,
}: Props) {
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: card,
        },
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="large"
          color="#4F46E5"
          style={{ marginBottom: 18 }}
        />
      )}

      {success && (
        <Ionicons
          name="checkmark-circle"
          size={46}
          color="#22C55E"
          style={{ marginBottom: 18 }}
        />
      )}

      <Text style={[styles.title, { color: text }]}>
        {title}
      </Text>

      <Text
        style={[
          styles.description,
          {
            color: sub,
          },
        ]}
      >
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  description: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 14,
  },
});