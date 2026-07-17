import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    category: string;
    imageUrl?: string;
    price: string;
    token: string;
    tokenAddress: string;
    decimals: number;
    chainId: number;
    merchantName: string;
    merchantWallet: string;
    active: boolean;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    imageUrl: String,
    price: { type: String, required: true },
    token: { type: String, default: "USDC" },
    tokenAddress: { type: String, required: true, lowercase: true },
    decimals: { type: Number, default: 6 },
    chainId: { type: Number, default: 42161 },
    merchantName: { type: String, required: true },
    merchantWallet: { type: String, required: true, lowercase: true },
    active: { type: Boolean, default: true, index: true },
}, { timestamps: true, versionKey: false });

export default model<IProduct>("Product", productSchema);
