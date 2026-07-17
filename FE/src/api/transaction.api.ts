import { api } from "@/src/lib/axios";

export interface CreateTransactionRequest {

    type: string;

    source: string;

    network: string;

    chainId: number;

    token: string;

    amount: string;

    sender?: string;

    recipient?: string;

    metadata?: Record<string, any>;

}

export interface UpdateTransactionRequest {

    status: string;

    txHash?: string;

    intentId?: string;

    metadata?: Record<string, any>;

}

class TransactionApi {

    /**
     * Create
     */
    create(
        data: CreateTransactionRequest,
    ) {

        return api.post(
            "/transactions",
            data,
        );

    }

    /**
     * History
     */
    list(
        cursor?: string,
        limit = 20,
    ) {

        return api.get(
            "/transactions",
            {

                params: {

                    cursor,

                    limit,

                },

            },
        );

    }

    /**
     * Single
     */
    get(
        id: string,
    ) {

        return api.get(
            `/transactions/${id}`,
        );

    }

    /**
     * Status
     */
    update(
        id: string,
        data: UpdateTransactionRequest,
    ) {

        return api.patch(
            `/transactions/${id}/status`,
            data,
        );

    }

}

export default new TransactionApi();