import type { Address, Hex } from "viem";

export interface IntentCall {
    to: Address;
    value?: bigint;
    data?: Hex;
}

export interface OutputToken {
    chainId: number;
    address: Address;
    amount: bigint;
}

export interface InputToken {
    chainId: number;
    address: Address;
}

export type GasToken =
    | "NATIVE"
    | "SPONSORED"
    | "USDC"
    | "USDT";

export interface SendIntentInput {
    calls: IntentCall[];
    outputTokens: OutputToken[];
    inputTokens?: InputToken[];
    gasToken?: GasToken;
}

export interface CABBreakdown {
    chainId: number;
    address: Address;
    amount: bigint;
}

export interface CABAsset {
    ticker: string;
    amount: bigint;
    decimals: number;
    breakdown: CABBreakdown[];
    usdPrice?: number;
    usdValue?: number;
}

export interface Portfolio {
    assets: CABAsset[];
    tokenCount: number;
    totalUsd?: number;
}

export interface IntentResult {
    uiHash: string;
}

export interface IntentReceipt {
    transactionHash?: string;
    executionChainId?: number;
}
