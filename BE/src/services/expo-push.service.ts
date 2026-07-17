import axios from "axios";

interface ExpoPushMessage {
    to: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    sound?: "default";
}

class ExpoPushService {

    private readonly url =
        "https://exp.host/--/api/v2/push/send";

    async send(
        token: string,
        title: string,
        body: string,
        data: Record<string, any> = {},
    ) {

        if (!token) {

            return;

        }

        const message: ExpoPushMessage = {

            to: token,

            title,

            body,

            sound: "default",

            data,

        };

        const { data: response } =
            await axios.post(

                this.url,

                message,

                {

                    headers: {

                        Accept:
                            "application/json",

                        "Content-Type":
                            "application/json",

                    },

                },

            );

        return response;

    }

}

export default new ExpoPushService();