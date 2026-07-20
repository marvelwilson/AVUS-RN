import { api } from "@/src/lib/axios";

export interface TransactionAsset {
    network: string;
    chainId: number;
    token: string;
    symbol?: string;
}

export interface CreateTransactionRequest {
    type: string;

    source?: string;

    amount: string;

    sender?: string;
    recipient?: string;

    sourceAsset?: TransactionAsset;

    destinationAsset: TransactionAsset;

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
     * Create transaction
     */
    async create(data: CreateTransactionRequest) {

        console.log(
            "POST /transactions",
            JSON.stringify(data, null, 2),
        );

        return api.post(
            "/transactions",
            data,
        );
    }

    /**
     * Transaction history
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
     * Single transaction
     */
    get(id: string) {

        return api.get(
            `/transactions/${id}`,
        );
    }

    /**
     * Update transaction status
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