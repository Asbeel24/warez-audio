"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A playable web copy of the SPIKE MIX HUB faceplate. Coordinates are the plugin's own
// (1348 x 662 logical units, art drawn at 2x), taken from Source/Venom/VenomEditor.h.

const W = 1348;
const H = 662;
const KNOB_X = [156, 308.5, 453.5, 598.5, 746, 892, 1039, 1185.5];
const KNOB_Y = 473;
const LABEL_Y = 540;
const SCREEN = { x: 294, y: 86.5, w: 759.5, h: 292 };
const MODE_KEYS = [
  { x: 515, y: 33, w: 99, h: 43 },
  { x: 625, y: 33, w: 98, h: 43 },
  { x: 734, y: 33, w: 98, h: 43 },
];
const WINDOWS = [
  { x: 1085, y: 119, w: 135, h: 64 },
  { x: 1094, y: 212, w: 140, h: 62 },
  { x: 1078, y: 300, w: 128, h: 62 },
];
const BYPASS = { x: 1035, y: 65, r: 21 };
const SWEEP = 270;

type Switch = { label: string; options: string[]; index: number };
type Mode = {
  name: "VOCAL" | "DRUM" | "MASTER";
  knobs: { label: string; value: number }[];
  switches: [Switch, Switch];
  presets: string[];
};

const PRESETS = {
  VOCAL: ["INIT", "FRONT ROW", "CYPHER RAW", "BLOWN OUT", "SMOOTH", "HARD TUNE", "LIGHT TUNE", "AD-LIB", "DOUBLES", "JET ROOM"],
  DRUM: ["INIT", "BOOM BAP", "TRAP 808", "DRILL SLIDE", "SMACK", "DUSTY LOOP", "TIGHT & DRY", "BIG ROOM", "UNDERGROUND", "PARALLEL 50"],
  MASTER: ["INIT", "CLEAN LOUD", "CYPHER GLUE", "WIDE OPEN", "TAPE DIRT", "VOCAL POCKET", "HARD WALL", "GENTLE", "BEAT TAPE", "SMASH 50"],
};

const k = (label: string, value: number) => ({ label, value });
const initialModes = (): Mode[] => [
  {
    name: "VOCAL",
    knobs: [k("COMP", 0.55), k("PRESENCE", 0.45), k("AIR", 0.4), k("DISTORTION", 0.25), k("FLEXER", 0.2), k("SPACE", 0.22), k("TUNE", 0), k("MIX", 1)],
    switches: [
      { label: "KEY", options: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], index: 0 },
      { label: "SCALE", options: ["MAJOR", "MINOR", "CHROM"], index: 2 },
    ],
    presets: PRESETS.VOCAL,
  },
  {
    name: "DRUM",
    knobs: [k("GATE", 0.2), k("PUNCH", 0.5), k("COMP", 0.45), k("BOOM", 0.4), k("TIGHT", 0.3), k("DISTORTION", 0.25), k("SPACE", 0.15), k("MIX", 1)],
    switches: [
      { label: "NOTCH", options: ["120 HZ", "140 HZ", "180 HZ"], index: 1 },
      { label: "BOOM HZ", options: ["45 HZ", "55 HZ", "65 HZ"], index: 1 },
    ],
    presets: PRESETS.DRUM,
  },
  {
    name: "MASTER",
    knobs: [k("CLARITY", 0.4), k("COMP", 0.5), k("RESTORE", 0.35), k("WIDTH", 0.5), k("DISTORTION", 0.2), k("FLEXER", 0.15), k("MIX", 1)],
    switches: [
      { label: "CLIP", options: ["SOFT", "HARD", "COMP"], index: 0 },
      { label: "FLEXER", options: ["BOTH", "SERIES", "CHORUS", "FLANGE", "DOUBLE"], index: 0 },
    ],
    presets: PRESETS.MASTER,
  },
];

const pct = (v: number) => `${Math.round(v * 100)}%`;
const angleOf = (v: number) => -135 + SWEEP * v;

