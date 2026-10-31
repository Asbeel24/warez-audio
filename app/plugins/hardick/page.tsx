import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { AddToCart, BuyNow } from "@/components/Buy";
import { PriceTag, StatusBadge } from "@/components/ProductCard";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = { title: "HARDICK" };

// Placeholder page: replace the copy and media once the HARDICK material is in.
export default function Hardick() {
  const p = getProduct("hardick")!;
  return (
    <section className="phero page-top">
      <div className="hero-glow" aria-hidden />
      <div className="wrap hk">
        <Reveal className="phero-head">
          <div className="phero-badges">
            <StatusBadge p={p} />
            <span className="badge">{p.formats.join(" · ")}</span>
          </div>
          <h1 className="h1">{p.name}</h1>
          <p className="lead">{p.summary}</p>
          <div className="buybox">
            <PriceTag p={p} />
            <div className="hero-ctas">
              <AddToCart slug={p.slug} big />
              <BuyNow slug={p.slug} />
            </div>
            <p className="muted small">{p.platforms.join(" · ")} · 购买后邮件发送下载链接和序列号</p>
          </div>
        </Reveal>
        <Reveal delay={120} className="hk-media" aria-hidden>
          <div className="hk-plate">
            <span>{p.name}</span>
            <small className="mono">界面图整理中</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
