import React from 'react';
import { Flame, Coins, Shield, Sparkles, Volume2, VolumeX, Cpu, Compass } from 'lucide-react';
import { StudentProfile } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface HeaderProps {
  profile: StudentProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  onOpenJudgeDeck: () => void;
  onSwitchHero: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  audioEnabled,
  setAudioEnabled,
  onOpenJudgeDeck,
  onSwitchHero
}) => {
  const tabs = [
    { id: 'overview', label: 'Guild Hall', icon: '🏛️' },
    { id: 'calendar', label: 'Adaptive Calendar', icon: '📅' },
    { id: 'diagnostic', label: 'Diagnostic Hub', icon: '🧪' },
    { id: 'remedial', label: 'Remedial RAG', icon: '📚' },
    { id: 'skills', label: 'Skill Tree', icon: '🌳' },
    { id: 'rewards', label: 'Life Marketplace', icon: '🛒' },
    { id: 'wizard', label: 'Syllabus Wizard', icon: '🧙' },
    { id: 'logs', label: 'Agent Thoughts', icon: '🧠' },
  ];

  const handleTabClick = (tabId: string) => {
    soundFX.playCoin();
    setActiveTab(tabId);
  };

  const toggleSound = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playCoin();
  };

  const xpPercent = profile ? Math.min(100, Math.round((profile.xp / profile.next_level_xp) * 100)) : 30;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090D18]/90 backdrop-blur-xl border-b border-indigo-500/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Stats */}
        <div className="flex items-center justify-between py-2.5 border-b border-slate-800/80">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-base tracking-wider text-amber-200">
                  ORACLE
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-900/60 border border-indigo-400/40 text-indigo-300 font-mono">
                  Autonomous Agent
                </span>
              </div>
            </div>
          </div>

          {/* Hero HUD & Gamification Stats */}
          {profile && (
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Rank & Level */}
              <div
                onClick={onSwitchHero}
                className="flex items-center gap-2 cursor-pointer p-1.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all group"
                title="Click to switch Hero Profile"
              >
                <div className={`px-2.5 py-0.5 rounded-md text-xs font-black badge-rank-${profile.rank} shadow-sm`}>
                  {profile.rank}-Rank
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    <span>{profile.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">Lvl {profile.level}</span>
                  </div>
                  <div className="text-[10px] text-indigo-300/80">{profile.character_class}</div>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="hidden md:flex flex-col w-32">
                <div className="flex justify-between text-[10px] text-purple-300 font-mono mb-1">
                  <span>XP {profile.xp}/{profile.next_level_xp}</span>
                  <span>{xpPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-purple-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>

              {/* Gold Coins */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-inner">
                <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="font-mono">{profile.gold}</span>
                <span className="text-[10px] text-amber-400/80">GOLD</span>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-300 text-xs font-bold shadow-inner">
                <Flame className="w-4 h-4 text-orange-400 animate-streak-burn" />
                <span className="font-mono">{profile.streak_days}d</span>
                {profile.streak_shield_active && (
                  <span title="Streak Shield Active">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                  </span>
                )}
              </div>

              {/* Dynamic Difficulty Adjustment (DDA) Badge */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>DDA: <strong className="text-amber-300">{profile.dda_mode}</strong></span>
              </div>

              {/* Audio and Judge Demo Deck Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSound}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-400 text-slate-300 hover:text-white transition-colors"
                  title={audioEnabled ? "Mute SFX" : "Enable SFX"}
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </button>

                <button
                  onClick={onOpenJudgeDeck}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all active:scale-95 animate-pulse"
                  title="Open Judge Simulation Deck"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Judge Demo Deck</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white border border-indigo-400/50 shadow-md shadow-indigo-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
