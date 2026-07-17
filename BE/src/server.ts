import * as dotenv from "dotenv";
dotenv.config();

import http from "http";

import { Server } from "socket.io";

import { connectDatabase } from "./config/db";

import app from "./app";

import { env } from "./config/env";

import { initializeSocket } from "./modules/websocket/socket.gateway";
import walletService from "./modules/wallet/wallet.service";

const PORT = env.PORT;

async function bootstrap() {

    await connectDatabase();

    /**
     * HTTP Server
     */
    const server = http.createServer(app);

    /**
     * Socket.IO
     */
    const io = new Server(server, {

        cors: {

            origin: "*",

            methods: [

                "GET",

                "POST",

            ],

            credentials: true,

        },

    });

    /**
     * Initialize Gateway
     */
    initializeSocket(io);

    void walletService.syncMonitoring().catch(error => {
        console.error("Initial SRA monitoring synchronization failed.", error);
    });

    /**
     * Listen
     */
    server.listen(PORT, () => {

        console.log(

            `🚀 Server running on port ${PORT}`,

        );

    });

}

bootstrap();
