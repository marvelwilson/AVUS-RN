import type { ChainConfig } from "../chains";
import type { ChainAbstractedBalance } from "../zerodev/types";

export interface WalletInfo {
  address: string;
  chain: ChainConfig;
}

export interface WalletSummary extends WalletInfo {
  balance: string;
}

export interface WalletPortfolio extends WalletSummary {
  portfolio: ChainAbstractedBalance[];
}