import { SUPPORTED_TOKENS } from "@zerodev/smart-routing-address";
import type { TOKEN_TYPE } from "@zerodev/smart-routing-address";
import type { Chain } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  hyperEvm,
  ink,
  linea,
  mainnet,
  mode,
  monad,
  optimism,
  polygon,
  soneium,
  tempo,
  unichain,
  worldchain,
  zora,
} from "viem/chains";

export const SRA_CHAINS: readonly Chain[] = [
  mainnet,
  optimism,
  arbitrum,
  base,
  bsc,
  polygon,
  blast,
  hyperEvm,
  ink,
  linea,
  mode,
  monad,
  soneium,
  tempo,
  unichain,
  worldchain,
  zora,
  avalanche,
];

export const CHAIN_BY_ID = new Map(SRA_CHAINS.map((chain) => [chain.id, chain]));

export const SUPPORTED_SOURCE_TOKENS: { tokenType: TOKEN_TYPE; chain: Chain }[] = Object.entries(SUPPORTED_TOKENS).flatMap(
  ([chainId, tokens]) => {
    const chain = CHAIN_BY_ID.get(Number(chainId));
    if (!chain) return [];

    return Object.keys(tokens)
      .filter((tokenType) => tokenType !== "EURC")
      .map((tokenType) => ({ tokenType: tokenType as TOKEN_TYPE, chain }));
  },
);

export function getChainName(chainId: number) {
  return CHAIN_BY_ID.get(chainId)?.name.toUpperCase() ?? String(chainId);
}
