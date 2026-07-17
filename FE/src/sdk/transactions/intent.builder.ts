import {
    encodeFunctionData,

    erc20Abi,
    zeroAddress,
} from "viem";

import type {
    SendTokenInput,

    TransactionBundle,
} from "./types";

export class TransactionBuilder {

    /**
     * ERC20 Transfer
     */
    static sendToken({

        recipient,

        token,

        amount,

        destinationChainId,

        sourceChainId,

    }: SendTokenInput): TransactionBundle {

        const isNative = token.toLowerCase() === zeroAddress;

        return {

            calls: [

                isNative ? {
                    to: recipient,
                    value: amount,
                    data: "0x",
                } : {

                    to: token,

                    value: 0n,

                    data:

                        encodeFunctionData({

                            abi:

                                erc20Abi,

                            functionName:

                                "transfer",

                            args: [

                                recipient,

                                amount,

                            ],

                        }),

                },

            ],

            outputTokens: [

                {

                    chainId:

                        destinationChainId,

                    address:

                        token,

                    amount,

                },

            ],

            inputTokens:

                sourceChainId

                    ? [

                        {

                            chainId:

                                sourceChainId,

                            address:

                                token,

                        },

                    ]

                    : undefined,

        };

    }

}
