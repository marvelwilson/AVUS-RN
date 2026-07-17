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
  MicOff,
  Fuel,
  Download,
} from "lucide-react-native";

import ThemeToggle from "@/src/components/ThemeToggle";

import SessionSelector from "@/src/components/settings/SessionSelector";
import SettingCard from "@/src/components/settings/SettingCard";
import SettingRow from "@/src/components/settings/SettingRow";

import ChangePinModal from "@/src/components/settings/ChangePinModal";
import CreatePinModal from "@/src/components/settings/CreatePinModal";

import { useSettingsStore } from "@/src/store/settings";


import { useThemeColor } from "@/src/components/Themed";
import { AuthService } from "@/src/services";
import STTService from "@/src/sdk/fan/services/stt.service";
import WakeWordService from "@/src/sdk/fan/services/wakeword.service";
import { Platform } from "react-native";
import { StatusModal } from "@/src/store/status-modal";

export default function Settings() {
  const [showCreatePin, setShowCreatePin] = useState(false);

  const [showChangePin, setShowChangePin] = useState(false);

  const router = useRouter();


  const {
    fanMuted,
    hasPin,
    setFanMuted,
    sponsoredGas,
    gasSponsorshipEligible,
    setSponsoredGas,
  } = useSettingsStore();

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const sub = useThemeColor({}, "subtext");

  function signOut() {
    AuthService.logout()
    router.replace("/auth/signin");
  }

  useEffect(() => {
    if (!hasPin) {
      setShowCreatePin(true);
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

      {Platform.OS === "android" ? (
        <SettingRow
          title="Offline FAN voice"
          subtitle="Download English voice recognition to avoid network disconnects"
          icon={<Download size={20} color={sub} />}
          onPress={() => {
            void STTService.downloadOfflineModel().then((result) => {
              if (result.status === "download_success") WakeWordService.start();
              StatusModal.show({ title: "FAN voice", description: result.status === "download_success" ? "Offline English is ready." : "Follow the system prompt to finish the voice download.", kind: result.status === "download_success" ? "success" : "info" });
            }).catch(() => StatusModal.error("FAN voice", "The offline voice model could not be downloaded on this device."));
          }}
        />
      ) : null}

      <SettingRow
        title="Sponsored gas"
        subtitle={!gasSponsorshipEligible ? "Not currently available for this account" : sponsoredGas ? "AVUS sponsors eligible transactions" : "Available — gas is currently paid from your CAB balance"}
        icon={<Fuel size={20} color={sub} />}
        right={<Switch value={sponsoredGas} disabled={!gasSponsorshipEligible} onValueChange={setSponsoredGas} />}
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
