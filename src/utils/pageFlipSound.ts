let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx && typeof window !== "undefined") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** Soft paper/page flip — used by MUJI photo album */
export function playPageFlipSound() {
  const ctx = getCtx();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const now = ctx.currentTime;
  const duration = 1.3;
  const attack = duration * (0.04 / 0.28);

  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * (1 - t) * (0.35 + 0.65 * Math.sin(t * Math.PI));
  }
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 640;
  filter.Q.value = 0.45;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration);
}
