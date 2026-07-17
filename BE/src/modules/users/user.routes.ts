import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import userController from "./user.controller";

const router = Router();

router.get("/me", authMiddleware, userController.me);
router.get("/", authMiddleware, userController.list);

export default router;
