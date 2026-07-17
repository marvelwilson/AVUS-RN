import {

    useFanDraftStore,

} from "@/src/store/fan-draft";

import ConversationService from "./conversation.service";

class DraftService {

    async update(

        values: Record<string, any>,

    ) {

        const store =

            useFanDraftStore

                .getState();

        store.merge(

            values,

        );

        /**
         * Continue conversation
         */

        return ConversationService.send(

            "continue",

        );

    }

}

export default new DraftService();