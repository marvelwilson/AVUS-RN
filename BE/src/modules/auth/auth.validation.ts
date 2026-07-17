import { Request, Response, NextFunction } from "express";

export function validateLogin(req: Request, res: Response, next: NextFunction) {
    const { didToken } = req.body;

    if (!didToken || typeof didToken !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing or invalid didToken.",
        });
    }

    next();
}
