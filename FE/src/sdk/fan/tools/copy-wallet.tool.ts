import * as Clipboard from "expo-clipboard";

import WalletService from "@/src/services/wallet.service";

import type {

    FanTool,

} from "./tool";

class CopyWalletTool implements FanTool {

    name = "copy_wallet";

    description =

        "Copy Wallet";

    async execute() {

        const address =

            await WalletService.getAddress();

        await Clipboard.setStringAsync(

            address,

        );

        return true;

    }

}

export default new CopyWalletTool();