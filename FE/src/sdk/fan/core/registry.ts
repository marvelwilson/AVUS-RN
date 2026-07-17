import type { FanResponse } from "../types/response";

import SendTool from "../tools/send.tool";
import ReceiveTool from "../tools/receive.tool";
import ScanTool from "../tools/scan.tool";
import HistoryTool from "../tools/history.tool";
import UnsupportedTool from "../tools/unsupported.tool";
import { PortfolioTool } from "../tools";

class IntentRegistry {

    private intents = [

        SendTool,

        ReceiveTool,

        ScanTool,

        HistoryTool,

        PortfolioTool,

        UnsupportedTool,

    ];

    async execute(
        response: FanResponse,
    ) {
        const tool = this.intents.find(

            tool =>

                tool.name === response.intent,

        );

        if (!tool) {

            return UnsupportedTool.execute({

                message:

                    "Intent not supported.",

            });

        }

        return tool.execute(

            response.arguments,

        );

    }

}

export default new IntentRegistry();