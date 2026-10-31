// Payment adapter. The checkout API calls createPayment(); today it returns no payment URL,
// so the order stops at "pending payment". To go live, implement one provider here
// (e.g. 面包多 / Lemon Squeezy / Stripe / 微信支付) and return its hosted checkout URL.

export type OrderLine = { slug: string; name: string; price: number };

export type Order = {
  id: string;
  email: string;
  name?: string;
  method: string;
  lines: OrderLine[];
  total: number;
  currency: "CNY";
  status: "pending_payment" | "paid" | "failed";
  createdAt: string;
};

export type PaymentResult = { paymentUrl: string | null; provider: string };

export async function createPayment(order: Order): Promise<PaymentResult> {
  void order;
  return { paymentUrl: null, provider: "none" };
}

export function newOrderId() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UD-${t}-${r}`;
}
