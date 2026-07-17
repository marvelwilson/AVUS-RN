import FanRouter from "../core/router";

import type {
    FanAction,
} from "../types/action";

import type {
    FanIntent,
} from "../types/intent";

class HistoryAction implements FanAction {

    id = "history";

    description =
        "Open History";

    async execute(
        intent: FanIntent,
    ) {

        FanRouter.history();

    }

}

export default new HistoryAction();