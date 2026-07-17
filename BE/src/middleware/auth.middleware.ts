import { Request, Response, NextFunction } from "express";
import jwtService from "../services/jwt.service";
import sessionService from "../services/session.service";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                sessionId: string;
            };
        }
    }
}

async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const token = authorization.replace(
        "Bearer ",
        ""
    ).trim();

    try {
        const payload = (await jwtService.verify(
            token
        )) as {
            sub?: string;
            sid?: string;
        };

        if (!payload?.sub || !payload?.sid) {
            throw new Error("Invalid token payload");
        }

        const session = await sessionService.get(
            payload.sid
        );

        if (!session) {
            throw new Error("Session not found");
        }

        req.user = {
            id: payload.sub,
            sessionId: payload.sid,
        };

        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
}

export default authMiddleware;
