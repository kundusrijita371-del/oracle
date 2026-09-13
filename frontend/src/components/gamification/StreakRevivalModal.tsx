import React, { useState } from 'react';
import { Flame, Sparkles, Shield, Coins, Heart, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/audioEffects';
import { useFloatingLoot } from './FloatingLootManager';

interface StreakRevivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  gold: number;
  streakDays: number;
  onReviveStreak: (cost: number) => void;
}

export const StreakRevivalModal: React.FC<StreakRevivalModalProps> = ({
  isOpen,
  onClose,
  gold,
  streakDays = 14,
  onReviveStreak
}) => {
  const { triggerLoot } = useFloatingLoot();
  const revivalCost = 150;
  const canAfford = gold >= revivalCost;

  const [isReviving, setIsReviving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDrinkPotion = () => {
    if (!canAfford || isReviving) return;

    setIsReviving(true);
    soundFX.playPotionRevival();

    setTimeout(() => {
      setIsReviving(false);
      setIsSuccess(true);
      onReviveStreak(revivalCost);

      triggerLoot("Streak Revived!", 'xp');
      triggerLoot("-150 Gold", 'gold');

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="relative max-w-md w-full bg-gradient-to-b from-[#2B1B17] via-[#3B221B] to-[#1E110E] rounded-[40px] border-4 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.4)] p-7 text-center text-white my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 flex items-center justify-center border border-white/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-4">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Alchemical Streak Saver</span>
        </div>

        {!isSuccess ? (
          <>
            {/* Potion Bottle Visual */}
            <div className="relative my-4 flex items-center justify-center">
              <div className={`w-28 h-28 rounded-full bg-gradient-to-tr from-amber-600 via-rose-500 to-yellow-400 p-1 shadow-[0_0_35px_rgba(245,158,11,0.7)] flex items-center justify-center ${isReviving ? 'animate-bounce' : 'animate-pulse'}`}>
                <div className="w-full h-full bg-[#20100D] rounded-full flex flex-col items-center justify-center text-5xl">
                  🧪
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              Potion of Revival
            </h3>
            <p className="text-xs text-amber-100/70 mt-1 mb-6 px-4">
              Missed a study day? Drink the Phoenix Elixir to restore and shield your <span className="font-black text-amber-300">{streakDays}-Day Study Streak</span> from breaking.
            </p>

            {/* Price & Balance Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between text-xs">
              <div className="text-left">
                <div className="text-gray-400 font-medium">Elixir Price</div>
                <div className="font-black text-amber-300 flex items-center gap-1 text-sm">
                  <span>🪙 {revivalCost} GOLD</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-gray-400 font-medium">Your Gold Stash</div>
                <div className={`font-black text-sm ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                  {gold} GOLD
                </div>
              </div>
            </div>

            {/* Drink Button */}
            <button
              onClick={handleDrinkPotion}
              disabled={!canAfford || isReviving}
              className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                canAfford
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:scale-[1.02] text-[#2E1805]'
                  : 'bg-white/10 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isReviving ? 'Uncorking Magical Elixir...' : 'Uncork Potion & Save Streak'}</span>
            </button>
          </>
        ) : (
          <div className="py-6 space-y-4 animate-fadeIn">
            <div className="text-6xl animate-bounce">🔥✨🔥</div>
            <h3 className="text-2xl font-black text-amber-300">
              STREAK SAVED!
            </h3>
            <p className="text-xs text-amber-100 font-semibold px-4">
              Your {streakDays}-Day streak flame has been reignited and shielded by the Phoenix Elixir!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#2E1805] font-black text-xs shadow-lg mt-4"
            >
              Return to Guild Hall
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
