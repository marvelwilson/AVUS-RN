import { useAuthStore } from "@/src/store/auth";
import { useWalletStore } from "@/src/store/wallet";

import walletApi from "@/src/api/wallet.api";

import { magic } from "@/src/sdk/magic";

import SmartRoutingService from "@/src/sdk/zerodev";
import { SRA_CONFIG_VERSION } from "@/src/sdk/zerodev/constants";

import {

    getPortfolio,

} from "@/src/sdk/intent";
import { getIntentAccountAddress } from "@/src/sdk/intent/client";


import {

    getWalletAddress,

} from "@/src/sdk/magic";

import {

    SUPPORTED_SOURCE_TOKENS,

} from "@/src/constants";

class WalletService {

    /**
     * Initialize
     */
    async initialize() {

        const eoa = await getWalletAddress();

        const kernel = await getIntentAccountAddress();


        const existing =
            await walletApi.getWallet();

        const created =
            await SmartRoutingService.getOrCreate(
                eoa,
                kernel,
            );

        const sra = created.smartRoutingAddress;

        const backendSra = existing?.smartAccountAddress?.toLowerCase();
        const resolvedSra = sra.toLowerCase();
        const backendKernel = existing?.kernelAddress?.toLowerCase();
        const resolvedKernel = kernel.toLowerCase();
        console.log({
            backendSra,
            resolvedSra,
            backendKernel,
            resolvedKernel,
            backendVersion: existing?.sraConfigVersion,
            currentVersion: SRA_CONFIG_VERSION,
        });
        if (backendSra !== resolvedSra || backendKernel !== resolvedKernel || existing?.sraConfigVersion !== SRA_CONFIG_VERSION) {

            await walletApi.register({

                embeddedAddress:
                    eoa,

                smartAccountAddress:
                    sra,

                kernelAddress:
                    kernel,

                network:
                    "ARBITRUM",

                sraConfigVersion:
                    SRA_CONFIG_VERSION,

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

                kernel,

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
