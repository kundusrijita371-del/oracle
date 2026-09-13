import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, CloudRain, Flame, Disc, Radio, Sparkles } from 'lucide-react';
import { lofiEngine, LOFI_PLAYLIST, LoFiTrack } from '../../utils/loFiSynthEngine';
import { soundFX } from '../../utils/audioEffects';

interface LoFiPlayerWidgetProps {
  onClose?: () => void;
  compact?: boolean;
}

export const LoFiPlayerWidget: React.FC<LoFiPlayerWidgetProps> = ({ compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<LoFiTrack>(lofiEngine.getCurrentTrack());
  const [volume, setVolume] = useState(0.7);
  const [rainActive, setRainActive] = useState(false);
  const [fireActive, setFireActive] = useState(false);
  const [tapeCounter, setTapeCounter] = useState(104);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTapeCounter(prev => (prev + 1) % 999);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    soundFX.playTapeClick();
    const playing = lofiEngine.togglePlay();
    setIsPlaying(playing);
  };

  const handleNext = () => {
    soundFX.playTapeClick();
    const next = lofiEngine.nextTrack();
    setCurrentTrack(next);
  };

  const handlePrev = () => {
    soundFX.playTapeClick();
    const prev = lofiEngine.prevTrack();
    setCurrentTrack(prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    lofiEngine.setVolume(val);
  };

  const handleToggleRain = () => {
    soundFX.playTapeClick();
    const active = lofiEngine.toggleRain();
    setRainActive(active);
  };

  const handleToggleFire = () => {
    soundFX.playTapeClick();
    const active = lofiEngine.toggleFire();
    setFireActive(active);
  };

  return (
    <div className="clay-card p-5 rounded-[36px] border-4 border-white shadow-xl bg-gradient-to-b from-[#2A233A] via-[#1E182A] to-[#15101E] text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Retro Lo-Fi Study Deck
            </h4>
            <span className="text-[10px] text-gray-400 font-semibold">
              Analog Chillhop & Ambience
            </span>
          </div>
        </div>

        {/* Tape Counter */}
        <div className="bg-black/60 px-2.5 py-1 rounded-lg border border-white/15 font-mono text-xs font-black text-amber-400 tracking-widest shadow-inner">
          {tapeCounter.toString().padStart(3, '0')}
        </div>
      </div>

      {/* Retro Cassette Graphic Body */}
      <div className="relative bg-gradient-to-r from-[#D88A60] via-[#E29871] to-[#C7784D] rounded-2xl p-3.5 border-2 border-white/40 shadow-inner mb-4">
        {/* Label Window */}
        <div className="bg-[#FFF9F2] rounded-xl p-2.5 text-[#2E241E] shadow-sm mb-3 border border-[#EADAC9]">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#9C7F6E]">
            <span>Side A • 72-80 BPM</span>
            <span className="flex items-center gap-1 text-amber-700">
              <Sparkles className="w-3 h-3" /> Hi-Fi Warmth
            </span>
          </div>
          <div className="font-black text-xs text-[#3E291C] truncate mt-0.5">
            {currentTrack.title}
          </div>
          <div className="text-[10px] text-[#7C6656] font-semibold">
            {currentTrack.vibe}
          </div>
        </div>

        {/* Cassette Spools Window */}
        <div className="bg-[#1C1527] rounded-xl p-2 border border-black/40 flex items-center justify-around relative overflow-hidden">
          {/* Left Spool */}
          <div className={`w-11 h-11 rounded-full border-4 border-[#FFF5EA] bg-[#2E243D] flex items-center justify-center shadow-lg relative ${isPlaying ? 'animate-cassette-spin' : ''}`}>
            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-400" />
            <div className="absolute w-1 h-3 bg-white/60 -top-1" />
            <div className="absolute w-1 h-3 bg-white/60 -bottom-1" />
            <div className="absolute w-3 h-1 bg-white/60 -left-1" />
            <div className="absolute w-3 h-1 bg-white/60 -right-1" />
          </div>

          {/* Center Tape Window */}
          <div className="w-16 h-6 bg-[#110B1B] rounded border border-white/20 flex items-center justify-center">
            <div className="h-1 w-12 bg-amber-600/60 rounded-full" />
          </div>

          {/* Right Spool */}
          <div className={`w-11 h-11 rounded-full border-4 border-[#FFF5EA] bg-[#2E243D] flex items-center justify-center shadow-lg relative ${isPlaying ? 'animate-cassette-spin' : ''}`}>
            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-400" />
            <div className="absolute w-1 h-3 bg-white/60 -top-1" />
            <div className="absolute w-1 h-3 bg-white/60 -bottom-1" />
            <div className="absolute w-3 h-1 bg-white/60 -left-1" />
            <div className="absolute w-3 h-1 bg-white/60 -right-1" />
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 flex items-center justify-center transition-colors"
            title="Previous Beat"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-[#2B1A02]'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Vibes</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 flex items-center justify-center transition-colors"
            title="Next Beat"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Master Volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 accent-amber-400 cursor-pointer h-1.5 bg-black/40 rounded-lg"
          />
        </div>
      </div>

      {/* Ambient Sound Layer Toggles */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
        <button
          onClick={handleToggleRain}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
            rainActive
              ? 'bg-sky-500/20 border-sky-400/60 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>Rain Sound</span>
        </button>

        <button
          onClick={handleToggleFire}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
            fireActive
              ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Fireplace</span>
        </button>
      </div>
    </div>
  );
};
