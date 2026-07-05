import { create } from "zustand";

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chain?: string;
}

interface TokenState {
  tokens: Token[];
  addToken: (token: Token) => void;
  removeToken: (address: string, chain?: string) => void;
  setTokens: (tokens: Token[]) => void;
  clearTokens: () => void;
}

function tokenKey(t: { address: string; chain?: string }) {
  return `${t.address.toLowerCase()}:${t.chain ?? ""}`.toLowerCase();
}

export const useTokenStore = create<TokenState>((set) => ({
  tokens: [],

  addToken: (token) =>
    set((state) => {
      const k = tokenKey(token);
      const exists = state.tokens.some((t) => tokenKey(t) === k);
      if (exists) return state; // no dups
      return { tokens: [...state.tokens, token] };
    }),

  removeToken: (address, chain) =>
    set((state) => ({
      tokens: state.tokens.filter(
        (t) => tokenKey(t) !== tokenKey({ address, chain })
      ),
    })),

  setTokens: (tokens) => set({ tokens }),

  clearTokens: () => set({ tokens: [] }),
}));
