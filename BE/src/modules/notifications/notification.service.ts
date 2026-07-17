import User from "../../models/user.model";

import expoPushService from "../../services/expo-push.service";
import socketService from "../websocket/socket.service";

class NotificationService {

    async register(

        userId: string,

        expoPushToken: string,

        deviceId: string,

    ) {

        const user = await User.findById(userId);
        if (!user) return;

        const previousToken = user.expoPushToken;
        if (previousToken && user.expoDeviceId && user.expoDeviceId !== deviceId) {
            const alert = {
                title: "New device detected",
                body: "Your AVUS account was signed in on a new device. If this wasn't you, secure your account immediately.",
                data: { type: "security", action: "new_device" },
            };
            socketService.notification(userId, alert);
            try {
                await expoPushService.send(previousToken, alert.title, alert.body, alert.data);
            } catch (error) {
                console.warn("Could not alert the previous push token.", error);
            }
        }

        user.expoPushToken = expoPushToken;
        user.expoDeviceId = deviceId;
        await user.save();

    }

    async send(

        userId: string,

        title: string,

        body: string,

        data: Record<string, any> = {},

    ) {

        const user =
            await User.findById(
                userId,
            );

        if (

            !user ||

            !user.expoPushToken

        ) {

            return;

        }

        return expoPushService.send(

            user.expoPushToken,

            title,

            body,

            data,

        );

    }

    async deposit(

        userId: string,

        amount: string,

        token: string,

    ) {

        return this.send(

            userId,

            "Deposit Received",

            `${amount} ${token} has been received.`,

            {

                type:
                    "deposit",

            },

        );

    }

    async transfer(

        userId: string,

        amount: string,

        token: string,

    ) {

        return this.send(

            userId,

            "Transfer Successful",

            `${amount} ${token} sent successfully.`,

            {

                type:
                    "send",

            },

        );

    }

}

export default new NotificationService();
