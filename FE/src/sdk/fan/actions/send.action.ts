import * as Clipboard from "expo-clipboard";

import FanRouter from "../core/router";

import type {
    FanAction,
} from "../types/action";

import type {
    FanIntent,
} from "../types/intent";
import { useFanDraftStore } from "@/src/store/fan-draft";

class SendAction implements FanAction {

    id = "send";

    description =
        "Open Send Screen";

    async execute(
        intent: FanIntent,
    ) {

        const args =
            intent.arguments;

        let recipient =
            args.recipient as string | undefined;

        /**
         * Clipboard
         */
        if (
            recipient === "clipboard"
        ) {

            recipient =
                await Clipboard.getStringAsync();
            useFanDraftStore
                .getState()
                .merge({

                    recipient: recipient,

                });
        }

        FanRouter.send({

            recipient,

            amount:
                args.amount,

            token:
                args.token,

            chainId:
                args.chainId,

        });

    }

}

export default new SendAction();