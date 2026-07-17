import { api } from "@/src/lib/axios";

export type WalletNetwork =
    | "ARBITRUM"
    | "BASE"
    | "OPTIMISM";

export interface Wallet {

    id: string;

    embeddedAddress: string;

    smartAccountAddress: string;

    network: WalletNetwork;

}

export interface RegisterWalletRequest {

    embeddedAddress: string;

    smartAccountAddress: string;

    network: WalletNetwork;

}

class WalletApi {

    register(
        data: RegisterWalletRequest,
    ) {

        return api.post(
            "/wallet",
            data,
        );

    }

    async getWallet() {

        const { data } =
            await api.get("/wallet");

        return data.data as Wallet | null;

    }

}

export default new WalletApi();