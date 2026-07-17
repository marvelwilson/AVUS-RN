import FanApi from "@/src/api/fan.api";

import ToolRegistry from "@/src/sdk/fan/tools/registry";

import TTSService from "./tts.service";

import {

    useFanDraftStore,

} from "@/src/store/fan-draft";

import {

    useFanStore,

} from "@/src/store/fan";
import { useWalletStore } from "@/src/store/wallet";

class ConversationService {

    async send(
        message: string,
        options: { speak?: boolean; publishToOrb?: boolean } = {},
    ) {

        const fanStore =
            useFanStore.getState();

        const draftStore =
            useFanDraftStore.getState();

        draftStore.addUserMessage(message);

        const conversation = useFanDraftStore.getState().conversation;

        fanStore.setState(
            "thinking",
        );

        const response =
            await FanApi.chat({

                message,

                draft:

                    conversation.draft,

                history: (conversation.messages ?? []).map(({ role, text }) => ({ role, text })),

            });

        /**
         * Conversation action
         */ 


        switch (

            response.action

        ) {

            case "restart":

                draftStore.restart(

                    response.draft,

                );

                break;

            case "cancel":

                draftStore.cancel();

                fanStore.setState("idle");

                return;

            default:

                draftStore.merge(

                    response.draft,

                );

        }

        draftStore.setWaitingFor(

            response.waitingFor,

        );

        draftStore.addAssistantMessage(response.message);

        if (options.publishToOrb) fanStore.setMessage(response.message);

        // Chat is text-first. Avoid speech while the sheet is open; voice
        // interactions remain audible after the sheet closes.
        if (options.speak && !fanStore.muted) {
            await TTSService.speak(response.message);
        }

        /**
         * Collecting information
         */

        if (

            response.intent ===

            "collect_information"

        ) {

            fanStore.setState("idle");

            return response;

        }

        /**
         * Execute Tool
         */

        const tool =

            ToolRegistry.get(

                response.intent,

            );

        if (tool && ["send", "sell"].includes(response.intent) && useWalletStore.getState().totalUsd <= 0) {
            const fundingMessage = "Your wallet needs funds before I can prepare that action. Please fund your AVUS wallet first—FAN assistance is free, and adding funds will bring your wallet to life.";
            draftStore.addAssistantMessage(fundingMessage);
            if (options.publishToOrb) fanStore.setMessage(fundingMessage);
            if (options.speak && !fanStore.muted) await TTSService.speak(fundingMessage);
            fanStore.setState("idle");
            return { ...response, message: fundingMessage, intent: "collect_information", waitingFor: undefined };
        }

        if (

            tool

        ) {

            await tool.execute(

                response.arguments,

            );

        }

        draftStore.complete();

        fanStore.setState("idle");

        return response;

    }

}

export default new ConversationService();
