import Router from "../core/router";

import type { FanTool } from "./tool";

class NavigationTool implements FanTool {

    name = "navigation";

    description = "Navigation";

    async execute(
        args: Record<string, any> = {},
    ) {
        switch (args.screen) {

            case "send":

                Router.send(args);

                break;

            case "receive":

                Router.receive();

                break;

            case "scan":

                Router.scan();

                break;

            case "history":

                Router.history();

                break;

            case "portfolio":

                Router.portfolio();

                break;

            default:

                break;

        }

    }

}

export default new NavigationTool();