export default function SpikePanel({ initialMode = 0, className = "" }: { initialMode?: number; className?: string }) {
  const [modes, setModes] = useState<Mode[]>(initialModes);
  const [mode, setMode] = useState(initialMode);
  const [presetIdx, setPresetIdx] = useState([0, 0, 0]);
  const [bypass, setBypass] = useState(false);
  const [readout, setReadout] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ modes, mode, bypass, readout, kick: 0 });
  const readoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const m = modes[mode];
  stateRef.current.modes = modes;
  stateRef.current.mode = mode;
  stateRef.current.bypass = bypass;
  stateRef.current.readout = readout;

  const showReadout = useCallback((text: string) => {
    setReadout(text);
    if (readoutTimer.current) clearTimeout(readoutTimer.current);
    readoutTimer.current = setTimeout(() => setReadout(null), 1100);
  }, []);

  const setKnob = useCallback(
    (i: number, v: number) => {
      const value = Math.min(1, Math.max(0, v));
      setModes((ms) => {
        const next = ms.slice();
        const mm = { ...next[mode], knobs: next[mode].knobs.slice() };
        mm.knobs[i] = { ...mm.knobs[i], value };
        next[mode] = mm;
        return next;
      });
      showReadout(`${modes[mode].knobs[i].label} ${pct(value)}`);
    },
    [mode, modes, showReadout]
  );

  const cycleSwitch = (s: 0 | 1, dir: number) => {
    setModes((ms) => {
      const next = ms.slice();
      const mm = { ...next[mode], switches: [...next[mode].switches] as [Switch, Switch] };
      const sw = { ...mm.switches[s] };
      sw.index = (sw.index + dir + sw.options.length) % sw.options.length;
      mm.switches[s] = sw;
      next[mode] = mm;
      return next;
    });
    stateRef.current.kick = 1;
  };

  const cyclePreset = (dir: number) => {
    setPresetIdx((p) => {
      const n = p.slice();
      n[mode] = (n[mode] + dir + 10) % 10;
      return n;
    });
    // nudge the knobs so a preset change is visible
    setModes((ms) => {
      const next = ms.slice();
      const seed = (presetIdx[mode] + dir + 10) % 10;
      const base = initialModes()[mode];
      next[mode] = {
        ...next[mode],
        knobs: base.knobs.map((kn, i) =>
          kn.label === "MIX" || seed === 0
            ? kn
            : { ...kn, value: Math.min(1, Math.max(0, kn.value + Math.sin(seed * 2.1 + i * 1.7) * 0.28)) }
        ),
      };
      return next;
    });
    stateRef.current.kick = 1;
  };

  // --- knob dragging -------------------------------------------------------
  const drag = useRef<{ i: number; y: number; v: number } | null>(null);
  const onKnobDown = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { i, y: e.clientY, v: m.knobs[i].value };
  };
  const onKnobMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !svgRef.current) return;
    const scale = svgRef.current.getBoundingClientRect().height / H;
    setKnob(d.i, d.v + (d.y - e.clientY) / (180 * scale));
  };
  const onKnobUp = () => (drag.current = null);
  const onKnobWheel = (i: number) => (e: React.WheelEvent) => {
    setKnob(i, m.knobs[i].value - Math.sign(e.deltaY) * 0.03);
  };
  const onKnobKey = (i: number) => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") setKnob(i, m.knobs[i].value + step);
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") setKnob(i, m.knobs[i].value - step);
    else return;
    e.preventDefault();
  };

  // knob wheel needs a non-passive listener to stop page scroll
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const stop = (e: WheelEvent) => {
      if ((e.target as Element).closest?.("[data-knob]")) e.preventDefault();
    };
    svg.addEventListener("wheel", stop, { passive: false });
    return () => svg.removeEventListener("wheel", stop);
  }, []);

  // --- CRT screen ----------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = true;
    const t0 = performance.now();
    let w = 0,
      h = 0,
      dpr = 1;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const BPM = 147;
    function frame(now: number) {
      raf = 0;
      const st = stateRef.current;
      const t = reduce ? 4.2 : (now - t0) / 1000;
      const u = w / SCREEN.w; // px per logical unit
      const mm = st.modes[st.mode];
      const kv = (name: string) => mm.knobs.find((x) => x.label === name)?.value ?? 0;

      // beat envelope: kick on every beat, snare on 2 & 4
      const beat = (t * BPM) / 60;
      const ph = beat % 1;
      const bar = Math.floor(beat) % 4;
      const kick = Math.exp(-ph * 6);
      const snare = bar % 2 === 1 ? Math.exp(-ph * 9) : 0;
      st.kick *= 0.9;
      const comp = kv("COMP");
      const dist = kv("DISTORTION");
      const mix = kv("MIX");
      const energy = st.bypass ? 0.18 : (0.35 + 0.4 * comp + 0.25 * kick + 0.2 * snare + st.kick * 0.4) * (0.4 + 0.6 * mix);

      ctx!.fillStyle = "#010c03";
      ctx!.fillRect(0, 0, w, h);

      // glass bloom
      const g = ctx!.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, w * 0.6);
      g.addColorStop(0, "rgba(31,224,82,0.16)");
      g.addColorStop(1, "rgba(31,224,82,0)");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);

      // pixel field (the plugin's "codec" style sea)
      const cell = 7 * u;
      const fx0 = 26 * u,
        fx1 = w - 26 * u,
        fy0 = 62 * u,
        fy1 = h - 50 * u;
      const cols = Math.floor((fx1 - fx0) / cell);
      const rows = Math.floor((fy1 - fy0) / cell);
      const modeShift = st.mode * 1.7;
      const width = st.mode === 2 ? 0.6 + kv("WIDTH") * 0.8 : 1;
      for (let y = 0; y < rows; y++) {
        // distortion tears rows sideways on hits
        const tear = dist > 0.05 && Math.sin(y * 12.9 + Math.floor(t * 8) * 3.1) > 1 - dist * 0.25 ? (kick * 10 * dist) | 0 : 0;
        for (let x = 0; x < cols; x++) {
          const nx = (x - cols / 2) / (cols / 2) / width;
          const ny = (y - rows / 2) / (rows / 2);
          let v =
            Math.sin(nx * 3.1 + t * 0.9 + modeShift) +
            Math.sin(ny * 4.3 - t * 0.7 + nx * 1.3) +
            Math.sin((nx + ny) * 2.2 + t * 0.45) +
            Math.sin(Math.hypot(nx * 1.6, ny) * 6 - t * 2.4 - kick * 2);
          v = v / 4 + 0.5;
          v *= 0.55 + energy * 0.7;
          v -= Math.abs(ny) * 0.32 + Math.abs(nx) * 0.18;
          if (v < 0.42) continue;
          const lvl = Math.min(1, (v - 0.42) / 0.3);
          const s = cell * (lvl > 0.66 ? 0.86 : lvl > 0.33 ? 0.66 : 0.44);
          ctx!.fillStyle = lvl > 0.75 ? "rgba(166,255,180,0.95)" : `rgba(61,255,92,${0.35 + lvl * 0.5})`;
          const px = fx0 + (x + tear) * cell + (cell - s) / 2;
          if (px > fx1) continue;
          ctx!.fillRect(px, fy0 + y * cell + (cell - s) / 2, s, s);
        }
      }

      // text
      const font = (size: number) => `${size * u}px Pixeloid, monospace`;
      ctx!.textBaseline = "alphabetic";
      ctx!.shadowColor = "rgba(61,255,92,0.7)";
      ctx!.shadowBlur = 8 * u;
      ctx!.fillStyle = "#a6ffb4";
      ctx!.font = font(17);
      ctx!.textAlign = "left";
      ctx!.fillText("SPIKE MIX HUB V1.0", 58 * u, 44 * u);
      ctx!.font = font(10);
      ctx!.fillStyle = "rgba(166,255,180,0.8)";
      ctx!.fillText("Designed by D4nN9 & Yibing", 58 * u, 62 * u);
      ctx!.textAlign = "right";
      ctx!.font = font(13);
      ctx!.fillStyle = "#a6ffb4";
      ctx!.fillText(st.bypass ? "BYPASS" : mm.name, w - 70 * u, 44 * u);
      ctx!.font = font(10);
      const db = st.bypass ? "-INF dB" : `${(-1.4 - (1 - energy) * 6).toFixed(1)} dB`;
      ctx!.fillStyle = "rgba(166,255,180,0.8)";
      ctx!.fillText(db, w - 70 * u, 62 * u);
      ctx!.textAlign = "center";
      ctx!.font = font(10);
      ctx!.fillText(st.readout ?? "STEREO PROC", w / 2, h - 22 * u);
      ctx!.shadowBlur = 0;

      // scanlines + vignette
      ctx!.fillStyle = "rgba(0,0,0,0.28)";
      for (let y = 0; y < h; y += 3 * dpr) ctx!.fillRect(0, y, w, dpr);
      const vg = ctx!.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.62);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx!.fillStyle = vg;
      ctx!.fillRect(0, 0, w, h);

      if (visible) {
        if (reduce) timer = setTimeout(() => (raf = requestAnimationFrame(frame)), 250);
        else raf = requestAnimationFrame(frame);
      }
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const S = (n: number, of: number) => `${(n / of) * 100}%`;

  return (
    <div className={`spike ${className}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <img className="spike-plate" src="/media/spike/panel.webp" alt="SPIKE MIX HUB 插件面板" draggable={false} />
      <canvas
        ref={canvasRef}
        className="spike-screen"
        style={{
          left: S(SCREEN.x, W),
          top: S(SCREEN.y, H),
          width: S(SCREEN.w, W),
          height: S(SCREEN.h, H),
          opacity: bypass ? 0.55 : 1,
        }}
        aria-hidden
      />
      <svg
        ref={svgRef}
        className="spike-ui"
        viewBox={`0 0 ${W} ${H}`}
        onPointerMove={onKnobMove}
        onPointerUp={onKnobUp}
        onPointerCancel={onKnobUp}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="halo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <linearGradient id="pill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9dffae" />
            <stop offset="0.5" stopColor="#3dff5c" />
            <stop offset="1" stopColor="#1a9e36" />
          </linearGradient>
          <radialGradient id="lens">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.3" stopColor="#b4ffc2" />
            <stop offset="1" stopColor="#1fe052" />
          </radialGradient>
          <linearGradient id="matte" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2b2e" />
            <stop offset="1" stopColor="#060607" />
          </linearGradient>
        </defs>

        {/* mode keys */}
        {MODE_KEYS.map((r, i) => {
          const on = i === mode;
          const inset = 5;
          return (
            <g
              key={i}
              className="spike-hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${modes[i].name} 模式`}
              onClick={() => {
                setMode(i);
                stateRef.current.kick = 1;
              }}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setMode(i))}
            >
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="transparent" />
              {on && (
                <>
                  <rect
                    x={r.x + inset}
                    y={r.y + inset}
                    width={r.w - inset * 2}
                    height={r.h - inset * 2}
                    rx={(r.h - inset * 2) / 2}
                    fill="#3dff5c"
                    opacity="0.55"
                    filter="url(#halo)"
                  />
                  <rect
                    x={r.x + inset}
                    y={r.y + inset}
                    width={r.w - inset * 2}
                    height={r.h - inset * 2}
                    rx={(r.h - inset * 2) / 2}
                    fill="url(#pill)"
                  />
                  <rect
                    x={r.x + inset + 8}
                    y={r.y + inset + 3}
                    width={r.w - inset * 2 - 16}
                    height={6}
                    rx={3}
                    fill="#fff"
                    opacity="0.25"
                  />
                </>
              )}
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2 + 5}
                textAnchor="middle"
                className="spike-key"
                fill={on ? "#fff" : "#99c5a5"}
              >
                {modes[i].name}
              </text>
            </g>
          );
        })}

        {/* bypass lamp */}
        <g
          className="spike-hit"
          role="switch"
          tabIndex={0}
          aria-checked={!bypass}
          aria-label="BYPASS，灯亮表示效果开启"
          onClick={() => setBypass((b) => !b)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setBypass((b) => !b))}
        >
          <rect x={1008} y={40} width={130} height={50} fill="transparent" />
          {!bypass && (
            <>
              <circle cx={BYPASS.x} cy={BYPASS.y} r={BYPASS.r * 1.6} fill="#3dff5c" opacity="0.45" filter="url(#halo)" />
              <circle cx={BYPASS.x} cy={BYPASS.y} r={BYPASS.r * 0.82} fill="url(#lens)" />
            </>
          )}
        </g>

        {/* right-hand windows */}
        {WINDOWS.map((r, wi) => {
          const heading = wi === 0 ? "PRESET" : m.switches[wi - 1].label;
          const value =
            wi === 0
              ? `${String(presetIdx[mode] + 1).padStart(2, "0")} ${m.presets[presetIdx[mode]]}`
              : m.switches[wi - 1].options[m.switches[wi - 1].index];
          const go = (dir: number) => (wi === 0 ? cyclePreset(dir) : cycleSwitch((wi - 1) as 0 | 1, dir));
          return (
            <g key={wi} filter="url(#glow)">
              <text x={r.x + r.w / 2} y={r.y + r.h * 0.34} textAnchor="middle" className="spike-win-h">
                {heading}
              </text>
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h * 0.74}
                textAnchor="middle"
                className="spike-win-v"
                style={{ fontSize: value.length > 9 ? 15 : 20 }}
              >
                {value}
              </text>
              <text x={r.x + 12} y={r.y + r.h * 0.74} className="spike-win-a">
                {"<"}
              </text>
              <text x={r.x + r.w - 12} y={r.y + r.h * 0.74} textAnchor="end" className="spike-win-a">
                {">"}
              </text>
              <rect
                x={r.x}
                y={r.y}
                width={r.w / 2}
                height={r.h}
                fill="transparent"
                className="spike-hit"
                role="button"
                aria-label={`${heading} 上一个`}
                onClick={() => go(-1)}
              />
              <rect
                x={r.x + r.w / 2}
                y={r.y}
                width={r.w / 2}
                height={r.h}
                fill="transparent"
                className="spike-hit"
                role="button"
                aria-label={`${heading} 下一个`}
                onClick={() => go(1)}
              />
            </g>
          );
        })}

        {/* knobs */}
        {KNOB_X.map((x, i) => {
          const knob = m.knobs[i];
          if (!knob) {
            return (
              <g key={i}>
                <circle cx={x} cy={KNOB_Y} r={35} fill="url(#matte)" />
                <circle cx={x} cy={KNOB_Y} r={35} fill="none" stroke="#fff" strokeOpacity="0.08" />
                <circle cx={x} cy={KNOB_Y} r={2.5} fill="#3dff5c" opacity="0.25" />
              </g>
            );
          }
          const a = angleOf(knob.value);
          return (
            <g key={i}>
              <g
                data-knob
                className="spike-knob"
                role="slider"
                tabIndex={0}
                aria-label={knob.label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(knob.value * 100)}
                onPointerDown={onKnobDown(i)}
                onWheel={onKnobWheel(i)}
                onKeyDown={onKnobKey(i)}
                onDoubleClick={() => setKnob(i, initialModes()[mode].knobs[i].value)}
              >
                <circle cx={x} cy={KNOB_Y} r={56} fill="transparent" />
                <g transform={`rotate(${a} ${x} ${KNOB_Y})`}>
                  <line
                    x1={x}
                    y1={KNOB_Y - 5}
                    x2={x}
                    y2={KNOB_Y - 30}
                    stroke="#3dff5c"
                    strokeWidth="9"
                    strokeLinecap="round"
                    opacity="0.12"
                  />
                  <line
                    x1={x}
                    y1={KNOB_Y - 6}
                    x2={x}
                    y2={KNOB_Y - 30}
                    stroke="#3dff5c"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  <line
                    x1={x}
                    y1={KNOB_Y - 9}
                    x2={x}
                    y2={KNOB_Y - 27}
                    stroke="#fff"
                    strokeOpacity="0.55"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </g>
              </g>
              <text x={x} y={LABEL_Y + 6} textAnchor="middle" className="spike-label" filter="url(#glow)">
                {knob.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
