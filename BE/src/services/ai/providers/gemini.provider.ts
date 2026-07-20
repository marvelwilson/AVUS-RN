import { GoogleGenAI } from "@google/genai";

import { env } from "../../../config/env";

import fanSchema from "../schemas/fan.schema";

import SystemPrompt from "../prompts/system.prompt";

import type {
    AIResponse,
} from "../types";

import type {
    FanChatRequest,
} from "../../../modules/fan/dto/chat.dto";

class GeminiProvider {

    private client = new GoogleGenAI({

        apiKey: env.GEMINI_API_KEY,

    });

    async complete(
        request: FanChatRequest,
    ): Promise<AIResponse> {

        const response =
            await this.client.models.generateContent({

                model: "gemini-3.5-flash",

                contents: [

                    {
                        role: "user",

                        parts: [

                            {
                                text: `${SystemPrompt.build(request)}

User:

${request.message}`,
                            },

                        ],

                    },

                ],

                config: {

                    responseMimeType: "application/json",

                    responseJsonSchema:
                        fanSchema.schema,

                },

            });

        const text =
            response.text;

        if (!text) {

            throw new Error(
                "Gemini returned an empty response.",
            );

        }

        return JSON.parse(
            text,
        );

    }

}

export default new GeminiProvider();