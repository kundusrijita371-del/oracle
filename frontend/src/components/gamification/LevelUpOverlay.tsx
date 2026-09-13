import React, { useEffect } from 'react';
import { Sparkles, Trophy, Award, Zap, Shield, Flame, X, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/audioEffects';

interface LevelUpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  newRank?: string;
  previousRank?: string;
  characterClass?: string;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({
  isOpen,
  onClose,
  newLevel,
  newRank = 'A-Rank Arch-Scholar',
  previousRank = 'B-Rank Adept',
  characterClass = 'Spellblade Scholar'
}) => {
  useEffect(() => {
    if (isOpen) {
      soundFX.playLevelUp();
      // Multiple bursts of celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none overflow-hidden animate-fadeIn">
      {/* Anime Background Rays */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-[1000px] h-[1000px] bg-[conic-gradient(from_0deg,#F59E0B,#FEF08A,#D97706,#FEF08A,#F59E0B)] rounded-full animate-rays blur-2xl" />
      </div>

      {/* Main Level Up Frame */}
      <div className="relative max-w-lg w-full bg-gradient-to-b from-[#1C162E] via-[#2A1E4A] to-[#160E29] rounded-[44px] border-4 border-amber-400/90 shadow-[0_0_80px_rgba(251,191,36,0.5)] p-8 text-center animate-gold-glow">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 flex items-center justify-center transition-colors border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border border-amber-400/60 text-amber-300 text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Rank Ascension Breakthrough</span>
        </div>

        {/* Anime Title */}
        <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
          LEVEL UP!
        </h1>

        {/* Big Level Display with Glowing Seal */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-1 shadow-[0_0_40px_rgba(245,158,11,0.7)] rotate-3 hover:rotate-0 transition-transform">
            <div className="w-full h-full bg-[#1F143B] rounded-[22px] flex flex-col items-center justify-center text-white">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Level</span>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-200">
                {newLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Rank Progression */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 text-sm font-bold">
            <span className="text-gray-400 line-through">{previousRank}</span>
            <span className="text-amber-400 font-black">➔</span>
            <span className="text-yellow-300 font-black text-base drop-shadow-sm">{newRank}</span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 font-medium">
            Path of the {characterClass}
          </p>
        </div>

        {/* Stat Boosts Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-2.5 text-center">
            <div className="text-lg">⚡</div>
            <div className="text-[10px] uppercase font-bold text-amber-300">Focus Core</div>
            <div className="text-xs font-black text-white">+15 PTS</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-2xl p-2.5 text-center">
            <div className="text-lg">🔮</div>
            <div className="text-[10px] uppercase font-bold text-purple-300">Mana Pool</div>
            <div className="text-xs font-black text-white">+30 MAX</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-2.5 text-center">
            <div className="text-lg">🔥</div>
            <div className="text-[10px] uppercase font-bold text-emerald-300">Retention</div>
            <div className="text-xs font-black text-white">+8% EXP</div>
          </div>
        </div>

        {/* Action Claim Button */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-[#2B1B04] font-black text-base shadow-[0_10px_25px_rgba(245,158,11,0.5)] border-2 border-white/60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Award className="w-5 h-5" />
          <span>Claim Scholar Mastery</span>
        </button>
      </div>
    </div>
  );
};
