import Link from "next/link";
import { formatPrice, statusLabel, type Product } from "@/lib/products";

export function StatusBadge({ p }: { p: Product }) {
  const cls = p.status === "free" ? "badge-free" : p.status === "in-development" ? "badge-dev" : "badge-sale";
  return <span className={`badge ${cls}`}>{statusLabel[p.status]}</span>;
}

export function PriceTag({ p }: { p: Product }) {
  if (p.status === "free") return <span className="price">免费</span>;
  if (p.price === null) return <span className="price muted">即将推出</span>;
  return (
    <span className="price">
      {formatPrice(p.price)}
      {p.compareAt ? <s className="muted">{formatPrice(p.compareAt)}</s> : null}
    </span>
  );
}

export default function ProductCard({ p, large = false }: { p: Product; large?: boolean }) {
  return (
    <Link href={`/plugins/${p.slug}`} className={`pcard${large ? " pcard-lg" : ""}`}>
      <div className={`pcard-media pcard-media-${p.slug}`}>
        {p.image ? (
          <img src={p.image} alt={p.imageAlt} loading="lazy" />
        ) : (
          <div className="pcard-placeholder" aria-hidden>
            <span>{p.name}</span>
          </div>
        )}
      </div>
      <div className="pcard-body">
        <div className="pcard-row">
          <StatusBadge p={p} />
          <span className="pcard-fmt mono">{p.formats.join(" · ")}</span>
        </div>
        <h3 className="h3">{p.name}</h3>
        <p className="muted">{p.short}</p>
        <div className="pcard-row pcard-foot">
          <PriceTag p={p} />
          <span className="pcard-more">
            查看详情 <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
