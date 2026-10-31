"use client";

import { useEffect, useRef, useState } from "react";

type Track = { label: string; sub: string; src: string };

// Sample-accurate A/B player: all versions play in lockstep, switching only moves the gain.
export default function AudioAB({ tracks, note }: { tracks: Track[]; note?: string }) {
  const [active, setActive] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const buffers = useRef<AudioBuffer[] | null>(null);
  const nodes = useRef<{ src: AudioBufferSourceNode; gain: GainNode }[]>([]);
  const startAt = useRef(0);
  const offset = useRef(0);
  const raf = useRef(0);
  const meterRef = useRef<HTMLCanvasElement>(null);
  const analyser = useRef<AnalyserNode | null>(null);

  const duration = () => buffers.current?.[0]?.duration ?? 1;

  async function ensure() {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AC();
      analyser.current = ctxRef.current.createAnalyser();
      analyser.current.fftSize = 2048;
      analyser.current.connect(ctxRef.current.destination);
    }
    if (!buffers.current) {
      setLoading(true);
      const ctx = ctxRef.current;
      buffers.current = await Promise.all(
        tracks.map(async (t) => ctx.decodeAudioData(await (await fetch(t.src)).arrayBuffer()))
      );
      setLoading(false);
    }
    return ctxRef.current;
  }

  function stopNodes() {
    nodes.current.forEach((n) => {
      try {
        n.src.onended = null;
        n.src.stop();
      } catch {}
      n.src.disconnect();
    });
    nodes.current = [];
  }

  async function play(from = offset.current) {
    const ctx = await ensure();
    await ctx.resume();
    stopNodes();
    const when = ctx.currentTime + 0.03;
    nodes.current = buffers.current!.map((buf, i) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = i === active ? 1 : 0;
      src.connect(gain).connect(analyser.current!);
      src.start(when, from % buf.duration);
      return { src, gain };
    });
    nodes.current[0].src.onended = () => {
      offset.current = 0;
      setPlaying(false);
      setProgress(0);
    };
    startAt.current = when - from;
    setPlaying(true);
  }

  function pause() {
    const ctx = ctxRef.current;
    if (ctx) offset.current = (ctx.currentTime - startAt.current) % duration();
    stopNodes();
    setPlaying(false);
  }

  function choose(i: number) {
    setActive(i);
    const ctx = ctxRef.current;
    if (!ctx) return;
    nodes.current.forEach((n, j) => {
      n.gain.gain.cancelScheduledValues(ctx.currentTime);
      n.gain.gain.setTargetAtTime(j === i ? 1 : 0, ctx.currentTime, 0.008);
    });
  }

  function seek(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    offset.current = f * duration();
    setProgress(f);
    if (playing) play(offset.current);
  }

  // progress + level meter
  useEffect(() => {
    const tick = () => {
      const ctx = ctxRef.current;
      if (ctx && playing) setProgress(((ctx.currentTime - startAt.current) % duration()) / duration());
      const cv = meterRef.current;
      if (cv && analyser.current) {
        const g = cv.getContext("2d")!;
        const w = (cv.width = cv.clientWidth * 2);
        const h = (cv.height = cv.clientHeight * 2);
        const data = new Uint8Array(analyser.current.frequencyBinCount);
        analyser.current.getByteFrequencyData(data);
        const bars = 48;
        const bw = w / bars;
        for (let i = 0; i < bars; i++) {
          // log-spaced bins
          const lo = Math.floor(Math.pow(data.length, i / bars));
          const hi = Math.max(lo + 1, Math.floor(Math.pow(data.length, (i + 1) / bars)));
          let v = 0;
          for (let j = lo; j < hi; j++) v = Math.max(v, data[j]);
          const bh = (v / 255) * h;
          g.fillStyle = `rgba(61,255,92,${0.25 + (v / 255) * 0.75})`;
          g.fillRect(i * bw + 1, h - bh, bw - 2, bh);
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  useEffect(() => () => {
    stopNodes();
    ctxRef.current?.close();
  }, []);

  return (
    <div className="ab">
      <div className="ab-top">
        <button
          className="ab-play"
          onClick={() => (playing ? pause() : play())}
          aria-label={playing ? "暂停" : "播放"}
          disabled={loading}
        >
          {loading ? (
            <span className="ab-spin" />
          ) : playing ? (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <rect x="3" y="2" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="11" y="2" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M4 2.5v13l11-6.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="ab-tabs" role="tablist" aria-label="对比版本">
          {tracks.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              aria-selected={i === active}
              className={i === active ? "is-on" : undefined}
              onClick={() => choose(i)}
            >
              <span>{t.label}</span>
              <small>{t.sub}</small>
            </button>
          ))}
        </div>
      </div>
      <canvas ref={meterRef} className="ab-meter" aria-hidden />
      <div className="ab-bar" onPointerDown={seek} role="presentation">
        <div style={{ transform: `scaleX(${progress})` }} />
      </div>
      {note && <p className="ab-note">{note}</p>}
    </div>
  );
}
