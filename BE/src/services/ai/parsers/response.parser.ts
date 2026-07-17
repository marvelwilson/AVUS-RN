import type {

    AIResponse,

} from "../types";

class ResponseParser {

    parse(
        content: string,
    ): AIResponse {

        try {

            return JSON.parse(

                content,

            );

        } catch {

            return {

                message:

                    "I couldn't understand that request.",

                intent:

                    "unsupported",

                confidence: 0,

                draft: {},

                arguments: {},

                action: 'cancel',

                followUps: [],

            };

        }

    }

}

export default new ResponseParser();