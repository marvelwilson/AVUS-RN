import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";

import PolicyManager from "@/src/sdk/fan/policy/manager";

export default function ProtectedTabs() {
  useEffect(() => {
    void PolicyManager.load().catch(console.error);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden from bottom bar but routable via buttons/links */}
      <Tabs.Screen name="send/enterAddress" options={{ href: null }} />
      <Tabs.Screen name="send/asset" options={{ href: null }} />
      <Tabs.Screen name="send/amount" options={{ href: null }} />
      <Tabs.Screen name="send/confirm" options={{ href: null }} />
      <Tabs.Screen name="receive" options={{ href: null }} />
      <Tabs.Screen name="scan" options={{ href: null }} />
      <Tabs.Screen name="buy" options={{ href: null }} />
      <Tabs.Screen name="sell" options={{ href: null }} />
      <Tabs.Screen name="order" options={{ href: null }} />
      <Tabs.Screen name="gamefi" options={{ href: null }} />
      <Tabs.Screen name="transaction/[id]" options={{ href: null }} />
    </Tabs>
  );
}
