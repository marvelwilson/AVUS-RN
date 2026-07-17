import { Request, Response, NextFunction } from "express";

import webhookService from "./webhook.service";
import alchemyNotifyService from "../../services/alchemy-notify.service";

import { success } from "../../utils/response";

class WebhookController {

    async deposit(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {

        try {

            const rawBody = (req as Request & { rawBody?: Buffer }).rawBody ?? Buffer.alloc(0);
            const signature = req.header("X-Alchemy-Signature") ?? undefined;
            if (!alchemyNotifyService.verify(req.body.webhookId, rawBody, signature)) {
                return res.status(401).json({ success: false, message: "Invalid webhook signature." });
            }

            const transaction = await webhookService.alchemy(req.body);

            return success(

                res,

                transaction,

                "Deposit processed.",

            );

        } catch (error) {

            next(error);

        }

    }

}

export default new WebhookController();
