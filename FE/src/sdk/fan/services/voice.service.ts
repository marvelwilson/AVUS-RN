import STTService from "./stt.service";
import ConversationService from "./conversation.service";

import FanSpeech from "@/src/components/fan/FanSpeech";

class VoiceService {

    private listening = false;

    async start() {

        if (this.listening) {

            return;

        }

        this.listening = true;

        try {

            FanSpeech.startListening();

            const speech =
                await STTService.start();

            if (

                !speech ||

                !speech.transcript.trim()

            ) {

                FanSpeech.finish();

                return;

            }

            FanSpeech.thinking();

            await ConversationService.send(speech.transcript, {
                speak: true,
                publishToOrb: false,
            });

        } catch (error) {

            console.error(

                "[FAN]",

                error,

            );

            FanSpeech.error();

        } finally {

            this.listening = false;

            FanSpeech.finish();

        }

    }

}

export default new VoiceService();
