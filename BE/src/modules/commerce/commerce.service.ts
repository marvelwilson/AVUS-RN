import CommerceOrder from "../../models/commerce-order.model";
import Product from "../../models/product.model";

class CommerceService {
    private async seedCatalog() {
        if (await Product.exists({})) return;
        const merchantWallet = process.env.COMMERCE_MERCHANT_WALLET;
        if (!merchantWallet || !/^0x[a-fA-F0-9]{40}$/.test(merchantWallet)) return;
        const common = {
            token: "USDC", tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            decimals: 6, chainId: 42161, merchantName: "AVUS Marketplace", merchantWallet,
        };
        await Product.insertMany([
            { ...common, name: "Wireless Earbuds", description: "Compact everyday wireless audio.", category: "SHOPPING", price: "35000000" },
            { ...common, name: "Travel Backpack", description: "Carry-on backpack for work and travel.", category: "SHOPPING", price: "48000000" },
            { ...common, name: "Digital Gift Card", description: "A digital gift card delivered by email.", category: "SHOPPING", price: "25000000" },
        ]);
    }

    async listProducts() {
        await this.seedCatalog();
        return Product.find({ active: true }).sort({ category: 1, name: 1 }).lean();
    }

    async createOrder(user: string, productId: string, quantity: number) {
        const product = await Product.findOne({ _id: productId, active: true });
        if (!product) throw Object.assign(new Error("Product not found."), { status: 404 });
        return CommerceOrder.create({
            user, product: product._id, quantity, unitPrice: product.price,
            total: (BigInt(product.price) * BigInt(quantity)).toString(),
            token: product.token, tokenAddress: product.tokenAddress, decimals: product.decimals,
            chainId: product.chainId, merchantWallet: product.merchantWallet, status: "QUOTED",
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        });
    }

    async submitPayment(user: string, orderId: string, intentId: string, txHash?: string) {
        const order = await CommerceOrder.findOne({ _id: orderId, user });
        if (!order) throw Object.assign(new Error("Order not found."), { status: 404 });
        if (order.expiresAt.getTime() < Date.now()) throw Object.assign(new Error("Quote expired."), { status: 409 });
        order.intentId = intentId; order.txHash = txHash; order.status = "PROCESSING";
        await order.save();
        return order;
    }

    listOrders(user: string) { return CommerceOrder.find({ user }).populate("product").sort({ createdAt: -1 }); }
}

export default new CommerceService();
