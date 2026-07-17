export interface FanChainPolicy {
    id: string;
    name: string;
    chainId?: number;
    nativeToken?: string;
    enabled: boolean;
    receiveEnabled?: boolean;
    sendEnabled?: boolean;
    supportedTokens: string[];
    tokens: {
        symbol: string;
        address: `0x${string}`;
        sdkTokenType?: string;
    }[];
    sendTokens?: {
        symbol: string;
        address: `0x${string}`;
        sdkTokenType?: string;
    }[];
}

export interface FanPolicy {
    version: number;
    policy: {
        allowedIntents: string[];
        restrictedIntents: string[];
        requiredFields: Record<string, string[]>;
    };
    ui: { suggestions: string[] };
    assets: {
        supportedChains: FanChainPolicy[];
        supportedTokens: string[];
    };
    account: { gasSponsorshipEligible: boolean };
}
