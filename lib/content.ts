// Copy for the product pages, taken from the SPIKE MIX HUB manual and the UDG PRD.

export const MODES = [
  {
    name: "VOCAL",
    where: "人声轨",
    blurb: "把人声压得紧、往前站，脏但听得清。去浑、去齿音和切低频都是自动的。",
    knobs: ["COMP", "PRESENCE", "AIR", "DISTORTION", "FLEXER", "SPACE", "TUNE", "MIX"],
    switches: ["KEY", "SCALE"],
    detail: [
      ["COMP", "越大人声越紧、越稳、越贴脸；开大会有“全按下去”的猛压感，但呼吸声和底噪不会被一起抬起来。"],
      ["PRESENCE", "咬字往前推，让歌词更清楚；刺耳的时候会自动收一点。"],
      ["AIR", "高频空气感，让人声更亮、更“贵”。"],
      ["DISTORTION", "主要脏在中频，越大越破，音量不会跟着变大很多。"],
      ["FLEXER", "让人声变宽、变厚、会动：合唱、镶边、双轨叠录，五种类型随时切。"],
      ["SPACE", "小的时候是短房间和 slap；开大会在句子之间冒出跟着速度走的回声甩尾，唱的时候自动压低。"],
      ["TUNE", "调音速度。0 是关闭，100% 是硬吸附的说唱电音。"],
      ["MIX", "干湿比。"],
    ],
  },
  {
    name: "DRUM",
    where: "鼓组总线 · 含 808",
    blurb: "让鼓更狠、更有冲劲，808 在手机上也听得到。低频单独处理、保持居中。",
    knobs: ["GATE", "PUNCH", "COMP", "BOOM", "TIGHT", "DISTORTION", "SPACE", "MIX"],
    switches: ["NOTCH", "BOOM HZ"],
    detail: [
      ["GATE", "收掉鼓点之间的杂音和残响，越大鼓越干、越短，不会切到 808 的尾巴。"],
      ["PUNCH", "鼓点起音的冲击力，越大越“打脸”。"],
      ["COMP", "让鼓更粘、更饱满、更密；开大会有一层猛压垫在下面。"],
      ["BOOM", "加 808 的厚度，还会补谐波，让 808 在手机和小音箱上也听得到。"],
      ["TIGHT", "收短低频尾巴，让底鼓和 808 分开、不糊在一起。"],
      ["DISTORTION", "加脏度。"],
      ["SPACE", "鼓的房间感。"],
      ["MIX", "干湿比。"],
    ],
  },
  {
    name: "MASTER",
    where: "总线 · 整首伴奏",
    blurb: "做响度、粘合和清晰度，带出地下 cypher 那种又脏又压又清楚的感觉。最后有限制器兜底，不会爆。",
    knobs: ["CLARITY", "COMP", "RESTORE", "WIDTH", "DISTORTION", "FLEXER", "MIX"],
    switches: ["CLIP", "FLEXER"],
    detail: [
      ["CLARITY", "清晰度。让整首歌更透，给人声留出位置。"],
      ["COMP", "多段压缩加总线粘合，越大越密、越响、越“一整块”。"],
      ["RESTORE", "补回中高频，让声音更亮更清楚。"],
      ["WIDTH", "立体声宽度，低频永远保持居中，不会散。"],
      ["DISTORTION", "比另外两个模式温和，加一点磁带脏感。"],
      ["FLEXER", "让整体轻微地宽和动起来。"],
      ["MIX", "干湿比。"],
    ],
  },
] as const;

export const PRESETS: Record<string, string[]> = {
  VOCAL: ["INIT", "FRONT ROW", "CYPHER RAW", "BLOWN OUT", "SMOOTH", "HARD TUNE", "LIGHT TUNE", "AD-LIB", "DOUBLES", "JET ROOM"],
  DRUM: ["INIT", "BOOM BAP", "TRAP 808", "DRILL SLIDE", "SMACK", "DUSTY LOOP", "TIGHT & DRY", "BIG ROOM", "UNDERGROUND", "PARALLEL 50"],
  MASTER: ["INIT", "CLEAN LOUD", "CYPHER GLUE", "WIDE OPEN", "TAPE DIRT", "VOCAL POCKET", "HARD WALL", "GENTLE", "BEAT TAPE", "SMASH 50", "UDG"],
};

export const UDG_TRACKS = [
  { label: "原声", sub: "DRY", src: "/media/udg/1_dry.mp3" },
  { label: "UDG 50%", sub: "默认", src: "/media/udg/2_udg_default.mp3" },
  { label: "UDG 100%", sub: "最大", src: "/media/udg/3_udg_comp_max.mp3" },
];
