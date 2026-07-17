import { z } from "zod";

const intents = ["buy", "sell", "send", "receive", "swap", "gamefi"] as const;
const optionalText = z.preprocess(
    value => typeof value === "string" && value.trim() ? value.trim() : undefined,
    z.string().optional(),
);
const optionalIntent = z.preprocess(
    value => typeof value === "string" && intents.includes(value as any) ? value : undefined,
    z.enum(intents).optional(),
);

export const chatSchema = z.object({
    body: z.object({
        message: z.string().trim().min(1).max(1000),
        draft: z.object({
            intent: optionalIntent,
            recipient: optionalText,
            amount: z.preprocess(value => typeof value === "number" && value > 0 ? value : undefined, z.number().positive().optional()),
            token: optionalText,
            chain: optionalText,
            fiat: optionalText,
            paymentMethod: optionalText,
            withdrawalMethod: optionalText,
            fromToken: optionalText,
            toToken: optionalText,
        }).default({}),
        history: z.array(z.object({
            role: z.enum(["user", "assistant"]),
            text: z.string().trim().min(1).max(1000),
        })).max(12).optional().default([]),
    }),
});
