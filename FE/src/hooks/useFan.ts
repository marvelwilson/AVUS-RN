import { useFanStore } from "@/src/store/fan";

import SpeechService from "@/src/sdk/fan/services";

export default function useFan() {

    const store =
        useFanStore();

    return {

        ...store,

        startListening:

            SpeechService.start,

        stopListening:

            SpeechService.stop,

    };

}