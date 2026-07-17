import type { FanTool } from "./tool";

import SendTool from "./send.tool";
import BuyTool from "./buy.tool";
import SellTool from "./sell.tool";
// import SwapTool from "./swap.tool";
import ReceiveTool from "./receive.tool";

import ScanTool from "./scan.tool";
import ClipboardTool from "./clipboard.tool";
import CopyWalletTool from "./copy-wallet.tool";

import PortfolioTool from "./portfolio.tool";
// import BalanceTool from "./balance.tool";
import HistoryTool from "./history.tool";

import UnsupportedTool from "./unsupported.tool";
import GameFiTool from "./gamefi.tool";

class ToolRegistry {

    private tools = new Map<string, FanTool>();

    constructor() {

        [

            SendTool,
            BuyTool,
            SellTool,
            // SwapTool,
            ReceiveTool,

            ScanTool,
            ClipboardTool,
            CopyWalletTool,

            PortfolioTool,
            // BalanceTool,
            HistoryTool,
            GameFiTool,

            UnsupportedTool,

        ].forEach(tool => {

            this.tools.set(

                tool.name,

                tool,

            );

        });

    }

    get(
        intent: string,
    ) {

        return this.tools.get(

            intent,

        );

    }

}

export default new ToolRegistry();
