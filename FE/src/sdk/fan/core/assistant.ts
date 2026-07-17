import fanApi from "@/src/api/fan.api";

import IntentRegistry from "./registry";

import type {

    FanResponse,

} from "../types/response";

class FanAssistant {

    async execute(
        message: string,
    ): Promise<FanResponse> {

        const {

            data,

        } = await fanApi.chat(message);

        const response =
            data.data as FanResponse;

        await IntentRegistry.execute(

            response,

        );

        return response;

    }

}

export default new FanAssistant();