import { create } from "zustand";

export interface TransactionRecord {
    _id: string;
    type: string;
    source: string;
    status: string;
    network: string;
    chainId?: number;
    token: string;
    amount: string;
    sender?: string;
    recipient?: string;
    txHash?: string;
    intentId?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

interface HistoryState {

    items: TransactionRecord[];

    cursor?: string;

    hasMore: boolean;

    loading: boolean;

    setLoading(loading: boolean): void;

    setHistory: (

        items: TransactionRecord[],

        cursor?: string,

        hasMore?: boolean,

    ) => void;

    appendHistory: (

        items: TransactionRecord[],

        cursor?: string,

        hasMore?: boolean,

    ) => void;

    update(
        transaction: TransactionRecord,
    ): void;

    upsert(
        transaction: TransactionRecord,
    ): void;

    clear: () => void;

}

export const useHistoryStore =
    create<HistoryState>((set) => ({

        items: [],

        cursor: undefined,

        hasMore: true,

        loading: false,

        setLoading: loading => set({ loading }),

        setHistory: (

            items,

            cursor,

            hasMore = false,

        ) =>

            set({

                items,

                cursor,

                hasMore,

            }),

        appendHistory: (

            items,

            cursor,

            hasMore = false,

        ) =>

            set(

                state => ({

                    items: [

                        ...state.items,

                        ...items,

                    ],

                    cursor,

                    hasMore,

                }),

            ),

        update: transaction =>

            set(state => ({

                items:

                    state.items.map(

                        item =>

                            item._id === transaction._id

                                ? transaction

                                : item,

                    ),

            })),

        upsert: transaction =>
            set(state => {
                const exists = state.items.some(item => item._id === transaction._id);

                return {
                    items: exists
                        ? state.items.map(item => item._id === transaction._id ? transaction : item)
                        : [transaction, ...state.items],
                };
            }),

        clear: () =>

            set({

                items: [],

                cursor: undefined,

                hasMore: true,

            }),

    }));
