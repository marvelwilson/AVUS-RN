import { Router } from "express";

import authController from "./auth.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.post(
    "/login",
    authController.login
);

router.post(
    "/logout",
    authMiddleware,
    authController.logout
);

router.get(
    "/me",
    authMiddleware,
    authController.me
);

router.patch(
    "/session-duration",
    authMiddleware,
    authController.updateSessionDuration,
);

export default router;
