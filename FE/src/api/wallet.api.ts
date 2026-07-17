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

    sraConfigVersion?: number;

    isPrimary?: boolean;

}

export interface RegisterWalletRequest {

    embeddedAddress: string;

    smartAccountAddress: string;

    network: WalletNetwork;

    sraConfigVersion: number;

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
            await api.get<{ success: boolean; data: Wallet[] }>("/wallet");

        return data.data.find((wallet) => wallet.isPrimary)
            ?? data.data[0]
            ?? null;

    }

}

export default new WalletApi();
