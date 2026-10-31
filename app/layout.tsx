import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import "./ui.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.brand} · 说唱混音插件`,
    template: `%s · ${site.brand}`,
  },
  description: `${site.tagline}。UDG 免费下载，SPIKE MIX HUB 开发中。`,
  openGraph: {
    title: `${site.brand} · 说唱混音插件`,
    description: site.tagline,
    images: ["/media/spike/panel-1348.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#070807",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
