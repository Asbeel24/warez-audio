"use client";

import { useEffect, useRef, useState } from "react";

// Muted autoplay loop while visible; one tap turns the sound on.
export default function VideoCard({
  src,
  poster,
  label,
  wide = false,
}: {
  src: string;
  poster: string;
  label: string;
  wide?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    // only one clip plays sound at a time
    document.querySelectorAll<HTMLVideoElement>("video[data-vc]").forEach((o) => {
      if (o !== v) o.muted = true;
    });
    v.muted = !v.muted;
    if (!v.muted) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    setMuted(v.muted);
  }

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const sync = () => setMuted(v.muted);
    v.addEventListener("volumechange", sync);
    return () => v.removeEventListener("volumechange", sync);
  }, []);

  return (
    <figure className={`vcard${wide ? " vcard-wide" : ""}`}>
      <video ref={ref} data-vc src={src} poster={poster} muted loop playsInline preload="metadata" />
      <button className="vcard-sound" onClick={toggle} aria-label={muted ? "打开声音" : "关闭声音"}>
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
            <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
            <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
        <span>{muted ? "听声音" : "静音"}</span>
      </button>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
