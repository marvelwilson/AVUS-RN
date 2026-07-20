import { Router } from "express";
import marketService from "./market.service";

const router = Router();

router.get("/prices", async (req, res, next) => {
    try {
        const symbols = String(req.query.symbols ?? "ETH,WETH,WBTC,USDC,USDT,DAI")
            .split(",")
            .map(symbol => symbol.trim())
            .filter(Boolean)
            .slice(0, 50);
        res.json({ success: true, data: await marketService.prices(symbols) });
    } catch (error) {
        next(error);
    }
});

export default router;
