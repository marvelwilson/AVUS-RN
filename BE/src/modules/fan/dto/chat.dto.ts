export type FanIntent =
    | "buy"
    | "sell"
    | "send"
    | "receive"
    | "swap"
    | "gamefi";

export interface FanDraft {

    intent?: FanIntent;

    address?: string;

    tokenAddress?: string;

    amount?: number;

    token?: string;
    
    network?: string;

    chainId?: number;

    decimals?: number;

    usdBalance?: number;

    tokenPrice?: number;

    destinationUsd?: number;

    fiat?: string;

    paymentMethod?: string;

    withdrawalMethod?: string;

    fromToken?: string;

    toToken?: string;

}

export interface FanChatRequest {

    message: string;

    draft: FanDraft;

    history?: Array<{ role: "user" | "assistant"; text: string }>;

}
