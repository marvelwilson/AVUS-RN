import { arbitrum, mainnet, optimism } from "viem/chains";

export const SUPPORTED_SOURCE_TOKENS: any[] = [

    {
        tokenType: "ERC20",
        chain: arbitrum,
    },

    {
        tokenType: "NATIVE",
        chain: mainnet,
    },

    {
        tokenType: "USDC",
        chain: optimism,
    },

];

const CHAIN_NAMES: Record<number, string> = {
    1: "ETHEREUM",
    10: "OPTIMISM",
    8453: "BASE",
    42161: "ARBITRUM",
};

export function getChainName(chainId: number) {
    return CHAIN_NAMES[chainId] ?? String(chainId);
}
