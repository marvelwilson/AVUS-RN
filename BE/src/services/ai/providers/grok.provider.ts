import OpenAI from "openai";

import { env } from "../../../config/env";

import fanSchema from "../schemas/fan.schema";

import SystemPrompt from "../prompts/system.prompt";

import type {

    AIResponse,

} from "../types";

import type {

    FanChatRequest,

} from "../../../modules/fan/dto/chat.dto";

class GrokProvider {

    private client =

        new OpenAI({

            apiKey:

                env.GROK_API_KEY,

            baseURL:

                "https://api.x.ai/v1",

        });

    async complete(

        request: FanChatRequest,

    ): Promise<AIResponse> {

        const response =

            await this.client.responses.create({

                model: "grok-4.3",

                reasoning: {

                    effort: "low",

                },

                input: [

                    {

                        role: "system",

                        content:

                            SystemPrompt.build(

                                request,

                            ),

                    },

                    {

                        role: "user",

                        content:

                            request.message,

                    },

                ],

                text: {

                    format: {

                        type: "json_schema",

                        ...fanSchema,

                    },

                },

            });

        return JSON.parse(

            response.output_text,

        );

    }

}

export default new GrokProvider();