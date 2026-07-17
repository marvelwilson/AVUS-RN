import {

    Request,

    Response,

    NextFunction,

} from "express";

import notificationService from "./notification.service";

import {

    success,

} from "../../utils/response";

class NotificationController {

    async register(

        req: Request,

        res: Response,

        next: NextFunction,

    ) {

        try {
            if (!req.user) return null;
            await notificationService.register(

                req.user.id,

                req.body.expoPushToken,

                req.body.deviceId,

            );

            return success(

                res,

                null,

                "Device registered.",

            );

        }

        catch (error) {

            next(error);

        }

    }

}

export default new NotificationController();
