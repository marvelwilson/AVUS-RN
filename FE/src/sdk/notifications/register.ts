import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import notificationApi from "@/src/api/notification.api";

import {

    requestPermission,

} from "./permissions";

export async function registerPushToken() {

    await requestPermission();

    if (Platform.OS === "android") {

        await Notifications.setNotificationChannelAsync(

            "default",

            {

                name: "default",

                importance:

                    Notifications.AndroidImportance.MAX,

                vibrationPattern: [

                    0,

                    250,

                    250,

                    250,

                ],

                lightColor: "#347AF0",

            },

        );

    }

    const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

    if (!projectId) {

        throw new Error(
            "Missing EAS Project ID.",
        );

    }
    
    const token =
        (

            await Notifications.getExpoPushTokenAsync({
                projectId
            })

        ).data;

    const deviceKey = "avus.notification-device-id";
    let deviceId = await SecureStore.getItemAsync(deviceKey);
    if (!deviceId) {
        deviceId = Crypto.randomUUID();
        await SecureStore.setItemAsync(deviceKey, deviceId);
    }

    await notificationApi.register(

        token,
        deviceId,

    );

    return token;

}
