export interface FanChainPolicy {
    id: string;
    name: string;
    chainId?: number;
    nativeToken?: string;
    enabled: boolean;
    supportedTokens: string[];
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
