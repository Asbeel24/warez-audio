import Link from "next/link";
import SpikePanel from "@/components/SpikePanel";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import AudioAB from "@/components/AudioAB";
import VideoCard from "@/components/VideoCard";
import { products } from "@/lib/products";
import { site } from "@/lib/site";
import { MODES, UDG_TRACKS } from "@/lib/content";

export default function Home() {
  const [spike, ...rest] = products;
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" aria-hidden />
        <div className="wrap hero-inner">
          <Reveal>
            <span className="eyebrow">VST3 · AU · macOS / Windows</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="h1 hero-title">
              脏，压得狠，
              <br />
              <span className="hero-title-dim">但依然清楚。</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lead">
              给自录自混的说唱制作者做的插件。挂上就出声音，不用研究参数。
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="hero-ctas">
              <Link href="/plugins/udg#download" className="btn btn-primary">
                免费下载 UDG <span className="arrow">→</span>
              </Link>
              <Link href="/plugins/spike-mix-hub" className="btn">
                了解 SPIKE MIX HUB
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={320} className="wrap hero-stage">
          <div className="stage">
            <SpikePanel />
          </div>
          <p className="stage-hint mono">
            <span>拖动旋钮</span>
            <span>切换 VOCAL / DRUM / MASTER</span>
            <span>点 BYPASS</span>
          </p>
        </Reveal>
      </section>

      {/* PLUGINS */}
      <section className="section" id="plugins">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">插件</span>
            <h2 className="h2">三款插件，一种声音性格</h2>
          </Reveal>
          <div className="pgrid">
            <Reveal className="pgrid-lg">
              <ProductCard p={spike} large />
            </Reveal>
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i + 1) * 90}>
                <ProductCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MODES */}
      <section className="section modes-sec">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">SPIKE MIX HUB · 开发中</span>
            <h2 className="h2">
              一个插件，
              <br />
              挂在三个位置。
            </h2>
            <p className="lead">
              选模式、挑一个最接近的预设，再微调两三个旋钮。每个模式的出厂默认值就是推荐的声音。
            </p>
          </Reveal>
          <div className="modes">
            {MODES.map((m, i) => (
              <Reveal key={m.name} delay={i * 90} as="article" className="mode">
                <div className="mode-top">
                  <span className="mode-idx mono">0{i + 1}</span>
                  <span className="mode-where mono">{m.where}</span>
                </div>
                <h3 className="mode-name">{m.name}</h3>
                <p className="muted">{m.blurb}</p>
                <ul className="chips">
                  {m.knobs.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal className="modes-more">
            <Link href="/plugins/spike-mix-hub" className="btn">
              查看 SPIKE MIX HUB <span className="arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* LISTEN */}
      <section className="section listen">
        <div className="wrap listen-grid">
          <Reveal className="listen-copy">
            <span className="eyebrow">试听 · UDG</span>
            <h2 className="h2">一个旋钮，听得出来。</h2>
            <p className="lead">
              同一段伴奏，原声和 UDG 两档实时切换，音量没有做补偿。戴耳机听更明显。
            </p>
            <Link href="/plugins/udg" className="btn">
              了解 UDG <span className="arrow">→</span>
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <AudioAB tracks={UDG_TRACKS} />
          </Reveal>
        </div>
      </section>

      {/* FILMS */}
      <section className="section films-sec">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">影片</span>
            <h2 className="h2">听它在真实的歌里工作</h2>
            <p className="lead">画面和声音都来自插件本身的实时处理。</p>
          </Reveal>
          <div className="films">
            <Reveal>
              <VideoCard
                wide
                src="/media/spike/screen-master.mp4"
                poster="/media/spike/screen-master-poster.jpg"
                label="SPIKE MIX HUB · MASTER 模式，整首歌实时处理"
              />
            </Reveal>
            <Reveal delay={120}>
              <VideoCard src="/media/udg/promo-9x16.mp4" poster="/media/udg/promo-poster.jpg" label="UDG · 产品短片" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CREDITS */}
      <section className="section credits">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">关于</span>
          </Reveal>
          <Reveal delay={80}>
            <p className="credits-line">
              由 <strong>{site.authors[0]}</strong> 和 <strong>{site.authors[1]}</strong> 设计制作。从自己的录音和混音出发，做我们自己想用的声音工具。
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="hero-ctas">
              <Link href="/plugins/udg#download" className="btn btn-primary">
                免费下载 UDG <span className="arrow">→</span>
              </Link>
              <Link href="/plugins" className="btn">
                全部插件
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
