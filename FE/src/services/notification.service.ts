import {

    registerPushToken,

    startNotificationListeners,

    stopNotificationListeners,

} from "@/src/sdk/notifications";

class NotificationService {

    async initialize() {

        try {

            await registerPushToken();

            startNotificationListeners();

        }

        catch (error) {

            console.warn(

                "Notification initialization failed.",

                error,

            );

        }

    }

    destroy() {

        stopNotificationListeners();

    }

}

export default new NotificationService();