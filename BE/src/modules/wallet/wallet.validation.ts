import { Request, Response, NextFunction } from "express";

export function validateWalletRegistration(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { embeddedAddress, smartAccountAddress, network } = req.body;

    if (!embeddedAddress || typeof embeddedAddress !== "string") {
        return res.status(400).json({
            success: false,
            message: "embeddedAddress is required.",
        });
    }

    if (!smartAccountAddress || typeof smartAccountAddress !== "string") {
        return res.status(400).json({
            success: false,
            message: "smartAccountAddress is required.",
        });
    }

    if (!network || typeof network !== "string") {
        return res.status(400).json({
            success: false,
            message: "network is required.",
        });
    }

    next();
}
