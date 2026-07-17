import { Router } from "express";

import controller from "./notification.controller";



import {

    registerDeviceSchema,

} from "./notification.validation";
import validateRequest from "../../middleware/validate.middleware";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.post(
    "/register-device",
    authMiddleware,
    validateRequest(
        registerDeviceSchema,
    ),
    controller.register,
);

export default router;