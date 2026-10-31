"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, getProduct, isPurchasable } from "@/lib/products";
import { useCart } from "./cart";

export function AddToCart({ slug, big = false }: { slug: string; big?: boolean }) {
  const { add, has, ready } = useCart();
  const p = getProduct(slug);
  if (!p || !isPurchasable(p)) return null;
  const inCart = ready && has(slug);
  return inCart ? (
    <Link href="/cart" className={`btn btn-light${big ? "" : " btn-sm"}`}>
      已在购物车，去结算 <span className="arrow">→</span>
    </Link>
  ) : (
    <button className={`btn btn-primary${big ? "" : " btn-sm"}`} onClick={() => add(slug)}>
      加入购物车 · {formatPrice(p.price!)}
    </button>
  );
}

export function BuyNow({ slug }: { slug: string }) {
  const { add } = useCart();
  return (
    <Link href="/checkout" className="btn" onClick={() => add(slug)}>
      立即购买
    </Link>
  );
}

export function DownloadButtons({ slug }: { slug: string }) {
  const { toast } = useCart();
  const p = getProduct(slug);
  if (!p?.downloads) return null;
  const items = [
    { os: "macOS", note: "VST3 · AU · Intel / Apple 芯片", href: p.downloads.mac },
    { os: "Windows", note: "VST3 · 64 位", href: p.downloads.win },
  ];
  return (
    <div className="dl">
      {items.map((it) => (
        <a
          key={it.os}
          className="dl-btn"
          href={it.href || "#download"}
          onClick={(e) => {
            if (!it.href) {
              e.preventDefault();
              toast(`${it.os} 安装包正在上传，马上就好`);
            }
          }}
          {...(it.href ? { download: "" } : {})}
        >
          <span className="dl-os">{it.os}</span>
          <span className="dl-note">{it.note}</span>
          <span className="dl-icon" aria-hidden>
            ↓
          </span>
        </a>
      ))}
    </div>
  );
}

export function WaitlistForm({ product }: { product: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, product }),
      });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }
  if (state === "done")
    return (
      <p className="wl-done">
        <span className="eyebrow">已登记</span>
        <br />
        上线第一时间通知你：{email}
      </p>
    );
  return (
    <form className="wl" onSubmit={submit}>
      <label htmlFor={`wl-${product}`} className="sr">
        邮箱
      </label>
      <input
        id={`wl-${product}`}
        className="input"
        type="email"
        required
        placeholder="你的邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "提交中…" : "上线提醒我"}
      </button>
      {state === "error" && <p className="wl-err">没提交成功，稍后再试一次。</p>}
    </form>
  );
}
