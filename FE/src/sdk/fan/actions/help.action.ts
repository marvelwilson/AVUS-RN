import type {
    FanAction,
} from "../types/action";

import type {
    FanIntent,
} from "../types/intent";

class HelpAction implements FanAction {

    id = "help";

    description =
        "Help";

    async execute(
        intent: FanIntent,
    ) {

        /**
         * Reserved.
         *
         * Future:
         * Show Help Sheet
         * or Ask AI.
         */

    }

}

export default new HelpAction();