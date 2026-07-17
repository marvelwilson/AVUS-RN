import { ReactNode, useEffect } from "react";
import WalletProvider from "./WalletProvider";
import FanProvider from "./FanProvider";
import StatusModalView from "../components/StatusModal";

interface AppProviderProps {
    children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {


    return (
        <>

            <FanProvider>

                <WalletProvider>

                    {children}

                </WalletProvider>

            </FanProvider>

            <StatusModalView />


        </>
    )
}
