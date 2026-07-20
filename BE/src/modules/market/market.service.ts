import axios from "axios";

const COIN_IDS: Record<string, string> = {
    ETH: "ethereum",
    WETH: "ethereum",
    BTC: "bitcoin",
    WBTC: "bitcoin",
    USDC: "usd-coin",
    "USDC.E": "usd-coin",
    USDT: "tether",
    DAI: "dai",
    EURC: "euro-coin",
    BNB: "binancecoin",
    POL: "polygon-ecosystem-token",
};

type PriceCache = { expiresAt: number; prices: Record<string, number> };

class MarketService {
    private cache: PriceCache = { expiresAt: 0, prices: {} };

    async prices(symbols: string[]) {
        const normalized = [...new Set(symbols.map(symbol => symbol.toUpperCase()))];
        const missing = normalized.filter(symbol => !this.cache.prices[symbol]);
        if (Date.now() < this.cache.expiresAt && !missing.length) return this.pick(normalized);

        const ids = [...new Set(normalized.map(symbol => COIN_IDS[symbol]).filter(Boolean))];
        if (ids.length) {
            try {
                const apiKey = process.env.COINGECKO_API_KEY;
                const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
                    params: { ids: ids.join(","), vs_currencies: "usd", include_last_updated_at: true },
                    headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
                    timeout: 8000,
                });
                for (const symbol of normalized) {
                    const value = data[COIN_IDS[symbol]]?.usd;
                    if (Number.isFinite(value) && value > 0) this.cache.prices[symbol] = value;
                }
                this.cache.expiresAt = Date.now() + 60_000;
            } catch (error) {
                console.warn("CoinGecko price refresh failed; using cached prices.", error instanceof Error ? error.message : error);
            }
        }

        for (const symbol of ["USDC", "USDC.E", "USDT", "DAI"]) {
            this.cache.prices[symbol] ??= 1;
        }
        return this.pick(normalized);
    }

    private pick(symbols: string[]) {
        return Object.fromEntries(symbols.map(symbol => [symbol, this.cache.prices[symbol] ?? 0]));
    }
}

export default new MarketService();
