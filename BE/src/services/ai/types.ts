import { FanDraft } from "../../modules/fan/dto/chat.dto";

export type AIProviderType =
    | "CHATGPT"
    | "GROK";

export interface AIContext {

    route?: string;

    wallet?: {

        address: string;

        balances?: any[];

    };

    clipboard?: string;

    history?: string[];

}

export type ConversationStatus =
    | "idle"
    | "collecting"
    | "executing"
    | "completed";

export type ConversationAction =
    | "continue"
    | "restart"
    | "cancel";

export interface ConversationState {

    status: ConversationStatus;

    action: ConversationAction;

    draft: FanDraft;

    /**
     * AI is currently asking for
     */
    waitingFor?: keyof FanDraft;

}

export interface AIResponse {

    message: string;

    intent: string;

    confidence: number;

    draft: Partial<FanDraft>;

    waitingFor?: keyof FanDraft;

    action: ConversationAction;

    arguments: Record<string, any>;

    followUps: string[];

}