import { Request, Response, NextFunction } from "express";

import transactionService from "./transaction.service";

import {
    success,
} from "../../utils/response";

import socketService from "../websocket/socket.service";
import Wallet from "../../models/wallet.model";

class TransactionController {

    /**
     * POST /transactions
     */
    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }

            const wallet = await Wallet.findOne({
                user: req.user.id,
                isPrimary: true,
            }).select("_id");

            if (!wallet) {
                return res.status(409).json({
                    success: false,
                    message: "Your wallet is not initialized yet. Please reopen the wallet and try again.",
                });
            }
            const transaction =
                await transactionService.create({

                    user:
                        req?.user.id,

                    wallet:
                        wallet.id,

                    type:
                        req.body.type,

                    source:
                        req.body.source,

                    network:
                        req.body.destinationAsset.network,

                    chainId:
                        req.body.destinationAsset.chainId,

                    token:
                        req.body.destinationAsset.symbol ?? req.body.destinationAsset.token,

                    amount:
                        req.body.amount,

                    sender:
                        req.body.sender,

                    recipient:
                        req.body.recipient,

                    metadata: {
                        ...req.body.metadata,
                        destinationTokenAddress: req.body.destinationAsset.token,
                        sourceAsset: req.body.sourceAsset,
                    },

                });

            return success(

                res,

                transaction,

                "Transaction created."

            );

        } catch (error) {
            
            next(error);

        }

    }

    /**
     * GET /transactions
     */
    async list(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {

        try {
            if (!req.user) return null;
            const result =
                await transactionService.list({

                    user:
                        req.user.id,

                    cursor:
                        req.query.cursor as string,

                    limit:
                        Number(req.query.limit) || 20,

                });

            return success(

                res,

                result,

            );

        } catch (error) {

            next(error);

        }

    }

    /**
     * GET /transactions/:id
     */
    async get(
        req: any,
        res: Response,
        next: NextFunction,
    ) {

        try {

            const transaction =
                await transactionService.findById(

                    req.params.id,

                    req.user?.id,

                );

            return success(

                res,

                transaction,

            );

        } catch (error) {

            next(error);

        }

    }

    /**
     * PATCH /transactions/:id/status
     */
    async updateStatus(
        req: any,
        res: Response,
        next: NextFunction,
    ) {

        try {

            const transaction = await transactionService.update(

                req.params.id,

                {

                    status:
                        req.body.status,

                    txHash:
                        req.body.txHash,

                    intentId:
                        req.body.intentId,

                    metadata:
                        req.body.metadata,

                },

                req.user?.id,

            );

            if (!transaction) return null;
            socketService.transactionUpdated(

                transaction.user.toString(),

                transaction,

            );

            /**
             * TODO
             * Push Notification
             */

            return success(

                res,

                transaction,

                "Transaction updated.",

            );

        } catch (error) {

            next(error);

        }

    }

}

export default new TransactionController();
