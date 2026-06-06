let audioCtx: AudioContext | null = null;

export const UI_SWITCH_SOUND_STORAGE_KEY = "ui-switch-sound-id";

/** Cover Flow + article list navigation */
export const UI_SWITCH_SOUND_NAV_ID: UiSwitchSoundId = "breeze20";

export type UiSwitchSoundId =
  | "breeze01"
  | "breeze02"
  | "breeze03"
  | "breeze04"
  | "breeze05"
  | "breeze06"
  | "breeze07"
  | "breeze08"
  | "breeze09"
  | "breeze10"
  | "breeze11"
  | "breeze12"
  | "breeze13"
  | "breeze14"
  | "breeze15"
  | "breeze16"
  | "breeze17"
  | "breeze18"
  | "breeze19"
  | "breeze20";

interface BreezePreset {
  id: UiSwitchSoundId;
  label: string;
  desc: string;
  noiseDur: number;
  noisePeak: number;
  highpass: number;
  filterHz: number;
  filterQ: number;
  toneF0: number;
  toneF1: number;
  toneDur: number;
  tonePeak: number;
  toneAttack?: number;
}

export const UI_SWITCH_SOUND_OPTIONS: BreezePreset[] = [
  { id: "breeze01", label: "Breeze 01 · Wisp", desc: "基准清透微风，轻噪 + 亮 tone", noiseDur: 0.045, noisePeak: 0.022, highpass: 1400, filterHz: 4200, filterQ: 0.55, toneF0: 980, toneF1: 760, toneDur: 0.042, tonePeak: 0.028 },
  { id: "breeze02", label: "Breeze 02 · Lift", desc: "更亮、更短，像轻抬一页", noiseDur: 0.038, noisePeak: 0.02, highpass: 1600, filterHz: 4800, filterQ: 0.5, toneF0: 1080, toneF1: 860, toneDur: 0.036, tonePeak: 0.026 },
  { id: "breeze03", label: "Breeze 03 · Drift", desc: "噪感略长，tone 偏高", noiseDur: 0.052, noisePeak: 0.018, highpass: 1200, filterHz: 3600, filterQ: 0.45, toneF0: 920, toneF1: 720, toneDur: 0.048, tonePeak: 0.024 },
  { id: "breeze04", label: "Breeze 04 · Flutter", desc: "快速掠过，高频更开", noiseDur: 0.032, noisePeak: 0.024, highpass: 1800, filterHz: 5400, filterQ: 0.65, toneF0: 1120, toneF1: 900, toneDur: 0.03, tonePeak: 0.022 },
  { id: "breeze05", label: "Breeze 05 · Veil", desc: "薄雾感，noise 极轻", noiseDur: 0.05, noisePeak: 0.014, highpass: 1500, filterHz: 4000, filterQ: 0.4, toneF0: 880, toneF1: 680, toneDur: 0.05, tonePeak: 0.03 },
  { id: "breeze06", label: "Breeze 06 · Spark", desc: "带一点 sparkle，filter 很高", noiseDur: 0.035, noisePeak: 0.026, highpass: 2000, filterHz: 6200, filterQ: 0.7, toneF0: 1180, toneF1: 940, toneDur: 0.034, tonePeak: 0.024 },
  { id: "breeze07", label: "Breeze 07 · Glide", desc: "tone 下滑更柔，仍透亮", noiseDur: 0.048, noisePeak: 0.02, highpass: 1300, filterHz: 3800, filterQ: 0.5, toneF0: 860, toneF1: 620, toneDur: 0.055, tonePeak: 0.027, toneAttack: 0.005 },
  { id: "breeze08", label: "Breeze 08 · Mist", desc: "轻雾扫过，中高频平衡", noiseDur: 0.055, noisePeak: 0.016, highpass: 1100, filterHz: 3200, filterQ: 0.42, toneF0: 940, toneF1: 740, toneDur: 0.052, tonePeak: 0.025 },
  { id: "breeze09", label: "Breeze 09 · Ripple", desc: "双层 tone，水纹感", noiseDur: 0.04, noisePeak: 0.019, highpass: 1450, filterHz: 4500, filterQ: 0.58, toneF0: 1020, toneF1: 800, toneDur: 0.04, tonePeak: 0.023 },
  { id: "breeze10", label: "Breeze 10 · Clear", desc: "推荐默认，最均衡清透", noiseDur: 0.042, noisePeak: 0.021, highpass: 1500, filterHz: 4600, filterQ: 0.52, toneF0: 1000, toneF1: 780, toneDur: 0.041, tonePeak: 0.027 },
  { id: "breeze11", label: "Breeze 11 · Halo", desc: "外圈 noise 开，tone 居中", noiseDur: 0.046, noisePeak: 0.023, highpass: 1700, filterHz: 5000, filterQ: 0.48, toneF0: 960, toneF1: 800, toneDur: 0.038, tonePeak: 0.026 },
  { id: "breeze12", label: "Breeze 12 · Sway", desc: "略宽 Q，空气感更多", noiseDur: 0.058, noisePeak: 0.017, highpass: 1000, filterHz: 3400, filterQ: 0.35, toneF0: 900, toneF1: 700, toneDur: 0.056, tonePeak: 0.024 },
  { id: "breeze13", label: "Breeze 13 · Beam", desc: "窄带 highlight，很亮", noiseDur: 0.03, noisePeak: 0.025, highpass: 2200, filterHz: 6800, filterQ: 0.85, toneF0: 1240, toneF1: 980, toneDur: 0.028, tonePeak: 0.021 },
  { id: "breeze14", label: "Breeze 14 · Echo", desc: "尾音稍长，仍不闷", noiseDur: 0.062, noisePeak: 0.015, highpass: 1250, filterHz: 3900, filterQ: 0.45, toneF0: 840, toneF1: 660, toneDur: 0.06, tonePeak: 0.022, toneAttack: 0.008 },
  { id: "breeze15", label: "Breeze 15 · Skim", desc: "极短 skim，像指尖滑过", noiseDur: 0.028, noisePeak: 0.022, highpass: 1900, filterHz: 5600, filterQ: 0.6, toneF0: 1100, toneF1: 880, toneDur: 0.026, tonePeak: 0.02 },
  { id: "breeze16", label: "Breeze 16 · Open", desc: "low-cut 高，彻底去闷", noiseDur: 0.044, noisePeak: 0.02, highpass: 2100, filterHz: 5200, filterQ: 0.55, toneF0: 1040, toneF1: 820, toneDur: 0.039, tonePeak: 0.025 },
  { id: "breeze17", label: "Breeze 17 · Silk Air", desc: "noise 少 tone 多，丝滑", noiseDur: 0.036, noisePeak: 0.012, highpass: 1600, filterHz: 4400, filterQ: 0.5, toneF0: 990, toneF1: 770, toneDur: 0.048, tonePeak: 0.032 },
  { id: "breeze18", label: "Breeze 18 · Zenith", desc: "偏高音域，空灵", noiseDur: 0.04, noisePeak: 0.018, highpass: 1800, filterHz: 6000, filterQ: 0.62, toneF0: 1160, toneF1: 920, toneDur: 0.035, tonePeak: 0.023 },
  { id: "breeze19", label: "Breeze 19 · Soft Cut", desc: "柔和切断，无低频", noiseDur: 0.041, noisePeak: 0.019, highpass: 1550, filterHz: 4700, filterQ: 0.53, toneF0: 970, toneF1: 750, toneDur: 0.037, tonePeak: 0.026 },
  { id: "breeze20", label: "Breeze 20 · Horizon", desc: "最开扬，空间感最大", noiseDur: 0.05, noisePeak: 0.016, highpass: 1300, filterHz: 7200, filterQ: 0.4, toneF0: 920, toneF1: 740, toneDur: 0.054, tonePeak: 0.024 },
];

