"use client";

import Link from "next/link";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/products";

export default function Cart() {
  const { items, total, remove, ready } = useCart();
  return (
    <section className="section page-top">
      <div className="wrap narrow">
        <span className="eyebrow">购物车</span>
        <h1 className="h2 cart-title">购物车</h1>
        {!ready ? null : items.length === 0 ? (
          <div className="empty">
            <p className="muted">购物车是空的。</p>
            <Link href="/plugins" className="btn">
              去看看插件 <span className="arrow">→</span>
            </Link>
          </div>
        ) : (
          <>
            <ul className="lines">
              {items.map((p) => (
                <li key={p.slug}>
                  <div className="line-thumb">{p.image ? <img src={p.image} alt="" /> : <span>{p.name}</span>}</div>
                  <div className="line-main">
                    <Link href={`/plugins/${p.slug}`} className="line-name">
                      {p.name}
                    </Link>
                    <span className="muted small">单用户授权 · {p.platforms.join(" / ")}</span>
                  </div>
                  <span className="line-price">{formatPrice(p.price!)}</span>
                  <button className="line-rm" onClick={() => remove(p.slug)} aria-label={`移除 ${p.name}`}>
                    移除
                  </button>
                </li>
              ))}
            </ul>
            <div className="summary">
              <div className="summary-row">
                <span className="muted">合计</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <Link href="/checkout" className="btn btn-primary">
                去结算 <span className="arrow">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
