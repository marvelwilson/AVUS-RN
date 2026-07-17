import { Request, Response } from "express";

import authService from "../../services/auth.service";

class AuthController {
    async login(req: Request, res: Response) {
        const { didToken, sessionDays = 1 } = req.body;
        if (!didToken || typeof didToken !== "string") {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid didToken.",
            });
        }
        const days = [1, 3, 7].includes(Number(sessionDays)) ? Number(sessionDays) : 1;
        const result = await authService.login(
            didToken,
            days,
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result,
        });
    }

    async updateSessionDuration(req: Request, res: Response) {
        if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
        const days = Number(req.body.days);
        if (![1, 3, 7].includes(days)) {
            return res.status(400).json({ success: false, message: "Session duration must be 1, 3, or 7 days." });
        }
        const data = await authService.updateSessionDuration(req.user.sessionId, req.user.id, days);
        return res.json({ success: true, data });
    }

    async logout(req: Request, res: Response) {
        const sessionId = req.user?.sessionId;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await authService.logout(sessionId);

        return res.json({
            success: true,
            message: "Logout successful.",
        });
    }

    async me(req: Request, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await authService.me(userId);

        return res.json({
            success: true,
            data: user,
        });
    }
}

export default new AuthController();
