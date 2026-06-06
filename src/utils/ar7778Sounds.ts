/**
 * AR-7778 musical calculator samples (CC BY 4.0 — evnchn)
 * https://github.com/evnchn-AR7778/musical-calculator-web
 *
 * Not wired into AiProjectShowcase by default — enable via EtherealBubbleText when needed.
 */

const NOTES = ["C4", "D4", "E4", "F4", "G4", "A5", "B5", "C5", "D5", "E5", "F5", "G5", "A6", "B6"] as const;
type NoteName = (typeof NOTES)[number];

const SETTINGS = {
  volume: 6,
  keyDurationMs: 200,
  noteIntervalMs: 140,
  reverb: 100,
} as const;

const buffers: Partial<Record<NoteName, AudioBuffer>> = {};
let audioCtx: AudioContext | null = null;
let reverbBus: { convolver: ConvolverNode; dry: GainNode; wet: GainNode } | null = null;
let lastCharSoundAt = 0;
let preloadPromise: Promise<void> | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

function getReverbBus(ctx: AudioContext) {
  if (reverbBus) return reverbBus;
  const len = Math.floor(ctx.sampleRate * 1.4);
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  dry.connect(ctx.destination);
  convolver.connect(wet);
  wet.connect(ctx.destination);
  reverbBus = { convolver, dry, wet };
  return reverbBus;
}

function applyReverbMix() {
  if (!reverbBus) return;
  const wet = SETTINGS.reverb / 100;
  reverbBus.dry.gain.value = 1 - wet * 0.35;
  reverbBus.wet.gain.value = wet * 0.55;
}

function playNote(noteName: NoteName) {
  const buf = buffers[noteName];
  if (!buf) return;

  try {
    const ctx = getCtx();
    const bus = getReverbBus(ctx);
    applyReverbMix();

    const cutSec = SETTINGS.keyDurationMs / 1000;
    const gainLevel = (SETTINGS.volume / 100) * 0.85;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = gainLevel;
    src.connect(gain);
    gain.connect(bus.dry);
    gain.connect(bus.convolver);
    src.start(0, 0, Math.min(cutSec, buf.duration));
  } catch {
    // Autoplay policy or decode edge cases
  }
}

function playRandomNote() {
  const note = NOTES[Math.floor(Math.random() * NOTES.length)];
  playNote(note);
}

export function resetAr7778CharThrottle() {
  lastCharSoundAt = 0;
}

/** Call when a dialogue character becomes visible (throttled to ~7 notes/sec). */
export function onAr7778CharReveal() {
  const now = performance.now();
  if (now - lastCharSoundAt < SETTINGS.noteIntervalMs) return;
  lastCharSoundAt = now;
  playRandomNote();
}

export function preloadAr7778Sounds(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  preloadPromise = (async () => {
    const ctx = getCtx();
    await Promise.all(
      NOTES.map(async (note) => {
        if (buffers[note]) return;
        const res = await fetch(`/sounds/ar7778/${note}.wav`);
        if (!res.ok) throw new Error(`AR7778 sample missing: ${note}`);
        buffers[note] = await ctx.decodeAudioData(await res.arrayBuffer());
      })
    );
    getReverbBus(ctx);
    applyReverbMix();
  })();

  return preloadPromise;
}
