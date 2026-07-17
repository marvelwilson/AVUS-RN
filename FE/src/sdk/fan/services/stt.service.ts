import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Platform } from "react-native";

import type {

    SpeechRecognitionResult,

} from "./types";

class STTService {

    async downloadOfflineModel(lang = "en-US") {
        if (Platform.OS !== "android") return { status: "not_android" as const };
        return ExpoSpeechRecognitionModule.androidTriggerOfflineModelDownload({
            locale: lang,
        });
    }

    private async useOnDeviceRecognition(lang = "en-US") {
        try {
            if (!ExpoSpeechRecognitionModule.supportsOnDeviceRecognition()) return false;

            const { installedLocales } =
                await ExpoSpeechRecognitionModule.getSupportedLocales({});

            const normalized = lang.toLowerCase().replace("_", "-");
            return installedLocales.some((locale) =>
                locale.toLowerCase().replace("_", "-") === normalized,
            );
        } catch {
            return false;
        }
    }

    async start(): Promise<SpeechRecognitionResult> {

        return new Promise(async (resolve, reject) => {

            const available =
                ExpoSpeechRecognitionModule.isRecognitionAvailable();

            if (!available) {

                reject(
                    new Error(
                        "Speech recognition unavailable.",
                    ),
                );

                return;
            }

            const permissions =
                await ExpoSpeechRecognitionModule.requestPermissionsAsync();

            if (!permissions.granted) {

                reject(
                    new Error(
                        "Microphone permission denied.",
                    ),
                );

                return;
            }

            const resultSubscription =
                ExpoSpeechRecognitionModule.addListener(

                    "result",

                    (event: any) => {

                        if (!event.isFinal) {

                            return;

                        }

                        ExpoSpeechRecognitionModule.stop();

                        resultSubscription.remove();

                        errorSubscription.remove();

                        resolve({

                            transcript:
                                event.results?.[0]?.transcript ?? "",

                            confidence:
                                event.results?.[0]?.confidence,

                            language:
                                event.language,

                        });

                    },

                );

            const errorSubscription =
                ExpoSpeechRecognitionModule.addListener(

                    "error",

                    (event: any) => {

                        resultSubscription.remove();

                        errorSubscription.remove();

                        reject(event);

                    },

                );

            await ExpoSpeechRecognitionModule.start({

                lang: "en-US",

                interimResults: false,

                continuous: false,

                requiresOnDeviceRecognition: await this.useOnDeviceRecognition(),

            });

        });

    }

    async startContinuous(): Promise<SpeechRecognitionResult> {

        return new Promise(async (resolve, reject) => {

            const available =
                ExpoSpeechRecognitionModule.isRecognitionAvailable();

            if (!available) {

                reject(
                    new Error(
                        "Speech recognition unavailable.",
                    ),
                );

                return;
            }

            const permissions =
                await ExpoSpeechRecognitionModule.requestPermissionsAsync();

            if (!permissions.granted) {

                reject(
                    new Error(
                        "Microphone permission denied.",
                    ),
                );

                return;
            }

            const resultSubscription =
                ExpoSpeechRecognitionModule.addListener(

                    "result",

                    (event: any) => {

                        if (!event.isFinal) {

                            return;

                        }

                        ExpoSpeechRecognitionModule.stop();

                        resultSubscription.remove();

                        errorSubscription.remove();

                        resolve({

                            transcript:
                                event.results?.[0]?.transcript ?? "",

                            confidence:
                                event.results?.[0]?.confidence,

                            language:
                                event.language,

                        });

                    },

                );

            const errorSubscription =
                ExpoSpeechRecognitionModule.addListener(

                    "error",

                    (event: any) => {

                        resultSubscription.remove();

                        errorSubscription.remove();

                        reject(event);

                    },

                );

            ExpoSpeechRecognitionModule.start({

                lang: "en-US",

                interimResults: true,

                continuous: true,

                requiresOnDeviceRecognition: await this.useOnDeviceRecognition(),

            });

        });

    }

    async stop() {

        await ExpoSpeechRecognitionModule.stop();

    }

}

export default new STTService();
