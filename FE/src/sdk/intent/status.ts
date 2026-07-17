import { getIntentClient } from "./client";

export async function getIntentStatus(
    uiHash: string,
) {
    const client =
        await getIntentClient();

    return client.getUserIntentStatus({
        uiHash,
    });
}