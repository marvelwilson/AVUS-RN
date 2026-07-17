import { Image, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/components/Themed";

interface Props {
  symbol: string;
  balance: string;
  price: string;
  icon: any;
}

export default function AssetRow({
  symbol,
  balance,
  price,
  icon,
}: Props) {
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={icon}
          style={styles.icon}
        />

        <View>
          <Text
            style={[
              styles.symbol,
              {
                color: text,
              },
            ]}
          >
            {symbol}
          </Text>

          <Text
            style={[
              styles.price,
              {
                color: sub,
              },
            ]}
          >
            {price}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.balance,
          {
            color: text,
          },
        ]}
      >
        {balance}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 14,
  },

  symbol: {
    fontWeight: "700",
    fontSize: 15,
  },

  price: {
    marginTop: 2,
    fontSize: 13,
  },

  balance: {
    fontWeight: "700",
    fontSize: 15,
  },
});