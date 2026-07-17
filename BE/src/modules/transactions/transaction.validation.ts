import { z } from "zod";

import {
    TransactionSource,
    TransactionStatus,
    TransactionType,
} from "../../models/transaction.model";

export const createTransactionSchema = z.object({
    body: z.object({
        type: z.nativeEnum(TransactionType),
        source: z.nativeEnum(TransactionSource).optional(),
        network: z.string().min(1),
        chainId: z.number(),
        token: z.string().min(1),
        amount: z.string().min(1),
        sender: z.string().optional(),
        recipient: z.string().optional(),
        metadata: z.record(z.string(), z.any()).optional(),
    }),
});

export const updateTransactionSchema = z.object({
    body: z.object({
        status: z.nativeEnum(TransactionStatus),
        txHash: z.string().optional(),
        intentId: z.string().optional(),
        metadata: z.record(z.string(), z.any()).optional(),
    }),
});

export const listTransactionSchema = z.object({
    query: z.object({
        cursor: z.string().optional(),
        limit: z.coerce.number().min(1).max(50).optional(),
    }),
});