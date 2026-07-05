import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

import AppInput from "@/src/components/AppInput"; // ← Your input component
import PrimaryButton from "@/src/components/PrimaryButton";

import { RPCErrorCode } from '@magic-sdk/react-native-expo';

import { useThemeColor } from "@/src/components/Themed";
import { useAuthStore } from "@/src/store/auth";
import { magic } from "@/src/store/MagicAuth";
import { useSettingsStore } from "@/src/store/settings";
import { emailToUsername } from "@/src/utils/EmailtoUsername";
import { Image } from "react-native";


export default function SignIn() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const subColor = useThemeColor({}, "subtext");
  const pref = useSettingsStore((s) => s.theme);
  const systemTheme = useColorScheme();

  const setSessionDuration = useSettingsStore(
    s => s.setSessionDuration
  );

  async function handleEmailLogin() {
    if (!email || isLoading) {
      console.log("Validation failed");
      Alert.alert("Error", "Please enter your email");
      return;
    }


    setIsLoading(true);
    try {
      const didToken = await magic.auth.loginWithEmailOTP({
        email,
      });

      const username = emailToUsername(email);

      login({
        id: didToken ?? "",
        name: username,
        email,
      });

      // Default every successful login to 1 day
      await setSessionDuration(1);

      router.replace("/(protected)/home");
    } catch (e: any) {
      Alert.alert("Login Failed", e?.message || "Please try again");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await magic.oauth.loginWithPopup({
        provider: "google",
        redirectURI: "avuswalletfe://auth/signin",
      });

      // Verify Magic authentication
      const loggedIn = await magic.user.isLoggedIn();

      if (!loggedIn) {
        throw new Error("Google login was not completed.");
      }

      // Retrieve the authenticated user's information
      const metadata = await magic.user.getInfo();

      const username = emailToUsername(metadata.email ?? '');
      login({
        id: metadata.issuer ?? '',
        name: username,
        email: metadata.email ?? "",
      });

      await setSessionDuration(1);

      router.replace("/(protected)/home");

    } catch (e: any) {
      console.error("Google Login Error:", e);

      switch (e?.code) {
        case RPCErrorCode.MagicLinkExpired:
          Alert.alert("Session Expired", "Please try again.");
          break;

        case RPCErrorCode.UserAlreadyLoggedIn:
          router.replace("/(protected)/home");
          break;

        default:
          Alert.alert(
            "Google Login Failed",
            e?.message ?? "Please try again."
          );
      }
    } finally {
      setIsLoading(false);
    }
  }
  const theme =
    pref === "system"
      ? systemTheme
      : pref;

  const logoImage =
    theme === "dark"
      ? require("@/assets/images/icon-white.png")
      : require("@/assets/images/icon-black.png");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.logoContainer}>
        <Image
          source={logoImage}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.title, { color: textColor }]}>
        Welcome to AVUS
      </Text>

      <Text style={[styles.subtitle, { color: subColor }]}>
        A smart wallet for your digital life
      </Text>

      <Text style={[styles.description, { color: subColor }]}>
        Continue with your email to securely access or create your account in seconds.
      </Text>

      <View style={{ marginTop: 40, gap: 16 }}>
        {/* Email Input */}
        <AppInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Email Login Button */}
        <PrimaryButton
          title={isLoading ? "Sending OTP..." : "Continue with Email"}
          onPress={handleEmailLogin}
        />
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={[styles.or, { color: subColor }]}>
            OR
          </Text>
          <View style={styles.line} />
        </View>
        {/* Google Login Button */}

        <TouchableOpacity style={styles.googleButton} onPress={isLoading ? () => true : handleGoogleLogin}>

          <Text style={styles.googleIcon}>
            G
          </Text>

          <Text style={styles.googleText}>
            {isLoading ? "Connecting..." : "Continue with Google"}
          </Text>

        </TouchableOpacity>
      </View>

      <Text style={[styles.hint, { color: subColor }]}>
        Secure login powered by Magic • No password needed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logo: { fontSize: 32, fontWeight: "800" },
  title: { fontSize: 34, fontWeight: "700", marginTop: 24, textAlign: "center", },
  subtitle: { marginTop: 10, fontSize: 18, textAlign: "center", },
  hint: {
    marginTop: 32,
    fontSize: 12,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#333"
  },

  or: {
    marginHorizontal: 16,
    opacity: .5,
    fontWeight: "600"
  },
  googleButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDD"
  },

  googleIcon: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4285F4",
    marginRight: 12
  },

  googleText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600"
  },

  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    opacity: 0.75,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },

  logoImage: {
    width: 180,
    height: 180,
  },
});