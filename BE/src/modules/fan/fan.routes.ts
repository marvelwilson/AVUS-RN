import {

    Router,

} from "express";

import FanController from "./fan.controller";


import validateRequest from "../../middleware/validate.middleware";
import { chatSchema } from "./fan.validation";

const router =
    Router();

router.get(
    "/manifest",
    FanController.manifest,
);

router.post(
    "/chat",
    validateRequest(chatSchema),
    FanController.chat,
);

router.post(
    "/feedback",
    FanController.feedback,
);

export default router;