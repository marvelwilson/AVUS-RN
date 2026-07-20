import { SRA_CHAINS, SRA_TOKEN_SYMBOLS } from "./sra.assets";

export default {

    version: 1,

    assistant: {

        name: "FAN",

        provider: "GEMINI",

        language: "en",

    },

    policy: {

        allowedIntents: [

            "send",
            "receive",
            "buy",
            "sell",

            "scan",

            "history",
            "portfolio",
            "balance",

            "help",
            "gamefi",

        ],

        restrictedIntents: [

            "settings",
            "developer",
            "filesystem",
            "private_key",
            "seed_phrase",
            "password",
            "contacts",
            "system",

        ],

        requiredFields: {

            send: [
                "address",
                "amount",
                "token",
                "network",
            ],

            receive: [],

            buy: [
                "amount",
                "fiat",
                "token",
                "network",
                "paymentMethod",
            ],

            sell: [
                "amount",
                "token",
                "fiat",
                "network",
                "withdrawalMethod",
            ],

            swap: [
                "amount",
                "fromToken",
                "toToken",
                "network",
            ],

            gamefi: [],

        },

    },

    ui: {

        suggestions: [

            "Send 20 USD to my copied address",
            "Receive Funds",
            "Scan Wallet",
            "Show Portfolio",
            "Open camera and scan to send 20 USD",
            "Buy USDC",

        ],

    },

    assets: {

        fiat: [

            {
                symbol: "USD",
                name: "US Dollar",
            },

            {
                symbol: "NGN",
                name: "Nigerian Naira",
            },

        ],

        legacySupportedChains: [

            {

                id: "ETHEREUM",

                name: "Ethereum",

                chainId: 1,

                nativeToken: "ETH",

                enabled: true,

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",
                    "USDT",
                    "DAI",
                    "WBTC",

                ],

            },

            {

                id: "ARBITRUM",

                name: "Arbitrum",

                chainId: 42161,

                enabled: true,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",
                    "USDT",
                    "DAI",
                    "WBTC",

                ],

            },

            {

                id: "BASE",

                name: "Base",

                chainId: 8453,

                enabled: true,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",
                    "USDT",
                    "DAI",

                ],

            },

            {

                id: "OPTIMISM",

                name: "Optimism",

                chainId: 10,

                enabled: true,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",
                    "USDT",
                    "DAI",
                    "WBTC",

                ],

            },

            {

                id: "POLYGON",

                name: "Polygon",

                chainId: 137,

                enabled: false,

                nativeToken: "POL",

                supportedTokens: [

                    "WETH",
                    "USDC",
                    "USDT",
                    "DAI",
                    "WBTC",

                ],

            },

            {

                id: "BSC",

                name: "BNB Smart Chain",

                chainId: 56,

                enabled: false,

                nativeToken: "BNB",

                supportedTokens: [

                    "WETH",
                    "USDC",
                    "USDT",

                ],

            },

            {

                id: "LINEA",

                name: "Linea",

                chainId: 59144,

                enabled: false,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",
                    "USDT",
                    "DAI",
                    "WBTC",

                ],

            },

            {

                id: "SCROLL",

                name: "Scroll",

                chainId: 534352,

                enabled: false,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",
                    "USDT",
                    "WBTC",

                ],

            },

            {

                id: "MODE",

                name: "Mode",

                chainId: 34443,

                enabled: false,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",
                    "USDT",
                    "WBTC",

                ],

            },

            {

                id: "BLAST",

                name: "Blast",

                enabled: false,

                supportedTokens: [

                    "WBTC",

                ],

            },

            {

                id: "WORLD",

                name: "World Chain",

                enabled: false,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",
                    "WBTC",

                ],

            },

            {

                id: "UNICHAIN",

                name: "Unichain",

                enabled: false,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",

                ],

            },

            {

                id: "HYPEREVM",

                name: "HyperEVM",

                enabled: false,

                supportedTokens: [

                    "USDC",
                    "USDT",

                ],

            },

            {

                id: "SONEIUM",

                name: "Soneium",

                enabled: false,

                nativeToken: "ETH",

                supportedTokens: [

                    "ETH",
                    "WETH",
                    "USDC",

                ],

            },

            {

                id: "MONAD",

                name: "Monad",

                enabled: false,

                supportedTokens: [

                    "USDC",
                    "USDT",

                ],

            },

            {

                id: "TEMPO",

                name: "Tempo",

                enabled: false,

                supportedTokens: [

                    "USDC.e",

                ],

            },

        ],

        supportedChains: SRA_CHAINS,

        legacySupportedTokens: [

            "ETH",
            "WETH",
            "USDC",
            "USDT",
            "DAI",
            "WBTC",
            "USDC.e",

        ],

        supportedTokens: SRA_TOKEN_SYMBOLS,

        paymentMethods: [

            "BANK_TRANSFER",
            "CARD",

        ],

    },

};
