import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";

import AssetRow from "./AssetRow";

import { useThemeColor } from "@/src/components/Themed";

export default function AssetAccordion() {
  const [expanded, setExpanded] = useState(false);

  const text = useThemeColor({}, "text");
  const card = useThemeColor({}, "card");

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: card,
        },
      ]}
    >
      <Pressable
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text
          style={[
            styles.title,
            {
              color: text,
            },
          ]}
        >
          Assets
        </Text>

        {expanded ? (
          <ChevronUp color={text} />
        ) : (
          <ChevronDown color={text} />
        )}
      </Pressable>

      {expanded && (
        <>
          <AssetRow
            symbol="USDC"
            balance="10,200"
            price="$10,200"
            icon={require("@/assets/coins/usdc.png")}
          />

          <AssetRow
            symbol="ETH"
            balance="1.346"
            price="$4,362"
            icon={require("@/assets/coins/eth.png")}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },
});