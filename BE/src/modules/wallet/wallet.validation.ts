import { Request, Response, NextFunction } from "express";

export function validateWalletRegistration(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { embeddedAddress, smartAccountAddress, network, sraConfigVersion } = req.body;

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

    if (sraConfigVersion !== undefined && (!Number.isInteger(sraConfigVersion) || sraConfigVersion < 0)) {
        return res.status(400).json({
            success: false,
            message: "sraConfigVersion must be a non-negative integer.",
        });
    }

    next();
}
