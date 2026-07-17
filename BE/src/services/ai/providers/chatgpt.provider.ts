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

class ChatGPTProvider {

    private client =

        new OpenAI({

            apiKey:

                env.OPENAI_API_KEY,

        });

    async complete(

        request: FanChatRequest,

    ): Promise<AIResponse> {

        const response =

            await this.client.responses.create({

                model: "gpt-5.5",

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

export default new ChatGPTProvider();