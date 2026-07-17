import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("Unhandled server error:", err);

    const message = err instanceof Error ? err.message : "Internal Server Error";

    res.status(500).json({
        success: false,
        message,
    });
}

export default errorMiddleware;
