import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import AudioAB from "@/components/AudioAB";
import VideoCard from "@/components/VideoCard";
import { AddToCart, BuyNow } from "@/components/Buy";
import { PriceTag, StatusBadge } from "@/components/ProductCard";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "HARDICK",
  description: "让 808 站起来。挂在 808、Kick 或鼓组总线上的一旋钮管子饱和，峰值守在 −1 dBFS。",
};

// Copy and figures from the HARDICK handoff (product.json, HARDICK_商品页文案.md).
// Only numbers listed there under specs / measured_claims are used.

const TRACKS = [
  { label: "原声", sub: "DRY", src: "/media/hardick/1_dry.mp3" },
  { label: "HARDICK 50%", sub: "常用", src: "/media/hardick/2_hardick_50.mp3" },
  { label: "HARDICK 100%", sub: "最大", src: "/media/hardick/3_hardick_max.mp3" },
];

const KNOBS = [
  ["HARDICK", "一个旋钮推动整套饱和。默认 0%，基本就是原声；越大越暖、越厚、越响。往右拧，躺着那位会有反应。"],
  ["MIX", "干湿比，默认 100%，拉到 0 就是原声。干声和湿声相位对齐，任何比例都不会有梳状滤波。"],
  ["OUT", "输出音量，±12 dB，默认 0 dB。"],
];

const CHAIN = [
  ["驱动", "旋钮越大推得越狠，最多 +12 dB"],
  ["管子饱和", "不对称曲线，以二次谐波为主：暖、圆，小喇叭上也有存在感"],
  ["硬拐点削波", "−1 dBFS 天花板，响度的来源"],
  ["4 倍过采样", "削得再狠也不带刺耳的数码毛刺"],
  ["去直流 + 天花板", "清掉不对称饱和留下的直流，峰值不过 −1 dBFS"],
];

const SPECS = [
  ["格式", "VST3、AU（macOS）· VST3（Windows）"],
  ["系统", "macOS 11+（Intel / Apple 芯片）· Windows 10 / 11 64 位"],
  ["声道", "单声道 / 立体声"],
  ["过采样", "4 倍"],
  ["延迟", "61 个采样点，44.1 kHz 约 1.4 ms，自动报告给宿主"],
  ["输出上限", "处理后 −1 dBFS（OUT 增益在其后）"],
  ["参数", "3 个，全部可自动化"],
  ["界面", "1000 × 560，可缩放 75%–150%"],
  ["版本", "1.0.0"],
];

const FAQ = [
  ["挂在哪？", "808 单轨、Kick、鼓组总线最合适；任何想推得更暖更响的轨道都可以。"],
  [
    "会把 808 削成方波吗？",
    "饱和以二次谐波为主，三次谐波明显更低（实测 50%：二次 −24 dB，三次 −38 dB）。拉满会很响，这是故意的。",
  ],
  ["峰值会爆吗？", "处理后的峰值不超过 −1 dBFS；OUT 往上加的增益不受这个限制。"],
  ["一份授权能装几台？", "购买者本人使用的最多两台电脑，不得转售或再分发。处理出来的音频归你。"],
  ["支持 Pro Tools（AAX）吗？", "1.0 暂不支持。"],
];

export default function Hardick() {
  const p = getProduct("hardick")!;
  return (
    <div className="hk-page">
      <section className="phero page-top">
        <div className="hero-glow hk-glow" aria-hidden />
        <div className="wrap hk">
          <Reveal className="phero-head">
            <div className="phero-badges">
              <StatusBadge p={p} />
              <span className="badge">{p.formats.join(" · ")}</span>
            </div>
            <h1 className="h1 hk-title">
              <img src="/media/hardick/wordmark-light.png" alt="HARDICK" width={1289} height={219} />
            </h1>
            <p className="hk-tag">让 808 站起来。</p>
            <p className="lead">{p.summary}</p>
            <div className="buybox">
              <PriceTag p={p} />
              <div className="hero-ctas">
                <AddToCart slug={p.slug} big />
                <BuyNow slug={p.slug} />
              </div>
              <p className="muted small">macOS · Windows · 付款后邮件发送下载链接</p>
            </div>
          </Reveal>
          <Reveal delay={120} className="hk-device">
            <video
              src="/media/hardick/ui-anim.mp4"
              poster="/media/hardick/ui-050-1000.webp"
              autoPlay
              muted
              loop
              playsInline
              aria-label="HARDICK 插件界面，旋钮从 0 拧到 100%"
            />
          </Reveal>
        </div>
      </section>

      <section className="section hk-knobs-sec">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">三个旋钮</span>
            <h2 className="h2">一个负责狠，两个负责收。</h2>
          </Reveal>
          <div className="hk-knobs">
            {KNOBS.map(([k, d], i) => (
              <Reveal key={k} delay={i * 80} className="hk-knob">
                <span className="mono">{k}</span>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="hk-states">
            {[
              ["000", "0%"],
              ["050", "50%"],
              ["100", "100%"],
            ].map(([f, l]) => (
              <figure key={f}>
                <img src={`/media/hardick/ui-${f}-1000.webp`} alt={`HARDICK 旋钮在 ${l}`} loading="lazy" />
                <figcaption className="mono">HARDICK {l}</figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section listen">
        <div className="wrap listen-grid">
          <Reveal className="listen-copy">
            <span className="eyebrow">试听</span>
            <h2 className="h2">原声，50%，拉满。</h2>
            <p className="lead">
              同一段 beat，三个版本同步播放，点哪个听哪个。没有做音量补偿，响度差就是真实的差别。
            </p>
          </Reveal>
          <Reveal delay={120}>
            <AudioAB tracks={TRACKS} note="Beat：D4nN9《Cm 叉烧包 136 beat》，经真实插件渲染。" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap split hk-split">
          <Reveal className="specs">
            <span className="eyebrow">一个旋钮背后</span>
            <h2 className="h2">五步，一个性格</h2>
            <ol className="chain">
              {CHAIN.map(([a, b], i) => (
                <li key={a}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <strong>{a}</strong>
                  <em>{b}</em>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={120}>
            <VideoCard src="/media/hardick/promo-9x16.mp4" poster="/media/hardick/promo-poster.jpg" label="HARDICK · 产品短片" />
          </Reveal>
        </div>
      </section>

      <section className="section dl-sec" id="buy">
        <div className="wrap hk-buy">
          <Reveal className="specs">
            <span className="eyebrow">规格</span>
            <dl>
              {SPECS.map(([a, b]) => (
                <div key={a}>
                  <dt>{a}</dt>
                  <dd>{b}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={100} className="hk-buycard">
            <img src="/media/hardick/ui-100-1000.webp" alt="" aria-hidden loading="lazy" />
            <div className="hk-buycard-body">
              <h2 className="h3">HARDICK 1.0</h2>
              <PriceTag p={p} />
              <AddToCart slug={p.slug} big />
              <p className="muted small">
                安装包暂无开发者签名。Mac 第一次打开时右键安装包 → 打开；Windows 出现 SmartScreen 时点 更多信息 → 仍要运行。装好后在 DAW 里重新扫描，路径 D4nN9 → HARDICK。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap narrow">
          <Reveal className="section-head">
            <span className="eyebrow">常见问题</span>
          </Reveal>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <div className="faq-a">
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </div>
          <p className="upsell">
            更多安装问题看{" "}
            <Link href="/support" className="link">
              帮助
            </Link>
            。
          </p>
        </div>
      </section>
    </div>
  );
}
