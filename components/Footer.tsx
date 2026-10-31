import Link from "next/link";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = site.socials.filter((s) => s.href);
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-top">
          <div className="ftr-brand">
            <div className="ftr-logo">{site.brand}</div>
            <p className="muted">{site.tagline}</p>
          </div>
          <div className="ftr-cols">
            <div>
              <h4>插件</h4>
              {products.map((p) => (
                <Link key={p.slug} href={`/plugins/${p.slug}`}>
                  {p.name}
                </Link>
              ))}
            </div>
            <div>
              <h4>支持</h4>
              <Link href="/support">安装与常见问题</Link>
              <Link href="/support#license">授权与激活</Link>
              <Link href="/support#refund">退款</Link>
              {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
            </div>
            {socials.length > 0 && (
              <div>
                <h4>关注</h4>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <hr className="hairline" />
        <div className="ftr-bottom">
          <span>
            © {year} {site.brand}
          </span>
          <span className="mono">Designed by {site.authors.join(" & ")}</span>
        </div>
      </div>
    </footer>
  );
}
