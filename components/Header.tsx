"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { useCart } from "./cart";

export default function Header() {
  const path = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={`hdr${scrolled ? " hdr-solid" : ""}${open ? " hdr-open" : ""}`}>
      <div className="wrap hdr-row">
        <Link href="/" className="hdr-logo" aria-label={`${site.brand} 首页`}>
          <span className="hdr-mark" aria-hidden />
          {site.brand}
        </Link>

        <nav className="hdr-nav" aria-label="主导航">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={path === n.href ? "is-active" : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hdr-actions">
          <Link href="/cart" className="hdr-cart" aria-label={`购物车，${count} 件`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 4h2.2l2.1 11.2a1.5 1.5 0 0 0 1.5 1.2h8.9a1.5 1.5 0 0 0 1.5-1.1L21 8H6.1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="20" r="1.3" fill="currentColor" />
              <circle cx="17.5" cy="20" r="1.3" fill="currentColor" />
            </svg>
            {ready && count > 0 && <span className="hdr-count">{count}</span>}
          </Link>
          <button
            className="hdr-burger"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="hdr-sheet" aria-hidden={!open}>
        <div className="wrap">
          {nav.map((n, i) => (
            <Link key={n.href} href={n.href} style={{ transitionDelay: `${open ? 60 + i * 40 : 0}ms` }}>
              {n.label}
            </Link>
          ))}
          <Link href="/cart" style={{ transitionDelay: `${open ? 60 + nav.length * 40 : 0}ms` }}>
            购物车{count > 0 ? ` (${count})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
