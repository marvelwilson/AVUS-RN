import { create } from "zustand";

export interface Asset {
  symbol: string;
  balance: string;
  chain: string;
  name?: string;
  address?: string; // ERC20 contract for tokens
}

interface AssetStore {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  updateBalance: (symbol: string, chain: string, balance: string) => void;
  removeAsset: (symbol: string, chain: string) => void;
  clearAssets: () => void;
}

function makeKey(a: { symbol: string; chain: string }) {
  return `${a.symbol.toLowerCase()}:${a.chain}`;
}

export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],

  setAssets: (assets) => set({ assets }),

  addAsset: (asset) =>
    set((state) => {
      const k = makeKey(asset);
      const idx = state.assets.findIndex((a) => makeKey(a) === k);
      if (idx >= 0) {
        const copy = [...state.assets];
        copy[idx] = { ...copy[idx], ...asset };
        return { assets: copy };
      }
      return { assets: [...state.assets, asset] };
    }),

  updateBalance: (symbol, chain, balance) =>
    set((state) => ({
      assets: state.assets.map((a) =>
        makeKey(a) === makeKey({ symbol, chain }) ? { ...a, balance } : a
      ),
    })),

  removeAsset: (symbol, chain) =>
    set((state) => ({
      assets: state.assets.filter((a) => makeKey(a) !== makeKey({ symbol, chain })),
    })),

  clearAssets: () => set({ assets: [] }),
}));
