import Router from "../core/router";

import type {

    FanTool,

} from "./tool";

class SwapTool implements FanTool {

    name = "swap";

    description =

        "Open Swap Screen";

    async execute(

        args: Record<string, any> = {},

    ) {

        Router.swap(

            args,

        );

        return true;

    }

}

export default new SwapTool();