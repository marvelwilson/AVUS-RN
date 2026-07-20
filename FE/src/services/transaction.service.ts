import {
    TransactionBuilder,
} from "@/src/sdk/transactions";
import {
    estimateIntent,
    sendIntent,
    waitForIntent,
} from "@/src/sdk/intent";

import HistoryService from './history.service';
import WalletService from './wallet.service';
import type {

    SendTokenInput,

} from "@/src/sdk/transactions";
import { useWalletStore } from "@/src/store/wallet";
import transactionApi from "@/src/api/transaction.api";
import { zeroAddress } from "viem";
import { useSettingsStore } from "@/src/store/settings";
import PolicyManager from "@/src/sdk/fan/policy/manager";

type TransactionRecord = { _id: string };

class TransactionService {
    async estimate(input: SendTokenInput) {
        const { sponsoredGas } = useSettingsStore.getState();

        if (sponsoredGas) {
            return {
                sponsored: true,
                feeToken: "SPONSORED",
                feeAmount: 0,
                feeUsd: 0,
            };
        }

        console.log(input)
        const bundle = TransactionBuilder.sendToken(input);

        const estimate = await estimateIntent({
            ...bundle,
            gasToken: "USDC",
        });

        console.log(estimate)

        const feeAmount = estimate.gasPaymentTokens.reduce(
            (total, token) =>
                total + Number(token.amount) / Math.pow(10, token.decimals ?? 6),
            0,
        );

        return {
            sponsored: false,
            feeToken:
                estimate.gasPaymentTokens[0]?.symbol ??
                estimate.gasPaymentTokens[0]?.ticker ??
                "USDC",
            feeAmount,
            feeUsd: feeAmount, // replace with price conversion later
        };
    }


    async send(
        input: SendTokenInput,
    ) {
        console.log(input)
        const from = useWalletStore.getState().kernel
        /**
         * Create Pending Transaction
         */
        const { data } = await transactionApi.create({
            type: "SEND",

            amount: input.amount.toString(),

            sender: from,

            recipient: input.recipient,

            destinationAsset: {
                network: input.destination.network,
                chainId: input.destination.chainId,
                token: input.destination.token,
                symbol: input.destination.symbol,
            },

            sourceAsset: input.source ? input.source : undefined,

            metadata: {
                decimals: input.decimals,
            },
        });
        const transaction =
            data.data as TransactionRecord;

        try {

            /**
             * Build Intent
             */
            const bundle =
                TransactionBuilder.sendToken(
                    input,
                );

            /**
             * Send Intent
             */
            const sponsoredGas = useSettingsStore.getState().sponsoredGas;
            const gasToken = sponsoredGas ? "SPONSORED" : "USDC";
            const manifest = PolicyManager.get() ?? await PolicyManager.load();
            const arbitrumPolicy = manifest.assets.supportedChains.find(({ chainId }) => chainId === 42161);
            const gasTokenAddress = arbitrumPolicy?.tokens.find(({ symbol }) => symbol === "USDC")?.address;
            console.log("[ZeroDev gas]", {
                mode: sponsoredGas ? "developer-sponsored" : "user-paid",
                gasToken,
                settlementChain: "Arbitrum",
                tokenAddress: gasTokenAddress,
                sponsorsAllUsers: sponsoredGas,
            });
            const { uiHash } = await sendIntent({
                ...bundle,
                gasToken,
            });

            /**
             * Intent Submitted
             */
            await transactionApi.update(

                transaction._id,

                {

                    status:
                        "PROCESSING",

                    intentId:
                        uiHash,

                },

            );

            /**
             * Wait
             */
            const receipt =
                await waitForIntent(

                    uiHash,

                );

            if (!receipt) {
                throw new Error("The intent was submitted but no execution receipt was returned.");
            }

            /**
             * Intent Failed
             */
            if (

                receipt?.receipt?.status ===
                "reverted"

            ) {

                await transactionApi.update(

                    transaction._id,

                    {

                        status:
                            "FAILED",

                    },

                );

                throw new Error(
                    "Transaction reverted.",
                );

            }

            /**
             * Success
             */
            await transactionApi.update(

                transaction._id,

                {

                    status:
                        "SUCCESS",

                    txHash:
                        receipt.receipt
                            .transactionHash,

                },

            );

            await WalletService.refresh();

            return { receipt, uiHash };

        } catch (error) {

            await transactionApi.update(

                transaction._id,

                {

                    status:
                        "FAILED",

                },

            );

            await WalletService.refresh();

            throw error;

        }

    }

}

export default new TransactionService();
