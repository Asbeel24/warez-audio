import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "全部插件" };

export default function Plugins() {
  return (
    <section className="section page-top">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">插件</span>
          <h1 className="h1">全部插件</h1>
          <p className="lead">全部支持 macOS 和 Windows，VST3 与 AU 格式。</p>
        </Reveal>
        <div className="pgrid pgrid-even">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
