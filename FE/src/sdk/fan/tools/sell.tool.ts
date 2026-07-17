import Router from "../core/router";

import type {

    FanTool,

} from "./tool";

class SellTool implements FanTool {

    name = "sell";

    description =

        "Open Sell Screen";

    async execute(

        args: Record<string, any> = {},

    ) {

        Router.sell(args);

        return true;

    }

}

export default new SellTool();
