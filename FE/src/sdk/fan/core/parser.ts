import type {

    FanIntent,

} from "../types/intent";

import type {

    FanResponse,

} from "../types/response";

class Parser {

    parse(
        response: FanResponse,
    ): FanIntent {

        return {

            intent:
                response.intent,

            confidence:
                response.confidence,

            message:
                response.message,

            arguments:
                response.arguments,

        };

    }

}

export default new Parser();