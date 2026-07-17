import axios from "axios";
import crypto from "crypto";

import { env } from "../config/env";

type WebhookMap = Record<string, string>;

function parseMap(value: string, name: string): WebhookMap {
    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        console.warn(`${name} is not valid JSON; Alchemy monitoring is disabled.`);
        return {};
    }
}

class AlchemyNotifyService {
    private readonly webhookIds = parseMap(env.ALCHEMY_WEBHOOK_IDS, "ALCHEMY_WEBHOOK_IDS");
    private readonly signingKeys = parseMap(env.ALCHEMY_WEBHOOK_SIGNING_KEYS, "ALCHEMY_WEBHOOK_SIGNING_KEYS");

    configured() {
        return Boolean(env.ALCHEMY_NOTIFY_TOKEN && Object.keys(this.webhookIds).length);
    }

    async subscribe(address: string, networks?: string[]) {
        return this.subscribeMany([address], networks);
    }

    async subscribeMany(addresses: string[], networks?: string[]) {
        if (!this.configured()) throw new Error("Alchemy Notify is not configured.");
        const entries = Object.entries(this.webhookIds).filter(([network]) => !networks || networks.includes(network));
        const normalized = [...new Set(addresses.map(address => address.toLowerCase()))];
        for (let offset = 0; offset < normalized.length; offset += 500) {
            const batch = normalized.slice(offset, offset + 500);
            await Promise.all(entries.map(([, webhookId]) => axios.patch(
                "https://dashboard.alchemy.com/api/update-webhook-addresses",
                { webhook_id: webhookId, addresses_to_add: batch, addresses_to_remove: [] },
                { headers: { "X-Alchemy-Token": env.ALCHEMY_NOTIFY_TOKEN, "Content-Type": "application/json" } },
            )));
        }
    }

    verify(webhookId: string, rawBody: Buffer, signature?: string) {
        const signingKey = this.signingKeys[webhookId];
        if (!signingKey || !signature || !rawBody.length) return false;
        const expected = crypto.createHmac("sha256", signingKey).update(rawBody).digest("hex");
        const supplied = signature.trim();
        if (expected.length !== supplied.length) return false;
        return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
    }
}

export default new AlchemyNotifyService();
