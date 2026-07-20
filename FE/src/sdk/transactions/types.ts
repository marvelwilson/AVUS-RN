import type { Address } from "viem";

export interface SendTokenInput {

    recipient: Address;

    amount: bigint;

    destination: {
        chainId: number;
        token: Address;
        symbol?: string;
        network?: string;
    };

    source?: {
        chainId: number;
        token: Address;
        symbol?: string;
        network?: string;
    };

    decimals?: number | string;

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
