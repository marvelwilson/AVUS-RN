import STTService from "./stt.service";
import VoiceService from "./voice.service";
import TTSService from "./tts.service";
import { useFanStore } from "@/src/store/fan";

class WakeWordService {

    private running = false;
    private consecutiveNetworkErrors = 0;

    start() {

        if (this.running) {

            return;

        }

        this.running = true;

        this.listen();

    }

    stop() {

        this.running = false;

        STTService.stop();
    }

    private async listen() {

        while (this.running) {

            try {

                const speech =
                    await STTService.startContinuous();

                this.consecutiveNetworkErrors = 0;

                const text =
                    speech.transcript
                        .toLowerCase();

                if (text.includes("hey fan")) {

                    if (useFanStore.getState().expanded || useFanStore.getState().muted) {
                        continue;
                    }

                    await TTSService.speak(

                        "Hello, how can I help you today?"

                    );

                    await VoiceService.start();

                }

            } catch (error: any) {

                const isNetworkError = error?.error === "network" || error?.code === 11;
                const noSpeech = error?.error === "no-speech" || error?.code === 7;
                if (isNetworkError) {
                    this.consecutiveNetworkErrors += 1;
                    if (this.consecutiveNetworkErrors >= 3) {
                        this.running = false;
                        useFanStore.getState().setMessage("Tap to speak");
                        break;
                    }
                } else if (!noSpeech) {
                    console.warn("Wake-word recognition stopped.", error);
                }

                await new Promise<void>((resolve) => {
                    setTimeout(resolve, Math.min(1000 * 2 ** this.consecutiveNetworkErrors, 8000));
                });

            }

        }

    }

}

export default new WakeWordService();
