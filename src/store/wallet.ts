import { create } from "zustand";

interface WalletState {
  address: string | null;
  chain: string;
  portfolioValue: number;
  setWallet: (address: string, chain: string) => void;
  setPortfolioValue: (value: number) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chain: "Arbitrum",
  portfolioValue: 0,

  setWallet: (address, chain) => set({ address, chain }),
  setPortfolioValue: (value) => set({ portfolioValue: value }),
  clearWallet: () =>
    set({ address: null, chain: "polygon", portfolioValue: 0 }),
}));
