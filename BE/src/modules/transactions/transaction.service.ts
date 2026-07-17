import Transaction, {
    ITransaction,
    TransactionStatus,
} from "../../models/transaction.model";

interface CreateTransactionInput {
    user: string;
    wallet: string;

    type: ITransaction["type"];
    source: ITransaction["source"];

    network: string;
    chainId: number;

    token: string;
    amount: string;

    sender?: string;
    recipient?: string;

    metadata?: Record<string, any>;
    eventId?: string;
}

interface ListTransactionInput {
    user: string;
    cursor?: string;
    limit?: number;
}

interface UpdateTransactionInput {
    status?: TransactionStatus;
    txHash?: string;
    intentId?: string;
    metadata?: Record<string, any>;
}

class TransactionService {

    /**
     * Create
     */
    async create(
        input: CreateTransactionInput,
    ) {

        return Transaction.create({

            ...input,

            status:
                TransactionStatus.PENDING,

        });

    }

    /**
     * Get By Id
     */
    async findById(
        id: string,
        user?: string,
    ) {
        return Transaction.findOne({ _id: id, ...(user ? { user } : {}) });

    }

    /**
     * Intent
     */
    async findByIntent(
        intentId: string,
    ) {

        return Transaction.findOne({

            intentId,

        });

    }

    /**
     * Hash
     */
    async findByHash(
        txHash: string,
    ) {

        return Transaction.findOne({

            txHash,

        });

    }

    async findByEventId(eventId: string) {
        return Transaction.findOne({ eventId });
    }

    /**
     * Update
     */
    async update(
        id: string,
        data: UpdateTransactionInput,
        user?: string,
    ) {
        return Transaction.findOneAndUpdate(

            { _id: id, ...(user ? { user } : {}) },

            {

                $set: data,

            },

            {

                new: true,

            },

        );

    }

    /**
     * Pagination
     */
    async list({
        user,
        cursor,
        limit = 20,
    }: ListTransactionInput) {

        const query: any = {

            user,

        };

        if (cursor) {

            query._id = {

                $lt: cursor,

            };

        }

        const items =
            await Transaction.find(query)

                .sort({

                    _id: -1,

                })

                .limit(limit + 1);

        const hasMore =
            items.length > limit;

        if (hasMore) {

            items.pop();

        }

        return {

            items,

            hasMore,

            nextCursor:

                hasMore
                    ? items[items.length - 1]._id
                    : null,

        };

    }

    /**
     * Delete
     */
    async remove(
        id: string,
    ) {

        return Transaction.findByIdAndDelete(
            id,
        );

    }

}

export default new TransactionService();
