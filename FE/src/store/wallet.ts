import { create } from "zustand";

import type { AddressType } from "@/src/sdk/zerodev/types";
import type { CABAsset } from "@/src/sdk/intent/types";

import type {

    GetSmartRoutingAddressStatusReturns,

} from "@zerodev/smart-routing-address";

interface WalletState {

    eoa: AddressType | null;

    sra: AddressType | null;

    kernel: AddressType | null;

    balances: CABAsset[];

    totalUsd: number;

    status:
        GetSmartRoutingAddressStatusReturns
        | null;

    initialized: boolean;

    loading: boolean;

    setWallet(data: {

        eoa: AddressType;

        sra: AddressType;

        kernel?: AddressType;

    }): void;

    updatePortfolio(data: {

        balances: CABAsset[];

        totalUsd?: number;

    }): void;

    setStatus(
        status: GetSmartRoutingAddressStatusReturns,
    ): void;

    setLoading(
        loading: boolean,
    ): void;

    clearWallet(): void;

}

export const useWalletStore =
create<WalletState>((set) => ({

    eoa: null,

    sra: null,

    kernel: null,

    balances: [],

    totalUsd: 0,

    status: null,

    initialized: false,

    loading: false,

    setWallet: (wallet) =>

        set({

            ...wallet,

            initialized: true,

        }),

    updatePortfolio: (portfolio) =>

        set({

            balances:
                portfolio.balances,

            totalUsd:
                portfolio.totalUsd ?? 0,

        }),

    setStatus: (status) =>

        set({

            status,

        }),

    setLoading: (loading) =>

        set({

            loading,

        }),

    clearWallet: () =>

        set({

            eoa: null,

            sra: null,

            kernel: null,

            balances: [],

            totalUsd: 0,

            status: null,

            initialized: false,

            loading: false,

        }),

}));
