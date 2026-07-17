import Router from "../core/router";

import type {

    FanTool,

} from "./tool";

class BuyTool implements FanTool {

    name = "buy";

    description =

        "Open Buy Screen";

    async execute(

        args: Record<string, any> = {},

    ) {

        Router.buy(args);

        return true;

    }

}

export default new BuyTool();
