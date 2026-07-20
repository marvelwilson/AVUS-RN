import "react-native-get-random-values";

import { OAuthExtension } from "@magic-ext/react-native-expo-oauth";
import { Magic } from "@magic-sdk/react-native-expo";
import { EVMExtension } from '@magic-ext/evm';

const publishableKey = process.env.EXPO_PUBLIC_MAGIC_PUBLISHABLE_KEY;

if (!publishableKey) {
    throw new Error(
        "Missing EXPO_PUBLIC_MAGIC_PUBLISHABLE_KEY."
    );
}

export const magic = new Magic(
    publishableKey!,
    {
        extensions: [
            new OAuthExtension(),
            new EVMExtension([
                { rpcUrl: 'https://arb1.arbitrum.io/rpc', chainId: 42161 }, // Arbitrum (0xa4b1)
            ]),
        ],
    }
);
