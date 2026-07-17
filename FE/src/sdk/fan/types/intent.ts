export type FanIntentType =
    | "send"
    | "receive"
    | "scan"
    | "history"
    | "portfolio"
    | "balance"
    | "buy"
    | "sell"
    | "swap"
    | "help"
    | "unsupported";

export interface FanIntent {

    intent: FanIntentType;

    confidence: number;

    message: string;

    arguments: Record<string, unknown>;

}