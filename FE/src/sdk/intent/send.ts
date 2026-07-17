import { getIntentClient } from "./client";

import type {
    SendIntentInput,
} from "./types";

export async function sendIntent(
    input: SendIntentInput,
) {

    const client =
        await getIntentClient();

    const result =
        await client.sendUserIntent({

            calls: input.calls,

            outputTokens:
                input.outputTokens,

            inputTokens:
                input.inputTokens,

            gasToken:
                input.gasToken,

        });

    return {

        uiHash:

            result.outputUiHash.uiHash,

    };

}