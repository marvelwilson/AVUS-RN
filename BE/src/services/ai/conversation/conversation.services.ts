import manifest from "../../../modules/fan/fan.manifest";

import type {

    FanDraft,

} from "../../../modules/fan/dto/chat.dto";

class ConversationService {

    private intents = ["buy", "sell", "send", "receive", "gamefi"] as const;

    inferIntent(message: string) {
        const text = message.toLowerCase();
        return this.intents.find(intent => new RegExp(`\\b${intent}\\b`).test(text));
    }

    normalizeDraft(value: any): FanDraft {
        const draft: FanDraft = {};
        if (this.intents.includes(value?.intent)) draft.intent = value.intent;
        for (const field of ["recipient", "token", "chain", "fiat", "paymentMethod", "withdrawalMethod", "fromToken", "toToken"] as const) {
            if (typeof value?.[field] === "string" && value[field].trim()) draft[field] = value[field].trim();
        }
        if (typeof value?.amount === "number" && Number.isFinite(value.amount) && value.amount > 0) draft.amount = value.amount;
        return draft;
    }

    mergeDraft(current: FanDraft, update: any, message: string, responseIntent?: string) {
        const merged = { ...this.normalizeDraft(current), ...this.normalizeDraft(update) };
        if (!merged.intent) {
            const executable = this.intents.find(intent => intent === responseIntent);
            merged.intent = executable ?? this.inferIntent(message);
        }
        return merged;
    }

    requiredFields(
        intent?: string,
    ) {

        if (!intent) {

            return [];

        }

        return (

            manifest.policy.requiredFields[

                intent as keyof typeof manifest.policy.requiredFields

            ] || []

        );

    }

    missingFields(
        draft: FanDraft,
    ) {

        return this.requiredFields(

            draft.intent,

        ).filter(

            field => {

                const value =

                    draft[

                        field as keyof FanDraft

                    ];

                return (

                    value === undefined ||

                    value === null ||

                    value === ""

                );

            },

        );

    }

    isComplete(
        draft: FanDraft,
    ) {

        return (

            this.missingFields(

                draft,

            ).length === 0

        );

    }

    supportedAsset(draft: FanDraft) {
        if (!draft.chain) return { supported: false, reason: "chain_missing" } as const;
        const chain = manifest.assets.supportedChains.find(item =>
            item.id.toLowerCase() === draft.chain!.toLowerCase() ||
            item.name.toLowerCase() === draft.chain!.toLowerCase(),
        );
        if (!chain?.enabled) return { supported: false, reason: "chain_unsupported" } as const;
        const token = draft.token ?? draft.fromToken;
        if (token && !chain.supportedTokens.some(item => item.toLowerCase() === token.toLowerCase())) {
            return { supported: false, reason: "token_unsupported" } as const;
        }
        return { supported: true, chain } as const;
    }

    nextField(
        draft: FanDraft,
    ) {

        return (

            this.missingFields(

                draft,

            )[0] || ""

        );

    }

}

export default new ConversationService();
