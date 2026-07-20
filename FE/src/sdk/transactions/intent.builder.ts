import {
    encodeFunctionData,
    erc20Abi,
    zeroAddress,
} from "viem";
import type { Address } from "viem";

import {
    SendTokenInput,
    TransactionBundle,
} from "./types";

export class TransactionBuilder {

    static sendToken({
        recipient,
        amount,
        source,
        destination,
    }: SendTokenInput): TransactionBundle {

        const isNative = destination.token.toLowerCase() === zeroAddress;

        return {

            /**
             * Execute on DESTINATION chain.
             */
            calls: isNative
                ? [{ to: recipient, value: amount, data: "0x" }]
                : [{
                    to: destination.token,
                    value: 0n,
                    data: encodeFunctionData({
                        abi: erc20Abi,
                        functionName: "transfer",
                        args: [recipient, amount],
                    }),
                }],

            /**
             * Destination asset
             */
            outputTokens: [

                {
                    chainId: destination.chainId,
                    address: destination.token,
                    amount,
                },

            ],

            /**
             * Optional source restriction.
             *
             * If omitted,
             * ZeroDev automatically chooses
             * the best chain.
             */
            inputTokens:
                source
                    ? [
                        {
                            chainId: source.chainId,
                            address: source.token,
                        },
                    ]
                    : undefined,

        };
    }
}
