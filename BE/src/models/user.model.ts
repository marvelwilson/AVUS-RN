import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
    issuer: string;
    email?: string;
    displayName?: string;
    avatar?: string;

    wallet?: Types.ObjectId;

    isActive: boolean;
    emailVerified: boolean;
    gasSponsorshipEligible: boolean;

    expoPushToken: string;
    expoDeviceId?: string;

    lastLoginAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        issuer: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
        },

        displayName: {
            type: String,
            trim: true,
        },

        avatar: {
            type: String,
        },

        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        emailVerified: {
            type: Boolean,
            default: true,
        },
        gasSponsorshipEligible: {
            type: Boolean,
            default: false,
            index: true,
        },
        expoPushToken: {

            type: String,

            default: null,

        },
        expoDeviceId: {
            type: String,
            default: null,
        },
        lastLoginAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model<IUser>("User", userSchema);
