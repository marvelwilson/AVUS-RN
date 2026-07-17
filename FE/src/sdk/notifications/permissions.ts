import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function requestPermission() {

    if (!Device.isDevice) {

        throw new Error(
            "Push notifications require a physical device.",
        );

    }

    const {

        status: existing,

    } = await Notifications.getPermissionsAsync();

    let status = existing;

    if (status !== "granted") {

        const result =
            await Notifications.requestPermissionsAsync();

        status = result.status;

    }

    if (status !== "granted") {

        throw new Error(
            "Push notification permission denied.",
        );

    }

}