import FanRouter from "../core/router";

import type {
    FanAction,
} from "../types/action";

import type {
    FanIntent,
} from "../types/intent";

class PortfolioAction implements FanAction {

    id = "portfolio";

    description =
        "Open Portfolio";

    async execute(
        intent: FanIntent,
    ) {

        FanRouter.portfolio();

    }

}

export default new PortfolioAction();