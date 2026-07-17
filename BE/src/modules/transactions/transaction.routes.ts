import { Router } from "express";

import controller from "./transaction.controller";

import auth from "../../middleware/auth.middleware";


import {

    createTransactionSchema,

    updateTransactionSchema,

    listTransactionSchema,

} from "./transaction.validation";
import validateRequest from "../../middleware/validate.middleware";

const router = Router();

/**
 * Create
 */
router.post(

    "/",

    auth,

    validateRequest(
        createTransactionSchema,
    ),

    controller.create,

);

/**
 * List
 */
router.get(

    "/",

    auth,

    validateRequest(
        listTransactionSchema,
    ),

    controller.list,

);

/**
 * Get One
 */
router.get(

    "/:id",

    auth,

    controller.get,

);

/**
 * Update Status
 */
router.patch(

    "/:id/status",

    auth,

    validateRequest(
        updateTransactionSchema,
    ),

    controller.updateStatus,

);

export default router;