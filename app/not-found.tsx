import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="wrap narrow empty">
        <span className="eyebrow">404</span>
        <h1 className="h2">这个页面不存在</h1>
        <Link href="/" className="btn">
          回到首页 <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
