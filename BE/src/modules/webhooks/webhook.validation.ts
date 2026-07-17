import { z } from "zod";

export const depositWebhookSchema = z.object({
    body: z.object({
        webhookId: z.string().min(1),
        type: z.literal("ADDRESS_ACTIVITY"),
        event: z.object({
            network: z.string().min(1),
            activity: z.array(z.record(z.string(), z.any())),
        }).passthrough(),
    }).passthrough(),
});
