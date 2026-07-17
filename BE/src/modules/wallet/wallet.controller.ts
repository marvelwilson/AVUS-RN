import { Request, Response } from "express";
import walletService from "./wallet.service";

class WalletController {
    async register(req: Request, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { embeddedAddress, smartAccountAddress, network } =
            req.body;

        const wallet = await walletService.register(
            userId,
            {
                embeddedAddress,
                smartAccountAddress,
                network,
            }
        );

        return res.status(201).json({
            success: true,
            message: "Wallet registered.",
            data: wallet,
        });
    }

    async list(req: Request, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const wallets = await walletService.list(userId);

        return res.json({
            success: true,
            data: wallets,
        });
    }
}

export default new WalletController();
