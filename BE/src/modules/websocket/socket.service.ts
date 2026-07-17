import { Server } from "socket.io";

class SocketService {

    private io?: Server;

    initialize(io: Server) {

        this.io = io;

    }

    /**
     * User joins their room
     */
    join(
        userId: string,
        socketId: string,
    ) {

        const socket =
            this.io?.sockets.sockets.get(
                socketId,
            );

        socket?.join(userId);

    }

    /**
     * Leave
     */
    leave(
        userId: string,
        socketId: string,
    ) {

        const socket =
            this.io?.sockets.sockets.get(
                socketId,
            );

        socket?.leave(userId);

    }

    /**
     * Transaction Updated
     */
    transactionUpdated(
        userId: string,
        transaction: any,
    ) {

        this.io
            ?.to(userId)
            .emit(

                "transaction.updated",

                transaction,

            );

    }

    /**
     * Wallet Updated
     */
    walletUpdated(
        userId: string,
        wallet: any,
    ) {

        this.io
            ?.to(userId)
            .emit(

                "wallet.updated",

                wallet,

            );

    }

    /**
     * Notification
     */
    notification(
        userId: string,
        notification: any,
    ) {

        this.io
            ?.to(userId)
            .emit(

                "notification",

                notification,

            );

    }

}

export default new SocketService();