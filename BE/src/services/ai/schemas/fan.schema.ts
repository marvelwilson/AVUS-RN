import { network } from "hardhat";

export default {

    name: "fan_response",

    strict: true,

    schema: {

        type: "object",

        properties: {

            /**
             * Message FAN speaks
             */
            message: {

                type: "string",

            },

            /**
             * What FAN should do
             */
            intent: {

                type: "string",

                enum: [

                    "collect_information",

                    "send",

                    "receive",

                    "buy",

                    "sell",

                    "swap",

                    "scan",

                    "history",

                    "portfolio",

                    "balance",

                    "copy_wallet",

                    "help",

                    "gamefi",

                    "unsupported",

                ],

            },

            /**
             * Continue / Restart / Cancel
             */
            action: {

                type: "string",

                enum: [

                    "continue",

                    "restart",

                    "cancel",

                ],

            },

            confidence: {

                type: "number",

            },

            /**
             * Draft updates only
             */
            draft: {

                type: "object",

                properties: {

                    intent: {
                        type: "string",
                    },

                    address: {
                        type: "string",
                    },

                    tokenAddress: {
                        type: "string",
                    },

                    amount: {
                        type: "number",
                    },

                    token: {
                        type: "string",
                    },

                    network: {
                        type: "string",
                    },

                    chainId: {
                        type: "number",
                    },

                    decimals: {
                        type: "number",
                    },

                    usdBalance: {
                        type: "number",
                    },

                    tokenPrice: {
                        type: "number",
                    },

                    destinationUsd: {
                        type: "number",
                    },

                    fiat: {
                        type: "string",
                    },

                    paymentMethod: {
                        type: "string",
                    },

                    withdrawalMethod: {
                        type: "string",
                    },

                    fromToken: {
                        type: "string",
                    },

                    toToken: {
                        type: "string",
                    },
                },

                required: [

                    "intent",

                    "address",

                    "tokenAddress",

                    "amount",

                    "token",

                    "network",

                    "chainId",

                    "decimals",

                    "usdBalance",

                    "tokenPrice",

                    "destinationUsd",

                    "fiat",

                    "paymentMethod",

                    "withdrawalMethod",

                    "fromToken",

                    "toToken",

                ],

                additionalProperties: false,
            },

            /**
             * Only ONE missing field
             */
            waitingFor: {

                type: "string",

                enum: [

                    "intent",

                    "address",

                    "tokenAddress",

                    "amount",

                    "token",

                    "network",

                    "chainId",

                    "decimals",

                    "usdBalance",

                    "tokenPrice",

                    "destinationUsd",

                    "fiat",

                    "paymentMethod",

                    "withdrawalMethod",

                    "fromToken",

                    "toToken",

                    "",

                ],

            },

            /**
             * Navigation arguments
             */
            arguments: {

                type: "object",

                properties: {

                    intent: {
                        type: "string",
                    },

                    address: {
                        type: "string",
                    },

                    tokenAddress: {
                        type: "string",
                    },

                    amount: {
                        type: "number",
                    },

                    token: {
                        type: "string",
                    },

                    network: {
                        type: "string",
                    },

                    chainId: {
                        type: "number",
                    },

                    decimals: {
                        type: "number",
                    },

                    usdBalance: {
                        type: "number",
                    },

                    tokenPrice: {
                        type: "number",
                    },

                    destinationUsd: {
                        type: "number",
                    },

                    fiat: {
                        type: "string",
                    },

                    paymentMethod: {
                        type: "string",
                    },

                    withdrawalMethod: {
                        type: "string",
                    },

                    fromToken: {
                        type: "string",
                    },

                    toToken: {
                        type: "string",
                    },

                },

                required: [

                    "tokenAddress",

                    "amount",

                    "token",

                    "network",

                    "fiat",

                    "paymentMethod",

                    "withdrawalMethod",

                    "fromToken",

                    "toToken",

                ],

                additionalProperties: false,

            },

            followUps: {

                type: "array",

                items: {

                    type: "string",

                },

            },

        },

        required: [

            "message",

            "intent",

            "action",

            "confidence",

            "draft",

            "waitingFor",

            "arguments",

            "followUps",

        ],

        additionalProperties: false,

    },

};
