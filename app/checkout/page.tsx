"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart";
import { formatPrice, getProduct } from "@/lib/products";
import { newOrderId } from "@/lib/payments";

// The static preview has no server, so the order is made in the browser instead.
const PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

function previewOrder(p: { email: string; name: string; method: string; items: string[] }) {
  const lines = p.items
    .map((s) => getProduct(s))
    .filter((x) => !!x && x.price)
    .map((x) => ({ slug: x!.slug, name: x!.name, price: x!.price! }));
  return {
    paymentUrl: null,
    order: {
      id: newOrderId(),
      email: p.email,
      name: p.name || undefined,
      method: p.method,
      lines,
      total: lines.reduce((n, l) => n + l.price, 0),
      currency: "CNY",
      status: "pending_payment",
      createdAt: new Date().toISOString(),
    },
  };
}

const METHODS = [
  { id: "wechat", label: "微信支付" },
  { id: "alipay", label: "支付宝" },
  { id: "card", label: "银行卡 / PayPal" },
];

export default function Checkout() {
  const { items, total, ready, clear } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [name, setName] = useState("");
  const [method, setMethod] = useState("wechat");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (email.trim() !== email2.trim()) return setErr("两次输入的邮箱不一样，序列号会发到这个邮箱，请再核对一下。");
    if (!agree) return setErr("请先勾选同意授权条款。");
    setBusy(true);
    try {
      const payload = { email, name, method, items: items.map((p) => p.slug) };
      const data = PREVIEW
        ? previewOrder(payload)
        : await fetch("/api/checkout", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          }).then(async (r) => {
            const d = await r.json();
            if (!r.ok) throw new Error(d.error);
            return d;
          });
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      try {
        sessionStorage.setItem("lastOrder", JSON.stringify(data.order));
      } catch {}
      clear();
      router.push(`/checkout/success?order=${encodeURIComponent(data.order.id)}`);
    } catch {
      setErr("订单没有创建成功，请稍后再试。");
      setBusy(false);
    }
  }

  if (ready && items.length === 0)
    return (
      <section className="section page-top">
        <div className="wrap narrow empty">
          <h1 className="h2">没有要结算的插件</h1>
          <Link href="/plugins" className="btn">
            去看看插件 <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    );

  return (
    <section className="section page-top">
      <div className="wrap checkout">
        <form onSubmit={submit} className="co-form">
          <span className="eyebrow">结算</span>
          <h1 className="h2">填写信息</h1>

          <fieldset>
            <legend>1 · 接收序列号的邮箱</legend>
            <div className="field">
              <label htmlFor="email">邮箱</label>
              <input id="email" className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="email2">再输一次邮箱</label>
              <input id="email2" className="input" type="email" required autoComplete="off" value={email2} onChange={(e) => setEmail2(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="name">称呼（选填，会写在授权里）</label>
              <input id="name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </fieldset>

          <fieldset>
            <legend>2 · 支付方式</legend>
            <div className="pay">
              {METHODS.map((m) => (
                <label key={m.id} className={`pay-opt${method === m.id ? " is-on" : ""}`}>
                  <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
            <p className="co-note">支付通道正在接入。现在提交会生成一张待支付订单，用来测试流程，不会扣款。</p>
          </fieldset>

          <label className="agree">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>
              我已阅读并同意 <Link href="/support#license" className="link">授权条款</Link> 和{" "}
              <Link href="/support#refund" className="link">退款说明</Link>
            </span>
          </label>

          {err && <p className="co-err" role="alert">{err}</p>}

          <button className="btn btn-primary co-submit" disabled={busy || !ready}>
            {busy ? "正在创建订单…" : `提交订单 · ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="co-sum">
          <h2 className="mono">订单</h2>
          <ul>
            {items.map((p) => (
              <li key={p.slug}>
                <span>{p.name}</span>
                <span>{formatPrice(p.price!)}</span>
              </li>
            ))}
          </ul>
          <div className="co-total">
            <span>合计</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <p className="muted small">数字商品，付款后通过邮件发送下载链接和序列号。</p>
        </aside>
      </div>
    </section>
  );
}
