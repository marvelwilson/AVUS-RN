import { api } from "@/src/lib/axios";

class NotificationApi {

    register(
        expoPushToken: string,
        deviceId: string,
    ) {

        return api.post(

            "/notifications/register-device",

            {

                expoPushToken,
                deviceId,

            },

        );

    }

}

export default new NotificationApi();
