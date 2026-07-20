import { getIntentClient } from "./client";

import type {
    SendIntentInput,
} from "./types";
import { safeStringify } from "@/src/utils/json";

export async function sendIntent(
    input: SendIntentInput,
) {
    const client = await getIntentClient();

    const result = await client.sendUserIntent({
        calls: input.calls,
        outputTokens: input.outputTokens,
        inputTokens: input.inputTokens,
        gasToken: input.gasToken,
    });

    console.log("calls", safeStringify(input.calls));
    console.log("inputTokens", safeStringify(input.inputTokens));
    console.log("outputTokens", safeStringify(input.outputTokens));
    console.log("sendUserIntent result:", safeStringify(result));
    return {
        uiHash: result.outputUiHash.uiHash,
        inputUiHashes: result.inputsUiHash.map(({ uiHash }) => uiHash),
    };

}

export async function estimateIntent(input: SendIntentInput) {
    const client = await getIntentClient();
    return client.estimateUserIntentFees({
        calls: input.calls,
        outputTokens: input.outputTokens,
        inputTokens: input.inputTokens,
        gasToken: input.gasToken,
    });
}
