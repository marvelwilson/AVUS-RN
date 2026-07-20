import { ReactNode, useEffect } from "react";
import WalletProvider from "./WalletProvider";
import FanProvider from "./FanProvider";
import StatusModalView from "../components/StatusModal";
import NotificationProvider from "./NotificationProvider";

interface AppProviderProps {
    children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {


    return (
        <>

            <FanProvider>

                <NotificationProvider>

                <WalletProvider>

                    {children}

                </WalletProvider>

                </NotificationProvider>

            </FanProvider>

            <StatusModalView />


        </>
    )
}