function getCtx() {
  if (!audioCtx && typeof window !== "undefined") {
    const Ctx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx?.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

export function getUiSwitchSoundId(): UiSwitchSoundId {
  if (typeof window === "undefined") return "breeze10";
  const stored = window.localStorage.getItem(UI_SWITCH_SOUND_STORAGE_KEY);
  if (stored && UI_SWITCH_SOUND_OPTIONS.some((o) => o.id === stored)) {
    return stored as UiSwitchSoundId;
  }
  return "breeze10";
}

export function setUiSwitchSoundId(id: UiSwitchSoundId) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(UI_SWITCH_SOUND_STORAGE_KEY, id);
  }
}

function tone(
  ctx: AudioContext,
  now: number,
  opts: {
    type?: OscillatorType;
    f0: number;
    f1: number;
    dur: number;
    attack?: number;
    peak?: number;
    decay?: number;
  }
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const attack = opts.attack ?? 0.003;
  const peak = opts.peak ?? 0.026;
  const decay = opts.decay ?? opts.dur;
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.f0, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(opts.f1, 40), now + opts.dur);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + decay + 0.012);
}

function playBreezeVariant(ctx: AudioContext, now: number, p: BreezePreset) {
  const noiseDur = p.noiseDur;
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * noiseDur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * (1 - t) * 0.28;
  }
  noise.buffer = buffer;

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = p.highpass;
  highpass.Q.value = 0.6;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = p.filterHz;
  bandpass.Q.value = p.filterQ;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(p.noisePeak, now + 0.004);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + noiseDur * 0.92);

  noise.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + noiseDur);

  tone(ctx, now, {
    f0: p.toneF0,
    f1: p.toneF1,
    dur: p.toneDur,
    peak: p.tonePeak,
    attack: p.toneAttack ?? 0.003,
    decay: p.toneDur + 0.012,
  });

  if (p.id === "breeze09") {
    tone(ctx, now + 0.014, {
      f0: p.toneF0 * 1.25,
      f1: p.toneF1 * 1.15,
      dur: 0.028,
      peak: 0.01,
      decay: 0.04,
    });
  }
}

const PLAYERS = Object.fromEntries(
  UI_SWITCH_SOUND_OPTIONS.map((preset) => [
    preset.id,
    (ctx: AudioContext, now: number) => playBreezeVariant(ctx, now, preset),
  ])
) as Record<UiSwitchSoundId, (ctx: AudioContext, now: number) => void>;

/** Light clear breeze-style UI tick — Cover Flow / list navigation */
export function playUiSwitchSound(id: UiSwitchSoundId = getUiSwitchSoundId()) {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    PLAYERS[id](ctx, ctx.currentTime);
  } catch {
    // Autoplay policy may defer context start.
  }
}
