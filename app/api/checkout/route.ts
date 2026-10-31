import { NextResponse } from "next/server";
import { getProduct, isPurchasable } from "@/lib/products";
import { createPayment, newOrderId, type Order } from "@/lib/payments";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const METHODS = ["wechat", "alipay", "card"];

// Creates an order from the cart. Prices are always taken from the catalogue on the server,
// never from the browser.
export async function POST(req: Request) {
  let body: { email?: string; name?: string; method?: string; items?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const email = (body.email ?? "").trim();
  if (!EMAIL.test(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  const method = METHODS.includes(body.method ?? "") ? body.method! : "wechat";
  const slugs = Array.from(new Set(body.items ?? []));
  const lines = slugs
    .map((s) => getProduct(s))
    .filter((p) => p && isPurchasable(p))
    .map((p) => ({ slug: p!.slug, name: p!.name, price: p!.price! }));
  if (lines.length === 0) return NextResponse.json({ error: "empty_cart" }, { status: 400 });

  const order: Order = {
    id: newOrderId(),
    email,
    name: body.name?.trim() || undefined,
    method,
    lines,
    total: lines.reduce((n, l) => n + l.price, 0),
    currency: "CNY",
    status: "pending_payment",
    createdAt: new Date().toISOString(),
  };
  const payment = await createPayment(order);
  // TODO: persist the order (database or the payment provider's own records).
  console.log("[checkout] order", order.id, order.total, order.lines.map((l) => l.slug).join(","));
  return NextResponse.json({ order, ...payment });
}
