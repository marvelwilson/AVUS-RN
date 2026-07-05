import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Bell,
  ScanQrCode
} from "lucide-react-native";


import AssetAccordion from "@/src/components/home/AssetAccordion";
import BalanceCard from "@/src/components/home/BalanceCard";
import QuickActions from "@/src/components/home/QuickActions";
import TransactionCard from "@/src/components/home/TransactionCard";

import { useThemeColor } from "@/src/components/Themed";
import { useAuthStore } from "@/src/store/auth";
import { useSettingsStore } from "@/src/store/settings";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Home() {


  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";

    return "Good Night";
  }
  const greeting = getGreeting();
  const user = useAuthStore(s => s.user);

  const hasPin = useSettingsStore(s => s.hasPin);

  useEffect(() => {
    if (!hasPin) {
      router.push("/settings");
    }
  }, [hasPin]);


  return (

    <ScrollView
      style={{
        flex: 1,
        backgroundColor: background
      }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
      }}
    >

      <View style={styles.header}>

        <View>

          <Text style={[styles.greeting, { color: sub }]}>

            {greeting}

          </Text>

          <Text
            style={[
              styles.name,
              {
                color: text
              }
            ]}
          >

            {user?.name ?? "User"}

          </Text>

        </View>

        <View style={styles.icons}>



          <TouchableOpacity
          onPress={() => router.push("/scan")}
          >

            <ScanQrCode
              size={24}
              color={text}
            />

          </TouchableOpacity>
          <TouchableOpacity>

            <View style={styles.dot} />

            <Bell
              size={24}
              color={text}
            />

          </TouchableOpacity>
        </View>

      </View>

      <BalanceCard />

      <QuickActions />

      <AssetAccordion />

      <TransactionCard />

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },

  greeting: {
    opacity: .55,
    fontSize: 14,
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 2,
  },

  icons: {
    flexDirection: "row",
    gap: 18,
  },

  dot: {
    position: "absolute",
    right: -1,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#ff3b30",
    zIndex: 2,
  }

});