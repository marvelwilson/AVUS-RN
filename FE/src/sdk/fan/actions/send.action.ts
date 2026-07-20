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

        let address =
            args.address as string | undefined;

        console.log(arg)
        if (
            address === "clipboard"
        ) {

            address =
                await Clipboard.getStringAsync();
            useFanDraftStore
                .getState()
                .merge({

                    address: address,

                });
        }

        FanRouter.send({

            address,

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