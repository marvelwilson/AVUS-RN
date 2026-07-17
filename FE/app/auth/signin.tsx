import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

import AppInput from "@/src/components/AppInput"; // ← Your input component
import PrimaryButton from "@/src/components/PrimaryButton";
import AuthStatusCard from "@/src/components/AuthStatusCard";
import AuthLoading from "./loading";

import { RPCErrorCode } from '@magic-sdk/react-native-expo';

import { useThemeColor } from "@/src/components/Themed";
import { useAuth } from "@/src/hooks/useAuth";
import { useSettingsStore } from "@/src/store/settings";
import { Image } from "react-native";


export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const subColor = useThemeColor({}, "subtext");
  const pref = useSettingsStore((s) => s.theme);
  const systemTheme = useColorScheme();

  async function handleEmailLogin() {
    if (!email || isLoading) {
      setStatusMessage("Please enter your email address to continue.");
      setStatus("error");
      return;
    }

    setStatus("idle");
    setIsLoading(true);
    try {
      await login({method: "email", email: email});
      setIsLoading(false);
      setStatusMessage("Your wallet is ready. Taking you home…");
      setStatus("success");
      await new Promise(resolve => setTimeout(resolve, 700));
      router.replace("/(protected)/home");
    } catch (e: any) {
      setStatusMessage(e?.message || "We could not sign you in. Please try again.");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (isLoading) return;

    setStatus("idle");
    setIsLoading(true);

    try {
      await login({method: "google"});
      setIsLoading(false);
      setStatusMessage("Your wallet is ready. Taking you home…");
      setStatus("success");
      await new Promise(resolve => setTimeout(resolve, 700));
      router.replace("/(protected)/home");

    } catch (e: any) {
      console.error("Google Login Error:", e);

      switch (e?.code) {
        case RPCErrorCode.MagicLinkExpired:
          setStatusMessage("Your sign-in session expired. Please try again.");
          setStatus("error");
          break;

        case RPCErrorCode.UserAlreadyLoggedIn:
          router.replace("/(protected)/home");
          break;

        default:
          setStatusMessage(e?.message ?? "Google sign-in failed. Please try again.");
          setStatus("error");
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

  if (isLoading) {
    return <AuthLoading />;
  }

  if (status !== "idle") {
    return (
      <View style={[styles.statusContainer, { backgroundColor }]}>
        <Image source={logoImage} style={styles.statusLogo} resizeMode="contain" />
        <AuthStatusCard
          success={status === "success"}
          error={status === "error"}
          title={status === "success" ? "Sign-in successful" : "Sign-in unsuccessful"}
          description={statusMessage}
        />
        {status === "error" ? (
          <PrimaryButton title="Try again" onPress={() => setStatus("idle")} />
        ) : null}
      </View>
    );
  }

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
  statusContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 24,
  },
  statusLogo: {
    width: 110,
    height: 110,
    alignSelf: "center",
  },
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
