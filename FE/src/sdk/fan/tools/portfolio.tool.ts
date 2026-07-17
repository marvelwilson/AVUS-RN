import { getPortfolio } from "@/src/sdk/intent";

import type { FanTool } from "./tool";

class PortfolioTool implements FanTool {

    name = "portfolio";

    description = "Portfolio";

    async execute() {

        return getPortfolio();

    }

}

export default new PortfolioTool();