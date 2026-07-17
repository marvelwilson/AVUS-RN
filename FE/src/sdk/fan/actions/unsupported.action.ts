import type {
    FanAction,
} from "../types/action";

import type {
    FanIntent,
} from "../types/intent";

class UnsupportedAction implements FanAction {

    id = "unsupported";

    description =
        "Unsupported";

    async execute(
        intent: FanIntent,
    ) {

        throw new Error(
            "I'm not allowed to perform this action at the moment.",
        );

    }

}

export default new UnsupportedAction();