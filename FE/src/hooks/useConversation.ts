import {

    useCallback,

} from "react";

import ConversationService from "@/src/sdk/fan/services/conversation.service";

import DraftService from "@/src/sdk/fan/services/draft.service";

import {

    useFanDraftStore,

} from "@/src/store/fan-draft";

export default function useConversation() {

    const conversation =

        useFanDraftStore(

            s =>

                s.conversation,

        );

    const send =

        useCallback(

            ConversationService.send,

            [],

        );

    const updateDraft =

        useCallback(

            DraftService.update,

            [],

        );

    return {

        conversation,

        send,

        updateDraft,

    };

}