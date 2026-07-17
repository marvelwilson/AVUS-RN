import { Schema, model, Document, Types } from "mongoose";

export enum DevicePlatform {
    IOS = "IOS",
    ANDROID = "ANDROID",
    WEB = "WEB",
}

export interface ISession extends Document {
    user: Types.ObjectId;

    sessionId: string;

    refreshToken?: string;

    deviceName?: string;

    platform: DevicePlatform;

    deviceId?: string;

    ipAddress?: string;

    userAgent?: string;

    expiresAt: Date;

    revokedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        refreshToken: {
            type: String,
            select: false,
        },

        deviceName: {
            type: String,
        },

        platform: {
            type: String,
            enum: Object.values(DevicePlatform),
            default: DevicePlatform.ANDROID,
        },

        deviceId: {
            type: String,
        },

        ipAddress: {
            type: String,
        },

        userAgent: {
            type: String,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },

        revokedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model<ISession>("Session", sessionSchema);