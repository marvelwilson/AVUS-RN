import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validate.middleware";
import controller from "./commerce.controller";
import { createOrderSchema, submitPaymentSchema } from "./commerce.validation";

const router = Router();
router.get("/products", controller.products);
router.get("/orders", auth, controller.orders);
router.post("/orders", auth, validateRequest(createOrderSchema), controller.createOrder);
router.post("/orders/:id/payment", auth, validateRequest(submitPaymentSchema), controller.submitPayment);
export default router;
