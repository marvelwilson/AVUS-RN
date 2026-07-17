import { getIntentClient } from "./client";

export async function waitForIntent(
    uiHash: string,
) {

    const client =
        await getIntentClient();

    return client.waitForUserIntentExecutionReceipt({

        uiHash,

    });

}

export async function getIntentStatus(
    uiHash: string,
) {

    const client =
        await getIntentClient();

    return client.getUserIntentStatus({

        uiHash,

    });

}