import WalletService from "@/src/services/wallet.service";

import type { FanTool } from "./tool";

class WalletTool implements FanTool {

    name = "wallet";

    description = "Wallet";

    async execute() {

        return {

            address:

                await WalletService.getAddress(),

        };

    }

}

export default new WalletTool();