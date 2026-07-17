import * as Notifications from "expo-notifications";

import {

    registerPushToken,

} from "./register";

import {

    startNotificationListeners,

    stopNotificationListeners,

} from "./listeners";

Notifications.setNotificationHandler({

    handleNotification: async () => ({

        shouldShowBanner: true,

        shouldShowList: true,

        shouldPlaySound: true,

        shouldSetBadge: true,

    }),

});

export {

    registerPushToken,

    startNotificationListeners,

    stopNotificationListeners,

};