import FanRouter from "../core/router";

import type {
    FanAction,
} from "../types/action";

import type {
    FanIntent,
} from "../types/intent";

class BalanceAction implements FanAction {

    id = "balance";

    description =
        "Open Wallet";

    async execute(
        intent: FanIntent,
    ) {

        FanRouter.portfolio();

    }

}

export default new BalanceAction();