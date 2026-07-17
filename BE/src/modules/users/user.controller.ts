import { Request, Response } from "express";
import userService from "./user.service";

class UserController {
    async me(req: Request, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await userService.getById(userId);

        return res.json({
            success: true,
            data: user,
        });
    }

    async list(req: Request, res: Response) {
        const users = await userService.list();

        return res.json({
            success: true,
            data: users,
        });
    }
}

export default new UserController();
