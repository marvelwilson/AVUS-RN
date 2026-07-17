import NavigationTool from "./navigation.tool";

import type { FanTool } from "./tool";

class HistoryTool implements FanTool {

    name = "history";

    description = "Open Transaction History";

    async execute() {

        await NavigationTool.execute({

            screen: "history",

        });

    }

}

export default new HistoryTool();