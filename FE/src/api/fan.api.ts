import { api } from "@/src/lib/axios";
import type {

    FanChatRequest,
    FanChatResponse,

} from "@/src/sdk/fan/types/chats";
import type { FanPolicy } from "@/src/sdk/fan/types/policy";
class FanApi {

    /**
     * Manifest
     */
    manifest() {

        return api.get<{ success: boolean; data: FanPolicy }>("/fan/manifest");

    }

    /**
     * Chat
     */
    async chat(
        payload: FanChatRequest,
    ) {

        const { data } =
            await api.post<{ success: boolean; data: FanChatResponse }>(

                "/fan/chat",

                payload,

            );

        return data.data;

    }

    /**
     * Feedback
     */
    feedback(data: {

        message: string;

        response: string;

        helpful: boolean;

    }) {

        return api.post(

            "/fan/feedback",

            data,

        );

    }

}

export default new FanApi();
