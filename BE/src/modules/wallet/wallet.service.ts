import User from "../../models/user.model";
import Wallet, {
    WalletNetwork,
    WalletProvider,
} from "../../models/wallet.model";
import alchemyNotifyService from "../../services/alchemy-notify.service";

class WalletService {
    private addresses(wallet: { smartAccountAddress?: string | null; kernelAddress?: string | null }) {
        return [wallet.smartAccountAddress, wallet.kernelAddress].filter((address): address is string => Boolean(address));
    }

    private async activateMonitoring(wallet: any, attempts = 4) {
        const addresses = this.addresses(wallet);
        if (!addresses.length) return;

        wallet.monitoringStatus = "PENDING";
        wallet.monitoringError = undefined;
        await wallet.save();

        let lastError: unknown;
        for (let attempt = 1; attempt <= attempts; attempt += 1) {
            try {
                // Subscribe to every webhook configured in ALCHEMY_WEBHOOK_IDS.
                await alchemyNotifyService.subscribeMany(addresses);
                wallet.monitoringStatus = "ACTIVE";
                wallet.monitoringError = undefined;
                await wallet.save();
                return;
            } catch (error) {
                lastError = error;
                if (attempt < attempts) {
                    await new Promise(resolve => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
                }
            }
        }

        wallet.monitoringStatus = "FAILED";
        wallet.monitoringError = alchemyNotifyService.errorMessage(lastError);
        await wallet.save();
        throw new Error(wallet.monitoringError);
    }

    async syncMonitoring() {
        if (!alchemyNotifyService.configured()) {
            console.warn("Alchemy Notify is not configured; SRA monitoring sync skipped.");
            await Wallet.updateMany({}, {
                $set: {
                    monitoringStatus: "FAILED",
                    monitoringError: "Alchemy Notify is not configured. Check ALCHEMY_NOTIFY_TOKEN and ALCHEMY_WEBHOOK_IDS.",
                },
            });
            return;
        }
        const wallets = await Wallet.find({
            $or: [
                { smartAccountAddress: { $exists: true, $ne: null } },
                { kernelAddress: { $exists: true, $ne: null } },
            ],
        });
        for (const wallet of wallets) {
            try {
                await this.activateMonitoring(wallet);
            } catch (error) {
                console.error(`Alchemy monitoring failed for wallet ${wallet.id}:`, wallet.monitoringError);
            }
        }
        console.log(`Alchemy monitoring synchronized for ${wallets.filter(wallet => wallet.monitoringStatus === "ACTIVE").length}/${wallets.length} wallet(s).`);
    }

    async register(
        userId: string,
        data: {
            embeddedAddress: string;
            smartAccountAddress: string;
            kernelAddress: string;
            network: WalletNetwork;
            sraConfigVersion?: number;
        }
    ) {
        const embeddedAddress =
            data.embeddedAddress.toLowerCase();
        const smartAccountAddress =
            data.smartAccountAddress.toLowerCase();
        const kernelAddress = data.kernelAddress.toLowerCase();

        const wallet = await Wallet.findOneAndUpdate(
            {
                embeddedAddress,
            },
            {
                user: userId,
                provider: WalletProvider.MAGIC,
                embeddedAddress,
                smartAccountAddress,
                kernelAddress,
                network: data.network,
                sraConfigVersion: data.sraConfigVersion ?? 0,
                isPrimary: true,
                isDeployed: false,
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        await User.findByIdAndUpdate(userId, {
            wallet: wallet._id,
        });

        try {
            await this.activateMonitoring(wallet);
        } catch {
            console.error("Could not subscribe wallet to Alchemy Notify.", wallet.monitoringError);
        }

        return wallet;
    }

    async list(userId: string) {
        return Wallet.find({
            user: userId,
        });
    }
}

export default new WalletService();
