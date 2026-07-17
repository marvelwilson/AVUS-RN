import type {

    ConversationAction,

    FanDraft,

} from "@/src/store/fan-draft";

export interface FanChatRequest {

    message: string;

    draft: FanDraft;

    history?: Array<{ role: "user" | "assistant"; text: string }>;

}

export interface FanChatResponse {

    message: string;

    intent: string;

    confidence: number;

    draft: Partial<FanDraft>;

    arguments: Record<string, any>;

    followUps: string[];

    waitingFor?: keyof FanDraft;

    action: ConversationAction;

}
