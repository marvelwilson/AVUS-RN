import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useThemeColor } from "@/src/components/Themed";

import CopyAddressButton from "./CopyAddressButton";
import GlassCard from "./GlassCard";

type Props = {
  address: string;
};

export default function AddressCard({
  address,
}: Props) {
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");
  const primary = useThemeColor({}, "primary");

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Text
          style={[
            styles.label,
            {
              color: sub,
            },
          ]}
        >
          Smart Routing Address
        </Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: primary,
            },
          ]}
        >
          <Text style={[styles.badgeText, {color: text}]}>
            SRA
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.address,
          {
            color: text,
          },
        ]}
      >
        {address}
      </Text>

      <CopyAddressButton
        address={address}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  address: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
  },
});