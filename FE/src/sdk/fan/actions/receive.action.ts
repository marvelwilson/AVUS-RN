import FanRouter from "../core/router";

import type {
    FanAction,
} from "../types/action";

import type {
    FanIntent,
} from "../types/intent";

class ReceiveAction implements FanAction {

    id = "receive";

    description =
        "Open Receive";

    async execute(
        intent: FanIntent,
    ) {

        FanRouter.receive();

    }

}

export default new ReceiveAction();