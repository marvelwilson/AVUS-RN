import Router from "../core/router";

import type {

    FanTool,

} from "./tool";

class ReceiveTool implements FanTool {

    name = "receive";

    description = "Open Receive Screen";

    async execute(

        args: Record<string, any> = {},

    ) {

        Router.receive(

            args,

        );

        return true;

    }

}

export default new ReceiveTool();