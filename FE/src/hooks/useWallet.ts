import { useWalletStore } from "@/src/store/wallet";

import WalletService from "@/src/services/wallet.service";

export function useWallet() {

    const wallet =
        useWalletStore();

    return {

        ...wallet,

        initialize:
            WalletService.initialize,

        refresh:
            WalletService.refresh,

        receive:
            WalletService.receive,

        send:
            WalletService.send,

        withdrawAll:
            WalletService.withdrawAll,

    };

}