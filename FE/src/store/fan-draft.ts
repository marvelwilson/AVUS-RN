import { create } from "zustand";

export type FanIntent =
    | "buy"
    | "sell"
    | "send"
    | "receive"
    | "swap"
    | "gamefi";

export type ConversationAction =
    | "continue"
    | "restart"
    | "cancel";

export type ConversationStatus =
    | "idle"
    | "collecting"
    | "executing"
    | "completed";

export interface FanMessage {

    id: string;

    role:

    | "user"

    | "assistant";

    text: string;

    createdAt: number;

}

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

export interface ConversationState {

    status: ConversationStatus;

    action: ConversationAction;

    draft: FanDraft;

    /**
     * AI is currently asking for
     */
    waitingFor?: keyof FanDraft;

    messages?: FanMessage[];

}

interface FanDraftStore {

    conversation: ConversationState;

    merge(
        values: Partial<FanDraft>,
    ): void;

    restart(
        values?: Partial<FanDraft>,
    ): void;

    cancel(): void;

    complete(): void;

    setWaitingFor(
        field?: keyof FanDraft,
    ): void;

    setStatus(
        status: ConversationStatus,
    ): void;

    reset(): void;

    addUserMessage(
        text: string,
    ): void;

    addAssistantMessage(
        text: string,
    ): void;


}

const initialConversation: ConversationState = {

    status: "idle",

    action: "continue",

    draft: {},

    waitingFor: undefined,

    messages: [],

};

export const useFanDraftStore =
    create<FanDraftStore>((set) => ({

        conversation: initialConversation,

        merge(values) {

            const clean = Object.fromEntries(
                Object.entries(values).filter(([, value]) =>
                    value !== undefined && value !== null && value !== "" &&
                    !(typeof value === "number" && (!Number.isFinite(value) || value <= 0)),
                ),
            ) as Partial<FanDraft>;

            set(state => ({

                conversation: {

                    ...state.conversation,

                    action: "continue",

                    draft: {

                        ...state.conversation.draft,

                        ...clean,

                    },

                },

            }));

        },

        restart(values = {}) {

            set(state => ({

                conversation: {

                    status: "collecting",

                    action: "restart",

                    waitingFor: undefined,

                    draft: values,
                    messages: state.conversation.messages ?? [],

                },

            }));

        },

        cancel() {

            set({

                conversation: {

                    status: "idle",

                    action: "cancel",

                    waitingFor: undefined,

                    draft: {},
                    messages: [],

                },

            });

        },

        complete() {

            set(state => ({

                conversation: {

                    ...state.conversation,

                    status: "completed",

                },

            }));

        },

        setWaitingFor(waitingFor) {

            set(state => ({

                conversation: {

                    ...state.conversation,

                    waitingFor,

                },

            }));

        },

        setStatus(status) {

            set(state => ({

                conversation: {

                    ...state.conversation,

                    status,

                },

            }));

        },

        reset() {

            set({

                conversation: initialConversation,

            });

        },

        addUserMessage(text) {

            set(state => ({

                conversation: {

                    ...state.conversation,

                    messages: [
                        ...(state.conversation.messages ?? []),
                        { id: `${Date.now()}-user`, role: "user", text, createdAt: Date.now() },
                    ].slice(-12),

                },

            }));

        },

        addAssistantMessage(text) {

            set(state => ({

                conversation: {

                    ...state.conversation,

                    messages: [
                        ...(state.conversation.messages ?? []),
                        { id: `${Date.now()}-assistant`, role: "assistant", text, createdAt: Date.now() },
                    ].slice(-12),

                },

            }));

        },

    }));
