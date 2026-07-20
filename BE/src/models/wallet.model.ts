import { Schema, model, Document, Types } from "mongoose";

export enum WalletProvider {
    MAGIC = "MAGIC",
}

export enum WalletNetwork {
    ARBITRUM = "ARBITRUM",
    BASE = "BASE",
    OPTIMISM = "OPTIMISM",
}

export interface IWallet extends Document {
    user: Types.ObjectId;

    provider: WalletProvider;

    embeddedAddress: string;

    smartAccountAddress?: string;

    kernelAddress?: string;

    sraConfigVersion: number;

    network: WalletNetwork;

    isPrimary: boolean;

    isDeployed: boolean;

    monitoringStatus: "PENDING" | "ACTIVE" | "FAILED";

    monitoringError?: string;

    createdAt: Date;
    updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        provider: {
            type: String,
            enum: Object.values(WalletProvider),
            default: WalletProvider.MAGIC,
        },

        embeddedAddress: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        smartAccountAddress: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            index: true,
        },

        network: {
            type: String,
            enum: Object.values(WalletNetwork),
            default: WalletNetwork.ARBITRUM,
        },

        isPrimary: {
            type: Boolean,
            default: true,
        },

        isDeployed: {
            type: Boolean,
            default: false,
        },

        kernelAddress: {
            type: String,
            lowercase: true,
            index: true,
        },

        sraConfigVersion: {
            type: Number,
            default: 0,
        },
        monitoringStatus: {
            type: String,
            enum: ["PENDING", "ACTIVE", "FAILED"],
            default: "PENDING",
            index: true,
        },
        monitoringError: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model<IWallet>("Wallet", walletSchema);
