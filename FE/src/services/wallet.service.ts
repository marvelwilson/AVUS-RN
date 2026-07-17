import { useAuthStore } from "@/src/store/auth";
import { useWalletStore } from "@/src/store/wallet";

import walletApi from "@/src/api/wallet.api";

import { magic } from "@/src/sdk/magic";

import SmartRoutingService from "@/src/sdk/zerodev";

import {

    getPortfolio

} from "@/src/sdk/intent";


import {

    getWalletAddress,

} from "@/src/sdk/magic";

import type {

    SendTokenInput,

} from "@/src/sdk/transactions";

import {

    SUPPORTED_SOURCE_TOKENS,

} from "@/src/constants";

class WalletService {

    /**
     * Initialize
     */
    async initialize() {

        if (useWalletStore.getState().initialized) {

            return this.refresh();

        }

        const eoa = await getWalletAddress();


        const existing =
            await walletApi.getWallet();

        let sra =
            existing?.smartAccountAddress;

        if (!sra) {

            const created =
                await SmartRoutingService.getOrCreate(
                    eoa,
                );

            sra =
                created.smartRoutingAddress;

            await walletApi.register({

                embeddedAddress:
                    eoa,

                smartAccountAddress:
                    sra,

                network:
                    "ARBITRUM",

            });

        }

        const status =
            await SmartRoutingService.status(
                sra,
            );

        const portfolio =
            await getPortfolio();

        useWalletStore
            .getState()
            .setWallet({

                eoa,

                sra,

            });

        useWalletStore
            .getState()
            .setStatus(
                status,
            );

        useWalletStore
            .getState()
            .updatePortfolio({

                balances:
                    portfolio.assets,

                totalUsd:
                    portfolio.totalUsd,

            });

        return {

            eoa,

            sra,

            status,

            portfolio,

        };

    }

    /**
     * Refresh Portfolio
     */
    async refresh() {

        const {

            sra,

        } =
            useWalletStore.getState();

        if (!sra) {

            return;

        }

        const [

            portfolio,

            status,

        ] =
            await Promise.all([

                getPortfolio(),

                SmartRoutingService.status(
                    sra,
                ),

            ]);

        useWalletStore
            .getState()
            .setStatus(
                status,
            );

        useWalletStore
            .getState()
            .updatePortfolio({

                balances:
                    portfolio.assets,

                totalUsd:
                    portfolio.totalUsd,

            });

        return {

            portfolio,

            status,

        };

    }

    receive() {

        const {

            eoa,

            sra,

            kernel,

        } =
            useWalletStore.getState();

        return {

            depositAddress: sra,

            qrValue: sra,

            ownerAddress: eoa,

            kernelAddress: kernel,

            supportedChains:
                SUPPORTED_SOURCE_TOKENS,

        };

    }

    /**
     * Withdraw Everything
     */
    async withdrawAll() {

        const {

            sra,

        } =
            useWalletStore.getState();

        if (!sra) {

            throw new Error(
                "Wallet not initialized.",
            );

        }

        /**
         * We'll implement this
         * using SRA + 7702.
         */
        return SmartRoutingService.withdraw(
            sra,
        );

    }

    /**
     * Logout
     */
    logout() {


        useWalletStore
            .getState()
            .clearWallet();

    }
    async getAddress() {

        const {

            eoa,

        } = useWalletStore.getState();

        if (!eoa) {

            throw new Error(
                "Wallet not initialized.",
            );

        }

        return eoa;

    }

}

export default new WalletService();