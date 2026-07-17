import { Router } from "express";

import controller from "./webhook.controller";


import {

    depositWebhookSchema,

} from "./webhook.validation";
import validateRequest from "../../middleware/validate.middleware";

const router = Router();

router.post(

    "/deposit",

    validateRequest(
        depositWebhookSchema,
    ),

    controller.deposit,

);

export default router;