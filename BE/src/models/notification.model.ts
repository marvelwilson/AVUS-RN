import { Schema, model, Document, Types } from "mongoose";

export enum NotificationType {
    TRANSACTION = "TRANSACTION",
    SECURITY = "SECURITY",
    SYSTEM = "SYSTEM",
    AI = "AI",
}

export interface INotification extends Document {
    user: Types.ObjectId;

    title: string;

    message: string;

    type: NotificationType;

    isRead: boolean;

    data?: Record<string, any>;

    createdAt: Date;

    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: Object.values(NotificationType),
            default: NotificationType.SYSTEM,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        data: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model<INotification>(
    "Notification",
    notificationSchema
);