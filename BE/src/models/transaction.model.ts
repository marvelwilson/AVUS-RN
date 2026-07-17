import { Schema, model, Document, Types } from "mongoose";

export enum TransactionType {
    SEND = "SEND",
    RECEIVE = "RECEIVE",
    SWAP = "SWAP",
    BUY = "BUY",
    SELL = "SELL",
    BRIDGE = "BRIDGE",
}

export enum TransactionStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
}

export enum TransactionSource {
    MANUAL = "MANUAL",
    QR = "QR",
    VOICE = "VOICE",
    FAN = "FAN",
    API = "API",
}

export interface ITransaction extends Document {
    user: Types.ObjectId;

    wallet: Types.ObjectId;

    type: TransactionType;

    source: TransactionSource;

    status: TransactionStatus;

    network: string;

    token: string;

    amount: string;

    recipient?: string;

    sender?: string;

    txHash?: string;

    eventId?: string;

    intentId?: string;

    chainId?: number;

    metadata?: Record<string, any>;

    createdAt: Date;

    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true,
        },

        source: {
            type: String,
            enum: Object.values(TransactionSource),
            default: TransactionSource.MANUAL,
        },

        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            default: TransactionStatus.PENDING,
        },

        network: {
            type: String,
            required: true,
        },

        chainId: Number,

        token: {
            type: String,
            required: true,
        },

        amount: {
            type: String,
            required: true,
        },

        sender: String,

        recipient: String,

        txHash: {
            type: String,
            index: true,
        },

        eventId: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },

        intentId: {
            type: String,
            index: true,
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model<ITransaction>(
    "Transaction",
    transactionSchema
);
