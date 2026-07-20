import {
    PropsWithChildren,
    useEffect,
} from "react";

import WalletService from "@/src/services/wallet.service";

import { useWalletStore } from "@/src/store/wallet";
import { useAuthStore } from "@/src/store/auth";

export default function WalletProvider({
    children,
}: PropsWithChildren) {

    const initialized =
        useWalletStore(
            state => state.initialized,
        );
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    useEffect(() => {

        if (!isAuthenticated || initialized) {
            return;
        }

        WalletService.initialize()
            .catch(console.error);

    }, [initialized, isAuthenticated]);

    return (
        <>
          {children}
        </>
    );

}
