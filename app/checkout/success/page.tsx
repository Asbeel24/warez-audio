"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/products";
import type { Order } from "@/lib/payments";

function Inner() {
  const id = useSearchParams().get("order");
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    try {
      const o = JSON.parse(sessionStorage.getItem("lastOrder") ?? "null") as Order | null;
      if (o && o.id === id) setOrder(o);
    } catch {}
  }, [id]);

  return (
    <div className="wrap narrow done">
      <div className="done-mark" aria-hidden>
        ✓
      </div>
      <span className="eyebrow">订单已创建</span>
      <h1 className="h2">谢谢支持</h1>
      <p className="lead">
        订单号 <span className="mono">{id ?? "—"}</span>
        {order ? `，合计 ${formatPrice(order.total)}` : ""}。
      </p>
      <p className="co-note">
        支付通道还在接入中，这一步目前只用来测试流程，没有发生扣款。正式上线后，这里会显示付款结果，下载链接会发到{" "}
        {order?.email ?? "你的邮箱"}。
      </p>
      <div className="hero-ctas">
        <Link href="/plugins" className="btn">
          继续看看 <span className="arrow">→</span>
        </Link>
        <Link href="/support" className="btn">
          安装说明
        </Link>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <section className="section page-top">
      <Suspense>
        <Inner />
      </Suspense>
    </section>
  );
}
