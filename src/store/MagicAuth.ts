import { OAuthExtension } from "@magic-ext/react-native-expo-oauth";
import { Magic } from "@magic-sdk/react-native-expo";

export const magic = new Magic(
    process.env.EXPO_PUBLIC_MAGIC_PUBLISHABLE_KEY!,
    {
        extensions: [new OAuthExtension()],
    }
);