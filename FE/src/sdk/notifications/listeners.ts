import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

let receivedSubscription:
    Notifications.EventSubscription;

let responseSubscription:
    Notifications.EventSubscription;

export function startNotificationListeners() {

    stopNotificationListeners();

    receivedSubscription =

        Notifications.addNotificationReceivedListener(

            notification => {

                console.log(

                    "Notification Received",

                    notification,

                );

            },

        );

    responseSubscription =

        Notifications.addNotificationResponseReceivedListener(

            response => {

                console.log(

                    "Notification Clicked",

                    response,

                );

            },

        );

}

export function stopNotificationListeners() {

    receivedSubscription?.remove();

    responseSubscription?.remove();

}
