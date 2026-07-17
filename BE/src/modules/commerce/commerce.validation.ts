import { z } from "zod";

export const createOrderSchema = z.object({ body: z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20).default(1) }) });
export const submitPaymentSchema = z.object({ body: z.object({ intentId: z.string().min(1), txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).optional() }) });
