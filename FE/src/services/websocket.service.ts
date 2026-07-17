import { io, type Socket } from "socket.io-client";

import { useAuthStore } from "@/src/store/auth";
import { useHistoryStore } from "@/src/store/history";
import WalletService from "./wallet.service";

class WebsocketService {

    private socket?: Socket;

    connect() {

        if (this.socket?.connected) {

            return;

        }

        const user =
            useAuthStore.getState().user;

        if (!user) {

            return;

        }

        this.socket = io(

            process.env.EXPO_PUBLIC_SOCKET_URL!,

            {

                transports: [

                    "websocket",

                ],

                reconnection: true,

                reconnectionAttempts: Infinity,

                reconnectionDelay: 2000,

            },

        );

        this.socket.on(

            "connect",

            () => {

                console.log(

                    "Socket:",

                    this.socket?.id,

                );

                this.socket?.emit(

                    "join",

                    user._id,

                );

            },

        );

        this.socket.on(

            "transaction.updated",

            transaction => {

                useHistoryStore
                    .getState()
                    .upsert(transaction);

                if (transaction.type === "RECEIVE" && transaction.status === "SUCCESS") {
                    void WalletService.refresh().catch(console.warn);
                }

            },

        );

    }

    disconnect() {

        this.socket?.disconnect();

        this.socket = undefined;

    }

}

export default new WebsocketService();
