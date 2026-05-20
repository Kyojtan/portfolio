import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";

export function AudioAmbient() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.15); // Default 15% volume
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const startSynth = () => {
    try {
      // Create audio context if it doesn't exist
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // 1. Create Filter to keep it warm and deep
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(110, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);
      filterRef.current = filter;

      // 2. Create Detuned Low-Frequency Oscillators (Deep warm drones)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = "sawtooth"; // Richer harmonics filtered out
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(55.4, ctx.currentTime); // Detuned slightly for premium beating chorus
      
      const osc1Gain = ctx.createGain();
      const osc2Gain = ctx.createGain();
      osc1Gain.gain.setValueAtTime(0.4, ctx.currentTime);
      osc2Gain.gain.setValueAtTime(0.6, ctx.currentTime);

      osc1.connect(osc1Gain);
      osc2.connect(osc2Gain);

      // 3. Create Nebular Swell Modulator (LFO)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // Extra slow modulation (12.5 seconds cycle)
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(45, ctx.currentTime); // Modulate filter cutoff between 65Hz and 155Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency); // Modulate cutoff directly

      // 4. Main Gain node for volume settings
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(volume, ctx.currentTime);
      mainGainRef.current = mainGain;

      // Connect overall paths
      osc1Gain.connect(filter);
      osc2Gain.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      // Start oscillators
      osc1.start();
      osc2.start();
      lfo.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      lfoRef.current = lfo;

      setIsPlaying(true);
    } catch (e) {
      console.warn("Failed to initiate space synth audio context", e);
    }
  };

  const stopSynth = () => {
    if (osc1Ref.current) {
      try { osc1Ref.current.stop(); } catch (e) {}
      osc1Ref.current = null;
    }
    if (osc2Ref.current) {
      try { osc2Ref.current.stop(); } catch (e) {}
      osc2Ref.current = null;
    }
    if (lfoRef.current) {
      try { lfoRef.current.stop(); } catch (e) {}
      lfoRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSynth();
    } else {
      startSynth();
    }
  };

  // Keep volume gain updated in real time
  useEffect(() => {
    if (mainGainRef.current && audioCtxRef.current) {
      mainGainRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.1);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isPlaying) stopSynth();
    };
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0a0a0f] border border-zinc-900 text-xs font-mono text-zinc-400 select-none">
      <button 
        onClick={toggleSound}
        className="flex items-center gap-1.5 font-mono text-zinc-400 hover:text-white transition active:scale-95"
      >
        {isPlaying ? (
          <>
            <Volume2 size={11} className="text-yellow-500" />
            <span className="text-yellow-500 text-[10px] font-medium">背景音: 开启</span>
          </>
        ) : (
          <>
            <VolumeX size={11} className="text-zinc-500" />
            <span className="text-zinc-500 text-[10px]">背景音: 关闭</span>
          </>
        )}
      </button>

      {isPlaying && (
        <div className="flex items-center gap-1.5 ml-1">
          <input 
            type="range"
            min="0"
            max="0.4"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-12 h-1 rounded bg-zinc-800 accent-yellow-500 cursor-pointer opacity-70 hover:opacity-100 transition"
            title="Adjust volume"
          />
        </div>
      )}
    </div>
  );
}
