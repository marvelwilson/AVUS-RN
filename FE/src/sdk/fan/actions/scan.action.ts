import FanRouter from "../core/router";

import type {
    FanAction,
} from "../types/action";

import type {
    FanIntent,
} from "../types/intent";

class ScanAction implements FanAction {

    id = "scan";

    description =
        "Open Scanner";

    async execute(
        intent: FanIntent,
    ) {

        FanRouter.scan();

    }

}

export default new ScanAction();