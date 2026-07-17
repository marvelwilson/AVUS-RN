import STTService from "./stt.service";
import TTSService from "./tts.service";

import FanAssistant from "../core/assistant";

import FanSpeech from "@/src/components/fan/FanSpeech";

import { useFanStore } from "@/src/store/fan";
import conversationService from "./conversation.service";

class SpeechService {

    async start() {

        try {

            FanSpeech.startListening();

            useFanStore.getState().setState("listening");

            const speech =
                await STTService.start();

            if (

                speech.confidence !== undefined &&

                speech.confidence < 0.55

            ) {

                await TTSService.speak(

                    "Sorry, I didn't catch that.",

                );

                return;

            }

            useFanStore
                .getState()
                .setTranscript(

                    speech.transcript,

                );

            FanSpeech.thinking();

            useFanStore
                .getState()
                .setState("thinking");

            await conversationService.send(

                speech.transcript,

                { speak: true, publishToOrb: false },

            );

        } catch (error: any) {

            const unavailable = error?.error === "network" || error?.code === 11;
            const noSpeech = error?.error === "no-speech" || error?.code === 7;

            if (noSpeech) {
                useFanStore.getState().setMessage("Tap to speak");
                return;
            }

            if (!unavailable) console.error(error);

            FanSpeech.error();

            useFanStore
                .getState()
                .setState("error");

            useFanStore.getState().setMessage(
                unavailable ? "Voice unavailable — use chat or install offline voice" : "Voice command failed",
            );

        } finally {

            FanSpeech.finish();

            useFanStore
                .getState()
                .setState("idle");

        }

    }

    async stop() {

        await STTService.stop();

        await TTSService.stop();

    }

}

export default new SpeechService();
