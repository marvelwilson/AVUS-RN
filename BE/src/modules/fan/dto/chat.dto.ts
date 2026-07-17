export type FanIntent =
    | "buy"
    | "sell"
    | "send"
    | "receive"
    | "swap"
    | "gamefi";

export interface FanDraft {

    intent?: FanIntent;

    recipient?: string;

    amount?: number;

    token?: string;

    chain?: string;

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
