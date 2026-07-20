import Wallet from "../../models/wallet.model";
import { TransactionSource, TransactionStatus, TransactionType } from "../../models/transaction.model";
import notificationService from "../notifications/notification.service";
import transactionService from "../transactions/transaction.service";
import socketService from "../websocket/socket.service";
import { SRA_CHAINS } from "../fan/sra.assets";

const NETWORKS: Record<string, { chainId: number; name: string }> = {
    ETH_MAINNET: { chainId: 1, name: "ETHEREUM" },
    ARB_MAINNET: { chainId: 42161, name: "ARBITRUM" },
    BASE_MAINNET: { chainId: 8453, name: "BASE" },
    OPT_MAINNET: { chainId: 10, name: "OPTIMISM" },
    MATIC_MAINNET: { chainId: 137, name: "POLYGON" },
    BNB_MAINNET: { chainId: 56, name: "BSC" },
    BSC_MAINNET: { chainId: 56, name: "BSC" },
    AVAX_MAINNET: { chainId: 43114, name: "AVALANCHE" },
};

type AlchemyActivity = {
    category?: string;
    fromAddress?: string;
    toAddress?: string;
    hash?: string;
    value?: number | string;
    asset?: string;
    blockNum?: string;
    rawContract?: { address?: string | null };
    log?: { logIndex?: string; blockNumber?: string; removed?: boolean };
    removed?: boolean;
};

class WebhookService {
    private tokenFor(chainId: number, activity: AlchemyActivity) {
        const chain = SRA_CHAINS.find(item => item.chainId === chainId);
        if (!chain) return undefined;
        const address = activity.rawContract?.address?.toLowerCase();
        const native = !address && ["external", "internal"].includes(activity.category ?? "");
        if (native) return chain.nativeToken;
        return [...chain.tokens, ...(chain.sendTokens ?? [])]
            .find(token => token.address.toLowerCase() === address)?.symbol;
    }

    async alchemy(payload: { id?: string; webhookId: string; event: { network: string; activity: AlchemyActivity[] } }) {
        const network = NETWORKS[payload.event.network];
        if (!network) throw new Error(`Unsupported Alchemy network: ${payload.event.network}`);

        const processed = [];
        for (const [activityIndex, activity] of payload.event.activity.entries()) {
            if (activity.removed || activity.log?.removed) continue;
            const recipient = activity.toAddress?.toLowerCase();
            const txHash = activity.hash?.toLowerCase();
            if (!recipient || !txHash) continue;

            const wallet = await Wallet.findOne({
                $or: [
                    { smartAccountAddress: recipient },
                    { kernelAddress: recipient },
                ],
            });
            if (!wallet) continue;

            const token = this.tokenFor(network.chainId, activity);
            if (!token) {
                console.warn("Ignored unsupported SRA deposit token.", activity.rawContract?.address);
                continue;
            }

            const eventPart = activity.log?.logIndex ?? activity.category ?? String(activityIndex);
            const eventId = `${network.chainId}:${txHash}:${eventPart}:${activityIndex}`;
            const existing = await transactionService.findByEventId(eventId);
            if (existing) {
                processed.push(existing);
                continue;
            }

            const transaction = await transactionService.create({
                user: wallet.user.toString(),
                wallet: wallet._id.toString(),
                type: TransactionType.RECEIVE,
                source: TransactionSource.API,
                network: network.name,
                chainId: network.chainId,
                token,
                amount: String(activity.value ?? "0"),
                sender: activity.fromAddress?.toLowerCase(),
                recipient,
                eventId,
                metadata: {
                    webhookId: payload.webhookId,
                    alchemyEventId: payload.id,
                    category: activity.category,
                    tokenAddress: activity.rawContract?.address?.toLowerCase() ?? null,
                    blockNumber: activity.log?.blockNumber ?? activity.blockNum,
                },
            });

            const completed = await transactionService.update(transaction.id, {
                status: TransactionStatus.SUCCESS,
                txHash,
            });
            const result = completed ?? transaction;
            socketService.transactionUpdated(wallet.user.toString(), result);
            socketService.walletUpdated(wallet.user.toString(), { refreshPortfolio: true });
            await notificationService.deposit(wallet.user.toString(), String(activity.value ?? "0"), token);
            processed.push(result);
        }
        return processed;
    }
}

export default new WebhookService();
