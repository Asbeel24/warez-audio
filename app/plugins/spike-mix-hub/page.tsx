import type { Metadata } from "next";
import Link from "next/link";
import SpikePanel from "@/components/SpikePanel";
import Reveal from "@/components/Reveal";
import VideoCard from "@/components/VideoCard";
import { WaitlistForm } from "@/components/Buy";
import { StatusBadge } from "@/components/ProductCard";
import { getProduct } from "@/lib/products";
import { MODES, PRESETS } from "@/lib/content";

export const metadata: Metadata = {
  title: "SPIKE MIX HUB",
  description: "UDG 的 Pro 版：VOCAL、DRUM、MASTER 三个模式，30 个出厂预设。开发中。",
};

export default function Spike() {
  const p = getProduct("spike-mix-hub")!;
  return (
    <>
      <section className="phero page-top">
        <div className="hero-glow" aria-hidden />
        <div className="wrap">
          <Reveal className="phero-head">
            <div className="phero-badges">
              <StatusBadge p={p} />
              <span className="badge">UDG PRO</span>
            </div>
            <h1 className="h1">SPIKE MIX HUB</h1>
            <p className="lead">{p.summary}</p>
          </Reveal>
          <Reveal delay={120} className="stage stage-flat">
            <SpikePanel />
          </Reveal>
          <Reveal delay={200} className="phero-cta">
            <div>
              <h2 className="h3">上线提醒</h2>
              <p className="muted">留下邮箱，开卖第一时间通知你。</p>
            </div>
            <WaitlistForm product="spike-mix-hub" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">三个模式</span>
            <h2 className="h2">每个模式都是一条完整的链路</h2>
            <p className="lead">
              进来的声音先过一层固定的模拟染色：磁带感加一点压缩，把中频往前推。这是 SPIKE MIX HUB 自己的声音性格，三个模式共用。
            </p>
          </Reveal>
          {MODES.map((m, i) => (
            <Reveal key={m.name} as="article" className="mdetail">
              <div className="mdetail-side">
                <span className="mode-idx mono">0{i + 1}</span>
                <h3 className="mode-name">{m.name}</h3>
                <p className="mono muted mdetail-where">{m.where}</p>
                <p className="muted">{m.blurb}</p>
                <p className="mono mdetail-sw">
                  小开关 · {m.switches.join(" / ")}
                </p>
              </div>
              <dl className="kgrid">
                {m.detail.map(([k, d]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{d}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section presets-sec">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">预设</span>
            <h2 className="h2">31 个出厂预设</h2>
            <p className="lead">
              每个模式 10 个，MASTER 多一个 “UDG”：选上它，面板只剩两个旋钮，就是原来的免费版 UDG。
            </p>
          </Reveal>
          <div className="presets">
            {Object.entries(PRESETS).map(([mode, list], i) => (
              <Reveal key={mode} delay={i * 80} className="preset-col">
                <h3 className="mono">{mode}</h3>
                <ol>
                  {list.map((n, j) => (
                    <li key={n} className={n === "UDG" ? "is-udg" : undefined}>
                      <span className="mono">{String(j + 1).padStart(2, "0")}</span>
                      {n}
                    </li>
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split split-wide">
          <Reveal>
            <VideoCard
              wide
              src="/media/spike/screen-master.mp4"
              poster="/media/spike/screen-master-poster.jpg"
              label="MASTER 模式 · 整首歌实时处理"
            />
          </Reveal>
          <Reveal delay={120} className="specs">
            <span className="eyebrow">规格</span>
            <dl>
              <div>
                <dt>格式</dt>
                <dd>{p.formats.join(" · ")}</dd>
              </div>
              <div>
                <dt>系统</dt>
                <dd>{p.platforms.join(" · ")}</dd>
              </div>
              <div>
                <dt>模式</dt>
                <dd>VOCAL · DRUM · MASTER</dd>
              </div>
              <div>
                <dt>输出上限</dt>
                <dd>约 -0.3 dB，不会爆表</dd>
              </div>
              <div>
                <dt>延迟</dt>
                <dd>约 17 毫秒（VOCAL 调音需要）</dd>
              </div>
              <div>
                <dt>界面</dt>
                <dd>可缩放，双击旋钮回到默认值</dd>
              </div>
              <div>
                <dt>作者</dt>
                <dd>D4nN9 · Yibing He</dd>
              </div>
            </dl>
            <Link href="/support" className="btn btn-sm">
              安装与常见问题 <span className="arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
