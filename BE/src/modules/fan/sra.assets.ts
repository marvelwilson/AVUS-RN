export type SraTokenPolicy = {
    symbol: string;
    address: string;
    sdkTokenType?: string;
};

export type SraChainPolicy = {
    id: string;
    name: string;
    chainId: number;
    nativeToken?: string;
    enabled: boolean;
    receiveEnabled: boolean;
    sendEnabled: boolean;
    supportedTokens: string[];
    tokens: SraTokenPolicy[];
    sendTokens?: SraTokenPolicy[];
};

const native = (symbol = "ETH"): SraTokenPolicy => ({
    symbol,
    address: "0x0000000000000000000000000000000000000000",
    sdkTokenType: "NATIVE",
});

const token = (symbol: string, address: string, sdkTokenType = symbol): SraTokenPolicy => ({
    symbol,
    address,
    sdkTokenType,
});

const chain = (policy: Omit<SraChainPolicy, "enabled" | "receiveEnabled" | "supportedTokens"> & { receiveEnabled?: boolean }): SraChainPolicy => ({
    ...policy,
    enabled: true,
    receiveEnabled: policy.receiveEnabled ?? true,
    supportedTokens: policy.tokens.map(({ symbol }) => symbol),
    sendTokens: policy.sendTokens ?? (policy.sendEnabled
        ? policy.tokens.filter(({ symbol }) => ["ETH", "WETH", "USDC", "USDT"].includes(symbol))
        : []),
});

export const SRA_CHAINS: SraChainPolicy[] = [
    chain({ id: "ETHEREUM", name: "Ethereum", chainId: 1, nativeToken: "ETH", sendEnabled: true, tokens: [native(), token("WETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"), token("USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"), token("USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7"), token("DAI", "0x6B175474E89094C44Da98b954EedeAC495271d0F"), token("WBTC", "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599")] }),
    chain({ id: "OPTIMISM", name: "Optimism", chainId: 10, nativeToken: "ETH", sendEnabled: true, tokens: [native(), token("WETH", "0x4200000000000000000000000000000000000006"), token("USDC", "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"), token("USDT", "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58"), token("DAI", "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"), token("WBTC", "0x68f180fcCe6836688e9084f035309E29Bf0A2095")] }),
    chain({ id: "ARBITRUM", name: "Arbitrum", chainId: 42161, nativeToken: "ETH", sendEnabled: true, tokens: [native(), token("WETH", "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"), token("USDC", "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"), token("USDT", "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"), token("DAI", "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"), token("WBTC", "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f")] }),
    chain({ id: "BASE", name: "Base", chainId: 8453, nativeToken: "ETH", sendEnabled: true, tokens: [native(), token("WETH", "0x4200000000000000000000000000000000000006"), token("USDC", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"), token("USDT", "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2"), token("DAI", "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb")] }),
    chain({ id: "BSC", name: "BNB Smart Chain", chainId: 56, sendEnabled: true, tokens: [token("USDC", "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"), token("USDT", "0x55d398326f99059fF775485246999027B3197955")], sendTokens: [token("WETH", "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"), token("USDC", "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"), token("USDT", "0x55d398326f99059fF775485246999027B3197955")] }),
    chain({ id: "POLYGON", name: "Polygon", chainId: 137, sendEnabled: true, tokens: [token("WETH", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"), token("USDC", "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"), token("USDT", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"), token("DAI", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"), token("WBTC", "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6")] }),
    chain({ id: "AVALANCHE", name: "Avalanche", chainId: 43114, receiveEnabled: false, sendEnabled: true, tokens: [token("USDC", "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E")] }),
    chain({ id: "BLAST", name: "Blast", chainId: 81457, nativeToken: "ETH", sendEnabled: false, tokens: [native(), token("WETH", "0x4300000000000000000000000000000000000004"), token("WBTC", "0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692")] }),
    chain({ id: "HYPEREVM", name: "HyperEVM", chainId: 999, sendEnabled: false, tokens: [token("USDC", "0xb88339CB7199b77E23DB6E890353E22632Ba630f"), token("USDT", "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb")] }),
    chain({ id: "INK", name: "Ink", chainId: 57073, sendEnabled: false, tokens: [token("WETH", "0x4200000000000000000000000000000000000006")] }),
    chain({ id: "LINEA", name: "Linea", chainId: 59144, nativeToken: "ETH", sendEnabled: false, tokens: [native(), token("WETH", "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f"), token("USDC", "0x176211869cA2b568f2A7D4EE941E073a821EE1ff"), token("USDT", "0xA219439258ca9da29E9Cc4cE5596924745e12B93"), token("DAI", "0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5"), token("WBTC", "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4")] }),
    chain({ id: "MODE", name: "Mode", chainId: 34443, nativeToken: "ETH", sendEnabled: false, tokens: [native(), token("WETH", "0x4200000000000000000000000000000000000006"), token("USDC", "0xd988097fb8612cc24eeC14542bC03424c656005f"), token("USDT", "0xf0F161fDA2712DB8b566946122a5af183995e2eD"), token("WBTC", "0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF")] }),
    chain({ id: "MONAD", name: "Monad", chainId: 143, sendEnabled: false, tokens: [token("USDC", "0x754704Bc059F8C67012fEd69BC8A327a5aafb603"), token("USDT", "0xe7cd86e13AC4309349F30B3435a9d337750fC82D")] }),
    chain({ id: "SONEIUM", name: "Soneium", chainId: 1868, nativeToken: "ETH", sendEnabled: false, tokens: [native(), token("WETH", "0x4200000000000000000000000000000000000006"), token("USDC", "0xbA9986D2381edf1DA03B0B9c1f8b00dc4AacC369")] }),
    chain({ id: "TEMPO", name: "Tempo", chainId: 4217, sendEnabled: false, tokens: [token("USDC.e", "0x20C000000000000000000000b9537d11c60E8b50", "USDC")] }),
    chain({ id: "UNICHAIN", name: "Unichain", chainId: 130, nativeToken: "ETH", sendEnabled: false, tokens: [native(), token("WETH", "0x4200000000000000000000000000000000000006"), token("USDC", "0x078D782b760474a361dDA0AF3839290b0EF57AD6")] }),
    chain({ id: "WORLD", name: "World Chain", chainId: 480, nativeToken: "ETH", sendEnabled: false, tokens: [native(), token("WETH", "0x4200000000000000000000000000000000000006"), token("USDC", "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1"), token("WBTC", "0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3")] }),
    chain({ id: "ZORA", name: "Zora", chainId: 7777777, nativeToken: "ETH", sendEnabled: false, tokens: [native(), token("WETH", "0x4200000000000000000000000000000000000006")] }),
];

export const SRA_TOKEN_SYMBOLS = [...new Set(SRA_CHAINS.flatMap(({ supportedTokens }) => supportedTokens))];
