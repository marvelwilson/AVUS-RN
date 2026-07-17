import { Server } from "socket.io";

import socketService from "./socket.service";

export function initializeSocket(
    io: Server,
) {

    socketService.initialize(io);

    io.on(

        "connection",

        socket => {
            console.log("Socket Connected:", socket.id);
            
            socket.on(

                "join",

                userId => {

                    socketService.join(

                        userId,

                        socket.id,

                    );

                },

            );

            socket.on(

                "disconnect",

                () => {

                    console.log(

                        "Socket disconnected",

                        socket.id,

                    );

                },

            );

        },

    );

}