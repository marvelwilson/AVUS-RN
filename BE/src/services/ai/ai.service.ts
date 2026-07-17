import manifest from "../../modules/fan/fan.manifest";

import type {

    FanChatRequest,

} from "../../modules/fan/dto/chat.dto";

import ResponseValidator from "./validators/response.validator";

import ChatGPTProvider from "./providers/chatgpt.provider";

import GrokProvider from "./providers/grok.provider";
import ConversationService from "./conversation/conversation.services";

class AIService {

    async complete(

        request: FanChatRequest,

    ) {

        const response =

            manifest.assistant.provider === "GROK"

            ? await GrokProvider.complete(

                request,

            )

            : await ChatGPTProvider.complete(

                request,

            );

        response.draft = ConversationService.mergeDraft(
            request.draft,
            response.draft,
            request.message,
            response.intent,
        );

        if (response.intent !== "collect_information") {
            response.arguments = { ...response.draft };
        }

        return ResponseValidator.validate(

            response,

        );

    }

}

export default new AIService();
