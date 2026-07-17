import type { Address } from "viem";

export interface SendTokenInput {

    recipient: Address;

    token: Address;

    amount: bigint;

    destinationChainId: number;

    sourceChainId?: number;

    tokenSymbol?: string;

    decimals?: number;

}

export interface TransactionBundle {

    calls: {

        to: Address;

        value: bigint;

        data: `0x${string}`;

    }[];

    outputTokens: {

        chainId: number;

        address: Address;

        amount: bigint;

    }[];

    inputTokens?: {

        chainId: number;

        address: Address;

    }[];

}
