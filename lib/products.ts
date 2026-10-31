// The plugin catalogue. Everything the shop, cart and checkout know about a product lives here.

export type ProductStatus = "free" | "on-sale" | "in-development";

export type Product = {
  slug: string;
  name: string;
  short: string; // one line under the name
  summary: string; // a paragraph for cards and meta descriptions
  status: ProductStatus;
  price: number | null; // CNY; null = not for sale yet
  compareAt?: number | null; // optional original price for a launch discount
  formats: string[];
  platforms: string[];
  image: string;
  imageAlt: string;
  accent: string;
  // Free downloads. Empty string = installer not uploaded yet.
  downloads?: { mac: string; win: string };
  // True while the copy is a placeholder waiting for real material.
  draft?: boolean;
};

export const products: Product[] = [
  {
    slug: "spike-mix-hub",
    name: "SPIKE MIX HUB",
    short: "一个插件，三种模式：人声、鼓组、总线",
    summary:
      "UDG 的 Pro 版。VOCAL 把人声压紧推到前面，DRUM 让鼓和 808 更狠，MASTER 做响度、粘合和清晰度。每个模式 10 个出厂预设，选模式、挑预设、拧几下就出声音。",
    status: "in-development",
    price: null,
    formats: ["VST3", "AU"],
    platforms: ["macOS", "Windows"],
    image: "/media/spike/ui-vocal.webp",
    imageAlt: "SPIKE MIX HUB 插件界面",
    accent: "#3dff5c",
  },
  {
    slug: "hardick",
    name: "HARDICK",
    short: "产品介绍整理中",
    summary: "HARDICK 的介绍、界面图和试听正在整理，很快上线。",
    status: "on-sale",
    price: 199,
    formats: ["VST3", "AU"],
    platforms: ["macOS", "Windows"],
    image: "",
    imageAlt: "HARDICK",
    accent: "#e8e8e3",
    draft: true,
  },
  {
    slug: "udg",
    name: "UDG",
    short: "两个旋钮的说唱整轨效果器，免费",
    summary:
      "挂在整条伴奏或总线上，一个 UDG 旋钮推动磁带饱和、多段压缩、软削波、空间和镶边。脏、压得狠，但依然清楚。",
    status: "free",
    price: 0,
    formats: ["VST3", "AU"],
    platforms: ["macOS", "Windows"],
    image: "/media/udg/ui.jpg",
    imageAlt: "UDG 插件界面",
    accent: "#9dff6a",
    downloads: { mac: "", win: "" },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function isPurchasable(p: Product) {
  return p.status === "on-sale" && p.price !== null && p.price > 0;
}

export const statusLabel: Record<ProductStatus, string> = {
  free: "免费",
  "on-sale": "在售",
  "in-development": "开发中",
};

export function formatPrice(n: number) {
  return "¥" + n.toLocaleString("zh-CN");
}
