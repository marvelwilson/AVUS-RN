import manifest from "./fan.manifest";

import AIService from "../../services/ai/ai.service";
import { FanChatRequest } from "./dto/chat.dto";

class FanService {

    manifest(user?: { gasSponsorshipEligible?: boolean }) {
        return {
            ...manifest,
            account: {
                gasSponsorshipEligible: user?.gasSponsorshipEligible === true,
            },
        };

    }

    async chat(
        payload: FanChatRequest,
    ) {

        return AIService.complete(

            payload,

        );

    }

    async feedback(
        payload: any,
    ) {

        console.log(

            "[FAN Feedback]",

            payload,

        );

    }

}

export default new FanService();
