import { api } from "@/src/lib/axios";

export interface CommerceProduct {
  _id: string; name: string; description: string; category: string; price: string;
  token: string; tokenAddress: `0x${string}`; decimals: number; chainId: number; merchantName: string;
}

export interface CommerceQuote {
  _id: string; total: string; token: string; tokenAddress: `0x${string}`;
  decimals: number; chainId: number; merchantWallet: `0x${string}`; expiresAt: string;
}

class CommerceApi {
  async products() { const { data } = await api.get<{ data: CommerceProduct[] }>("/commerce/products"); return data.data; }
  async createOrder(productId: string, quantity = 1) { const { data } = await api.post<{ data: CommerceQuote }>("/commerce/orders", { productId, quantity }); return data.data; }
  async submitPayment(orderId: string, intentId: string, txHash?: string) { const { data } = await api.post(`/commerce/orders/${orderId}/payment`, { intentId, txHash }); return data.data; }
}
export default new CommerceApi();
