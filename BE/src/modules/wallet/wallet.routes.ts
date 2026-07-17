import { Router } from "express";

import walletController from "./wallet.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.post(
    "/",
    authMiddleware,
    walletController.register
);

router.get(
    "/",
    authMiddleware,
    walletController.list
);

export default router;
