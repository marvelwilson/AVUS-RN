import { useRouter } from "expo-router";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useThemeColor } from "@/src/components/Themed";

export default function QuickActions() {
  const router = useRouter();

  const text = useThemeColor({}, "text");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");

  const Action = ({
    icon,
    title,
    route,
  }: {
    icon: React.ReactNode;
    title: string;
    route: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.action,
        {
          backgroundColor: card,
          borderColor: border,
        },
      ]}
      onPress={() => router.push(route as any)}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor: `${primary}20`,
          },
        ]}
      >
        {icon}
      </View>

      <Text style={[styles.label, { color: text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Action
        title="Send"
        route="send/enterAddress"
        icon={<ArrowUpRight size={20} color={primary} />}
      />

      <Action
        title="Receive"
        route="/receive"
        icon={<ArrowDownLeft size={20} color={primary} />}
      />

      <Action
        title="Deposit"
        route="/deposit"
        icon={<Wallet size={20} color={primary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 28,
  },

  action: {
    width: "26%",
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    paddingVertical: 16,
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 13,
  },
});