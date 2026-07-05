import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import {
  Lock,
  Mic,
  MicOff
} from "lucide-react-native";

import ThemeToggle from "@/src/components/ThemeToggle";

import SessionSelector from "@/src/components/settings/SessionSelector";
import SettingCard from "@/src/components/settings/SettingCard";
import SettingRow from "@/src/components/settings/SettingRow";

import ChangePinModal from "@/src/components/settings/ChangePinModal";
import CreatePinModal from "@/src/components/settings/CreatePinModal";

import { useAuthStore } from "@/src/store/auth";
import { useSettingsStore } from "@/src/store/settings";

import FanWakeWord from "@/src/components/fan/FanWakeWord";
import { useThemeColor } from "@/src/components/Themed";
import { magic } from "@/src/store/MagicAuth";

export default function Settings() {
  const [showCreatePin, setShowCreatePin] = useState(false);

  const [showChangePin, setShowChangePin] = useState(false);

  const router = useRouter();

  const logout = useAuthStore(s => s.logout);

  const {
    fanMuted,
    hasPin,
    setFanMuted,
  } = useSettingsStore();

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");

  function signOut() {
    magic.user.logout()
    logout();
    router.replace("/auth/signin");
  }

  useEffect(() => {
    if (!hasPin) {
      setShowCreatePin(true);
    }
  }, [hasPin]);

  fanMuted ? FanWakeWord.mute() : FanWakeWord.unmute();
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: background
      }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >

      <Text style={styles.title}>
        Settings
      </Text>

      <Text style={[styles.header, { color: text }]}>
        Security
      </Text>

      <SettingCard>

        <SettingRow

          title={hasPin ? "Change PIN" : "Set PIN"}

          subtitle="Protect your wallet"

          icon={<Lock size={20} color={sub} />}

          onPress={() => {
            hasPin
              ? setShowChangePin(true)
              : setShowCreatePin(true);
          }}

        />

      </SettingCard>

      <Text style={[styles.header, { color: text }]}>
        Preferences
      </Text>


      <SettingRow

        title="Mute FAN"

        subtitle="Disable voice responses"

        icon={!fanMuted ? <Mic size={20} color={sub} /> : <MicOff size={20} color={sub} />}

        right={

          <Switch

            value={fanMuted}

            onValueChange={setFanMuted}

          />

        }

      />


      <Text style={[styles.header, { color: text }]}>
        Session
      </Text>

      <SettingCard>

        <View
          style={{
            padding: 18
          }}
        >

          <Text
            style={[{
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 12
            }, { color: text }]}
          >

            Keep me logged in

          </Text>

          <SessionSelector />

        </View>

      </SettingCard>

      <Text style={[styles.header, { color: text }]}>
        Personalization
      </Text>
      <ThemeToggle />

      {/* Sign out / lock */}
      <View
        style={{
          marginTop: 40,
          alignItems: "center"
        }}
      >

        <Pressable
          onPress={signOut}
        >

          <Text
            style={{
              color: "#ef4444",
              fontWeight: "700",
              fontSize: 16,
            }}
          >

            Sign Out

          </Text>

        </Pressable>

        <Text
          style={{
            marginTop: 8,
            fontSize: 12,
            color: sub,
            textAlign: "center"
          }}
        >

          Your wallet remains securely stored.

        </Text>

      </View>

      <CreatePinModal

        visible={showCreatePin}

        onClose={() => setShowCreatePin(false)}

      />

      <ChangePinModal

        visible={showChangePin}

        onClose={() => setShowChangePin(false)}

      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 30,
  },

  header: {
    fontSize: 13,
    opacity: .65,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 18,
    marginLeft: 4,
  }

});
