import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import AudioAB from "@/components/AudioAB";
import VideoCard from "@/components/VideoCard";
import { DownloadButtons } from "@/components/Buy";
import { StatusBadge } from "@/components/ProductCard";
import { getProduct } from "@/lib/products";
import { UDG_TRACKS } from "@/lib/content";

export const metadata: Metadata = {
  title: "UDG · 免费下载",
  description: "两个旋钮的说唱整轨效果器：脏、压得狠，但依然清楚。免费下载。",
};

const CHAIN = [
  ["磁带饱和", "谐波和一点脏感"],
  ["胶水压缩", "把整轨粘成一块"],
  ["三段上下行压缩", "OTT 式的狠压，响度的来源"],
  ["软削波", "冲上限也圆润，不刺耳"],
  ["立体声宽度", "低频保持单声道"],
  ["低频增强", "厚度"],
  ["空间", "短房间感，不是长混响"],
  ["镶边", "轻微的慢速流动，磁带质感"],
];

export default function Udg() {
  const p = getProduct("udg")!;
  return (
    <>
      <section className="phero page-top">
        <div className="hero-glow" aria-hidden />
        <div className="wrap udg-hero">
          <Reveal className="phero-head">
            <div className="phero-badges">
              <StatusBadge p={p} />
              <span className="badge">{p.formats.join(" · ")}</span>
            </div>
            <h1 className="h1">UDG</h1>
            <p className="lead">
              挂在整轨 beat 或总线上，一拧就是美国地下 cypher 那种声音：脏、压得狠，但依然清晰，保留立体声和空间感，带磁带质感。
            </p>
            <div className="knob2">
              <div>
                <span className="mono">UDG</span>
                <p>一个旋钮推动整套效果。默认 50%，越大越脏、越压、越亮。</p>
              </div>
              <div>
                <span className="mono">MIX</span>
                <p>干湿比，默认 100%，拉到 0 就是原声。</p>
              </div>
            </div>
            <div className="hero-ctas">
              <a href="#download" className="btn btn-primary">
                免费下载 <span className="arrow">↓</span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={120} className="udg-device">
            <video src="/media/udg/ui-anim.mp4" poster="/media/udg/ui.jpg" autoPlay muted loop playsInline />
          </Reveal>
        </div>
      </section>

      <section className="section listen">
        <div className="wrap listen-grid">
          <Reveal className="listen-copy">
            <span className="eyebrow">试听</span>
            <h2 className="h2">原声，50%，拉满。</h2>
            <p className="lead">三个版本同步播放，点哪个听哪个，没有做音量补偿。</p>
          </Reveal>
          <Reveal delay={120}>
            <AudioAB tracks={UDG_TRACKS} />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Reveal className="specs">
            <span className="eyebrow">一个旋钮背后</span>
            <h2 className="h2">八个处理，一个性格</h2>
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
            <VideoCard src="/media/udg/promo-9x16.mp4" poster="/media/udg/promo-poster.jpg" label="UDG · 产品短片" />
          </Reveal>
        </div>
      </section>

      <section className="section dl-sec" id="download">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">下载</span>
            <h2 className="h2">免费，直接下载</h2>
            <p className="lead">
              装好后在 DAW 里重新扫描插件。Mac 第一次打开如果提示“无法验证开发者”，看{" "}
              <Link href="/support#mac" className="link">
                这里的解决办法
              </Link>
              。
            </p>
          </Reveal>
          <Reveal delay={100}>
            <DownloadButtons slug="udg" />
          </Reveal>
          <Reveal delay={160}>
            <p className="upsell">
              想要人声、鼓组、总线分开处理？{" "}
              <Link href="/plugins/spike-mix-hub" className="link">
                SPIKE MIX HUB
              </Link>{" "}
              正在开发，里面也带着一个 UDG 预设。
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
