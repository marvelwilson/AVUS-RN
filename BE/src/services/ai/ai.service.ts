import manifest from "../../modules/fan/fan.manifest";

import type {
    FanChatRequest,
} from "../../modules/fan/dto/chat.dto";

import ResponseValidator from "./validators/response.validator";

import ChatGPTProvider from "./providers/chatgpt.provider";
import GrokProvider from "./providers/grok.provider";
import GeminiProvider from "./providers/gemini.provider";

import ConversationService from "./conversation/conversation.services";

class AIService {

    async complete(
        request: FanChatRequest,
    ) {

        let response;

        switch (manifest.assistant.provider) {

            case "CHATGPT":

                response =
                    await ChatGPTProvider.complete(
                        request,
                    );

                break;

            case "GROK":

                response =
                    await GrokProvider.complete(
                        request,
                    );

                break;

            case "GEMINI":

                response =
                    await GeminiProvider.complete(
                        request,
                    );

                break;

            default:

                throw new Error(
                    `Unsupported AI provider: ${manifest.assistant.provider}`,
                );

        }

        response.draft =
            ConversationService.mergeDraft(
                request.draft,
                response.draft,
                request.message,
                response.intent,
            );

        if (response.intent !== "collect_information") {

            response.arguments = {

                ...response.draft,

            };

        }

        return ResponseValidator.validate(
            response,
        );

    }

}

export default new AIService();