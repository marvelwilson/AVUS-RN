import * as Speech from "expo-speech";

class TTSService {

    private enabled = true;

    setEnabled(enabled: boolean) {
        this.enabled = enabled;

        if (!enabled) {
            void Speech.stop();
        }
    }

    async speak(text?: string) {

        if (!this.enabled || !text?.trim()) {
            return;
        }

        const available = await Speech.isSpeakingAsync().catch(() => false);
        if (available) {
            await Speech.stop();
        }

        return new Promise<void>((resolve) => {

            Speech.speak(text, {

                language: "en-US",

                rate: 0.95,

                pitch: 1,

                onDone: resolve,

                onStopped: resolve,

                onError(error) {

                    console.error("[TTS]", error);

                    resolve();

                },

            });

        });

    }

    async stop() {

        await Speech.stop();

    }

}

export default new TTSService();
