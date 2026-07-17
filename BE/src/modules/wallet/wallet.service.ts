import User from "../../models/user.model";
import Wallet, {
    WalletNetwork,
    WalletProvider,
} from "../../models/wallet.model";
import alchemyNotifyService from "../../services/alchemy-notify.service";

class WalletService {
    async syncMonitoring() {
        if (!alchemyNotifyService.configured()) {
            console.warn("Alchemy Notify is not configured; SRA monitoring sync skipped.");
            return;
        }
        const wallets = await Wallet.find({ smartAccountAddress: { $exists: true, $ne: null } }).select("smartAccountAddress");
        const addresses = wallets.flatMap(wallet => wallet.smartAccountAddress ? [wallet.smartAccountAddress] : []);
        if (!addresses.length) return;
        try {
            await alchemyNotifyService.subscribeMany(addresses, ["ethereum", "arbitrum", "optimism"]);
            await Wallet.updateMany({ smartAccountAddress: { $in: addresses } }, { $set: { monitoringStatus: "ACTIVE" } });
            console.log(`Alchemy monitoring synchronized for ${addresses.length} SRA address(es).`);
        } catch (error) {
            await Wallet.updateMany({ smartAccountAddress: { $in: addresses } }, { $set: { monitoringStatus: "FAILED" } });
            throw error;
        }
    }

    async register(
        userId: string,
        data: {
            embeddedAddress: string;
            smartAccountAddress: string;
            network: WalletNetwork;
        }
    ) {
        const embeddedAddress =
            data.embeddedAddress.toLowerCase();
        const smartAccountAddress =
            data.smartAccountAddress.toLowerCase();

        const wallet = await Wallet.findOneAndUpdate(
            {
                embeddedAddress,
            },
            {
                user: userId,
                provider: WalletProvider.MAGIC,
                embeddedAddress,
                smartAccountAddress,
                network: data.network,
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
            await alchemyNotifyService.subscribe(smartAccountAddress, ["ethereum", "arbitrum", "optimism"]);
            wallet.monitoringStatus = "ACTIVE";
        } catch (error) {
            wallet.monitoringStatus = "FAILED";
            console.error("Could not subscribe wallet to Alchemy Notify.", error);
        }
        await wallet.save();

        return wallet;
    }

    async list(userId: string) {
        return Wallet.find({
            user: userId,
        });
    }
}

export default new WalletService();
