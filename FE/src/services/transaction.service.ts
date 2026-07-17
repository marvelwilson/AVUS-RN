import {
    TransactionBuilder,
} from "@/src/sdk/transactions";
import {
    sendIntent,
    waitForIntent,
} from "@/src/sdk/intent";

import HistoryService from './history.service';
import WalletService from './wallet.service';
import type {

    SendTokenInput,

} from "@/src/sdk/transactions";

import transactionApi from "@/src/api/transaction.api";
import { zeroAddress } from "viem";
import { useSettingsStore } from "@/src/store/settings";
import { getChainName } from "@/src/constants/chains";

type TransactionRecord = { _id: string };

class TransactionService {

    async send(
        input: SendTokenInput,
    ) {

        const from =
            await WalletService.getAddress();

        /**
         * Create Pending Transaction
         */
        const { data } =
            await transactionApi.create({

                type: "SEND",

                source: "MANUAL",

                network: getChainName(input.destinationChainId),

                chainId: input.destinationChainId,

                token: input.tokenSymbol ?? (input.token.toLowerCase() === zeroAddress ? "ETH" : input.token),

                amount: input.amount.toString(),

                sender: from,

                recipient: input.recipient,

                metadata: { decimals: input.decimals ?? 18 },

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
            const { uiHash } = await sendIntent({
                ...bundle,
                gasToken: sponsoredGas ? "SPONSORED" : undefined,
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
