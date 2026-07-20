import Router from "../core/router";
import * as Clipboard from "expo-clipboard";

import type {

    FanTool,

} from "./tool";

class SendTool implements FanTool {

    name = "send";

    description =

        "Open Send Screen";

    async execute(

        args: Record<string, any> = {},

    ) {

        if (typeof args.address === "string" && args.address.toLowerCase() === "clipboard") {
            const address = (await Clipboard.getStringAsync()).trim();
            if (/^0x[a-fA-F0-9]{40}$/.test(address)) args = { ...args, address };
            else throw new Error("The clipboard does not contain a valid wallet address.");
        }

        Router.send(

            args,

        );

        return true;

    }

}

export default new SendTool();
