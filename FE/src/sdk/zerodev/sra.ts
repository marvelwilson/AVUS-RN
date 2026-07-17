

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
    async getOrCreate(owner: AddressType) {

        const transferToOwnerCall = createCall({
            target: FLEX.TOKEN_ADDRESS,
            value: 0n,
            abi: erc20Abi,
            functionName: "transfer",
            args: [
                owner,
                FLEX.AMOUNT,
            ],
        });

        const transferNativeCall = createCall({
            target: owner,
            value: FLEX.NATIVE_AMOUNT,
        })

        return createSmartRoutingAddress({

            owner,

            destChain: arbitrum,

            slippage: 5000,

            actions: {

                ERC20: {

                    action: [transferToOwnerCall],

                    fallBack: [transferToOwnerCall],

                },

                USDC: {

                    action: [transferToOwnerCall],

                    fallBack: [transferToOwnerCall],

                },

                WRAPPED_NATIVE: {

                    action: [transferToOwnerCall],

                    fallBack: [transferToOwnerCall],

                },

                NATIVE: {

                    action: [transferNativeCall],

                    fallBack: [transferNativeCall],

                },

            },

            srcTokens: SUPPORTED_SOURCE_TOKENS,

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
