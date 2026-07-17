
export type  AddressType = `0x${string}`;

export interface SmartRoutingAddress {
    address: AddressType;
    owner: string;
}

export interface SmartRoutingStatus {
    smartRoutingAddress: AddressType;

    active: boolean;

    balances: {
        chainId: number;
        token: string;
        amount: string;
    }[];

    pending: number;
}

export interface WithdrawCall {
    chainId: number;

    calls: {
        target: string;
        value: bigint;
        data: AddressType;
    }[];
}

export interface ChainAbstractedBalance {
    totalUsd: number;

    assets: {
        symbol: string;
        chainId: number;
        amount: string;
        usdValue: number;
    }[];
}

export interface WithdrawToken {

    chainId: number;

    token: AddressType;

}

