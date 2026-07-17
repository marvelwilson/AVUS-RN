import {
    PropsWithChildren,
    useEffect,
} from "react";

import WalletService from "@/src/services/wallet.service";

import { useWalletStore } from "@/src/store/wallet";

export default function WalletProvider({
    children,
}: PropsWithChildren) {

    const initialized =
        useWalletStore(
            state => state.initialized,
        );

    useEffect(() => {

        if (initialized) {
            return;
        }

        WalletService.initialize()
            .catch(console.error);

    }, [initialized]);

    return (
        <>
          {children}
        </>
    );

}