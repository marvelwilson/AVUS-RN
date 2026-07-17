import ConversationService from "../conversation/conversation.services";

import PolicyValidator from "./policy.validator";

class ResponseValidator {

    validate(
        response: any,
    ) {

        if (

            !PolicyValidator.validate(

                response.intent,

            )

        ) {

            return {

                message:

                    "I'm not allowed to perform that request.",

                intent:

                    "unsupported",

                action:

                    "continue",

                confidence: 1,

                draft: {},

                waitingFor: "",

                arguments: {},

                followUps: [],

            };

        }

        if (response.intent !== "collect_information" && ["send", "buy", "sell"].includes(response.intent)) {
            const asset = ConversationService.supportedAsset(response.draft ?? {});
            if (!asset.supported) {
                const chain = response.draft?.chain;
                response.intent = "collect_information";
                response.waitingFor = asset.reason === "chain_missing" ? "chain" : "chain";
                response.message = asset.reason === "chain_unsupported"
                    ? `${chain} is not currently supported. Which supported network would you like to use?`
                    : asset.reason === "token_unsupported"
                        ? `That token is not supported on ${chain}. Which supported token would you like to use?`
                        : "Which network would you like to use?";
            }
        }

        /**
         * Conversation completed
         */

        if (

            response.intent !==

            "collect_information"

        ) {

            response.waitingFor = "";

        }

        /**
         * AI forgot waiting field
         */

        if (

            response.intent ===

            "collect_information"

            &&

            !response.waitingFor

        ) {

            const missing =

                ConversationService

                    .missingFields(

                        response.draft,

                    );

            response.waitingFor =

                missing[0] || "";

        }

        return response;

    }

}

export default new ResponseValidator();
