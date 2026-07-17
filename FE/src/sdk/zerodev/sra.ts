

import {
    createCall,
    createSmartRoutingAddress,
    FLEX,
    getSmartRoutingAddressStatus,
    getWithdrawTokensCalls,
} from "@zerodev/smart-routing-address";

import { SUPPORTED_SOURCE_TOKENS } from "@/src/constants";
import type { AddressType, WithdrawToken } from "@/src/sdk/zerodev/types"; // adjust path
import { erc20Abi } from "viem";
import { arbitrum } from "viem/chains";


class SmartRoutingService {



    /**
     * Get / Create Smart Routing Address
     */
    async getOrCreate(owner: AddressType, cabAddress: AddressType) {

        const transferToCabCall = createCall({
            target: FLEX.TOKEN_ADDRESS,
            value: 0n,
            abi: erc20Abi,
            functionName: "transfer",
            args: [
                cabAddress,
                FLEX.AMOUNT,
            ],
        });

        const transferNativeCall = createCall({
            target: cabAddress,
            value: FLEX.NATIVE_AMOUNT,
        })

        const routedTokenAction = {
            action: [transferToCabCall],
            fallBack: [transferToCabCall],
        };

        return createSmartRoutingAddress({

            owner,

            destChain: arbitrum,

            slippage: 5000,

            actions: {

                ERC20: {

                    action: [transferToCabCall],

                    fallBack: [transferToCabCall],

                },

                USDC: {

                    action: [transferToCabCall],

                    fallBack: [transferToCabCall],

                },

                WETH: routedTokenAction,

                USDT: routedTokenAction,

                DAI: routedTokenAction,

                WBTC: routedTokenAction,

                WRAPPED_NATIVE: {

                    action: [transferToCabCall],

                    fallBack: [transferToCabCall],

                },

                NATIVE: {

                    action: [transferNativeCall],

                    fallBack: [transferNativeCall],

                },

            },

            srcTokens: SUPPORTED_SOURCE_TOKENS,

            allowPartialRoutes: true,

        });

    }

    /**
     * Status
     */
    async status(address: AddressType) {
        return getSmartRoutingAddressStatus({
            smartRoutingAddress: address,
        });
    }

    /**
     * Withdraw
     */
    async withdrawCalls(
        smartRoutingAddress: AddressType,
        tokens: WithdrawToken[],
    ) {

        return getWithdrawTokensCalls({

            smartRoutingAddress,

            tokens,

        });

    }

    async withdraw(smartRoutingAddress: AddressType) {
        const status = await this.status(smartRoutingAddress);
        const seen = new Set<string>();
        const tokens = status.deposits.flatMap(({ deposit }) => {
            const key = `${deposit.chainId}:${deposit.token.toLowerCase()}`;
            if (seen.has(key)) return [];
            seen.add(key);
            return [{ chainId: deposit.chainId, token: deposit.token }];
        });

        if (!tokens.length) {
            throw new Error("No SRA deposits are available to withdraw.");
        }

        return this.withdrawCalls(smartRoutingAddress, tokens);
    }

    async portfolio(
        smartRoutingAddress: AddressType
    ) {

        /**
         * get CAB
         */

    }

    depositAddress(
        sra: AddressType
    ) {
        return sra;
    }

}

export default new SmartRoutingService();
