import {

    Request,
    Response,

} from "express";

import FanService from "./fan.service";
import User from "../../models/user.model";

class FanController {

    async manifest(
        req: Request,
        res: Response,
    ) {

        const user = req.user
            ? await User.findById(req.user.id).select("gasSponsorshipEligible").lean()
            : undefined;
        const data = FanService.manifest(user ?? undefined);

        res.json({

            success: true,

            data,

        });

    }

    async chat(
        req: Request,
        res: Response,
    ) {
        const response =
            await FanService.chat(

                req.body,

            );

        res.json({

            success: true,

            data: response,

        });

    }

    async feedback(
        req: Request,
        res: Response,
    ) {

        await FanService.feedback(

            req.body,

        );

        res.json({

            success: true,

        });

    }

}

export default new FanController();
