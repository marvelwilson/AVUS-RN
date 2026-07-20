import { api } from "@/src/lib/axios";

class MarketApi {
  async prices(symbols: string[]) {
    const { data } = await api.get<{ success: boolean; data: Record<string, number> }>("/market/prices", {
      params: { symbols: symbols.join(",") },
    });
    return data.data;
  }
}

export default new MarketApi();
