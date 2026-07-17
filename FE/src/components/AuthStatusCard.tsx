
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "./Themed";

type Props = {
  title: string;
  description: string;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
};

export default function AuthStatusCard({
  title,
  description,
  loading,
  success,
  error,
}: Props) {
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const secondary = useThemeColor({}, "secondary");

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
          color={secondary}
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

      {error && (
        <Ionicons
          name="alert-circle"
          size={46}
          color="#EF4444"
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
