import { ChainConfig } from "./types";

export const ArbitrumChain: ChainConfig = {
  id: 42161,

  name: "Arbitrum",

  rpcUrl: process.env.EXPO_PUBLIC_ARBITRUM_RPC!,

  blockExplorer: "https://arbiscan.io",

  nativeCurrency: {
    name: "Ether",

    symbol: "ETH",

    decimals: 18,
  },
};

