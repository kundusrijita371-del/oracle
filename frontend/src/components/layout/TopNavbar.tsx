import React from 'react';
import { Search, Bell, User, Volume2, VolumeX, Coins, Flame, Shield, Sparkles } from 'lucide-react';
import { StudentProfile } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface TopNavbarProps {
  pageTitle: string;
  profile: StudentProfile | null;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  onOpenJudgeDeck: () => void;
  onSwitchHero: () => void;
  onOpenProfile?: () => void;
  onOpenBossRaid?: () => void;
  onTriggerLevelUp?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  pageTitle,
  profile,
  audioEnabled,
  setAudioEnabled,
  onOpenJudgeDeck,
  onSwitchHero,
  onOpenProfile,
  onOpenBossRaid,
  onTriggerLevelUp
}) => {
  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playCoin();
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 select-none">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-black text-[#2E241E] tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Center 3D Search Bar */}
      <div className="flex-1 max-w-md w-full relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9084] pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search quests, topics, algorithms..."
          className="w-full h-11 pl-11 pr-4 bg-white/90 focus:bg-white text-xs font-semibold text-[#2E241E] placeholder-[#9E9084] rounded-2xl border-2 border-white shadow-[0_6px_18px_rgba(180,160,140,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] focus:outline-none focus:border-[#EB8B68]/60 transition-all"
        />
      </div>

      {/* Right Stats & Action Pills */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        {/* Credit Points Pill */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#E8EDFB] border-2 border-white shadow-[0_4px_12px_rgba(79,114,205,0.15)] text-xs font-black text-[#324B8B] cursor-pointer hover:scale-105 transition-transform"
          title="Academy Credit Points — Click to Customize Cartoon Avatar & Identity"
        >
          <span>💎</span>
          <span>{profile?.credit_points ?? 2500} pts</span>
        </div>

        {/* Gold Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FDECC8] border-2 border-white shadow-[0_4px_12px_rgba(220,166,66,0.15)] text-xs font-black text-[#6B4B10]">
          <span>🪙</span>
          <span>{profile?.gold || 0}</span>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FCDAC9] border-2 border-white shadow-[0_4px_12px_rgba(235,139,104,0.15)] text-xs font-black text-[#73351C]">
          <span>🔥</span>
          <span>{profile?.streak_days || 0}d</span>
        </div>

        {/* Boss Fight Action Button */}
        {onOpenBossRaid && (
          <button
            onClick={onOpenBossRaid}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:scale-105 transition-all border border-white/40"
            title="Launch Boss Raid Diagnostic Exam"
          >
            <span>⚔️</span>
            <span>Boss Raid</span>
          </button>
        )}

        {/* Level Up Splash Trigger */}
        {onTriggerLevelUp && (
          <button
            onClick={onTriggerLevelUp}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-[#2B1B04] text-xs font-black shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:scale-105 transition-all border border-white/60"
            title="Test Anime Level-Up Rank Ascension Screen"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rank Up</span>
          </button>
        )}

        {/* Sound Toggle Button */}
        <button
          onClick={toggleAudio}
          className="w-10 h-10 rounded-2xl bg-white border-2 border-white shadow-[0_4px_12px_rgba(180,160,140,0.12)] hover:bg-[#F9F5EE] flex items-center justify-center text-[#5A4D43] transition-all"
          title={audioEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4 text-[#EB8B68]" /> : <VolumeX className="w-4 h-4 text-[#A89D93]" />}
        </button>

        {/* Bell Notification with Badge */}
        <div
          onClick={onOpenJudgeDeck}
          className="relative w-10 h-10 rounded-2xl bg-white border-2 border-white shadow-[0_4px_12px_rgba(180,160,140,0.12)] hover:bg-[#F9F5EE] flex items-center justify-center text-[#5A4D43] cursor-pointer transition-all"
          title="Judge Demo Notifications"
        >
          <Bell className="w-4 h-4 text-[#5A4D43]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EB8B68] text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-sm">
            3
          </span>
        </div>

        {/* User Cartoon Avatar Pill */}
        <button
          onClick={onOpenProfile || onSwitchHero}
          className="w-10 h-10 rounded-2xl bg-[#D3E4DB] border-2 border-white shadow-[0_4px_12px_rgba(150,180,165,0.2)] flex items-center justify-center text-sm font-black text-[#324B3E] hover:scale-105 transition-all overflow-hidden"
          title="Cartoon Avatar Studio & Scholar Identity"
        >
          {profile?.avatar_config?.expression === 'wink' ? '😉' :
           profile?.avatar_config?.expression === 'focused' ? '🧐' :
           profile?.avatar_config?.expression === 'chill' ? '😎' :
           profile?.avatar_config?.expression === 'sparkle' ? '🤩' : '😊'}
        </button>
      </div>
    </header>
  );
};
