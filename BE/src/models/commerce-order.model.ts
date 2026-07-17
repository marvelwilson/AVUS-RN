import { Schema, model, Document, Types } from "mongoose";

export type CommerceOrderStatus = "QUOTED" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED";

export interface ICommerceOrder extends Document {
    user: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
    unitPrice: string;
    total: string;
    token: string;
    tokenAddress: string;
    decimals: number;
    chainId: number;
    merchantWallet: string;
    status: CommerceOrderStatus;
    txHash?: string;
    intentId?: string;
    expiresAt: Date;
}

const commerceOrderSchema = new Schema<ICommerceOrder>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, max: 20 },
    unitPrice: { type: String, required: true },
    total: { type: String, required: true },
    token: { type: String, required: true },
    tokenAddress: { type: String, required: true },
    decimals: { type: Number, required: true },
    chainId: { type: Number, required: true },
    merchantWallet: { type: String, required: true },
    status: { type: String, enum: ["QUOTED", "PROCESSING", "PAID", "FAILED", "CANCELLED"], default: "QUOTED", index: true },
    txHash: String,
    intentId: String,
    expiresAt: { type: Date, required: true, index: { expires: 86400 } },
}, { timestamps: true, versionKey: false });

export default model<ICommerceOrder>("CommerceOrder", commerceOrderSchema);
