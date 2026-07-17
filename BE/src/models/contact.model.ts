import { Schema, model, Document, Types } from "mongoose";

export interface IContact extends Document {
    user: Types.ObjectId;

    name: string;

    walletAddress: string;

    network: string;

    avatar?: string;

    isFavorite: boolean;

    createdAt: Date;

    updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        walletAddress: {
            type: String,
            required: true,
            lowercase: true,
        },

        network: {
            type: String,
            default: "ARBITRUM",
        },

        avatar: String,

        isFavorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

contactSchema.index(
    {
        user: 1,
        walletAddress: 1,
    },
    {
        unique: true,
    }
);

export default model<IContact>("Contact", contactSchema);