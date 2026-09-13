import React from 'react';
import { Home, Calendar, Brain, BookOpen, GitFork, ShoppingBag, Wand2, Cpu, Crown, Sparkles, Volume2, VolumeX, Palette, User } from 'lucide-react';
import { StudentProfile } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface SidebarProps {
  profile: StudentProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenJudgeDeck: () => void;
  onSwitchHero: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenJudgeDeck,
  onSwitchHero
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Cartoon & Identity', icon: Palette },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'diagnostic', label: 'Diagnostics', icon: Brain },
    { id: 'remedial', label: 'Remedial RAG', icon: BookOpen },
    { id: 'skills', label: 'Skill Tree', icon: GitFork },
    { id: 'rewards', label: 'Marketplace', icon: ShoppingBag },
    { id: 'wizard', label: 'Syllabus Wizard', icon: Wand2 },
    { id: 'logs', label: 'Agent Thoughts', icon: Cpu },
  ];

  const handleNav = (tabId: string) => {
    soundFX.playCoin();
    setActiveTab(tabId);
  };

  const getMascotEmoji = () => {
    const mascot = profile?.avatar_config?.mascot;
    if (mascot === 'cat') return '🐱';
    if (mascot === 'dragon') return '🐉';
    if (mascot === 'fox') return '🦊';
    if (mascot === 'owl') return '🦉';
    if (mascot === 'robot') return '🤖';
    if (mascot === 'none') return '';
    return '🐱';
  };

  return (
    <aside className="w-64 shrink-0 bg-[#D3E4DB] rounded-[38px] p-5 flex flex-col justify-between shadow-[0_15px_35px_rgba(160,190,175,0.3),inset_0_2px_4px_rgba(255,255,255,0.85)] border-4 border-white/60 select-none">
      {/* Top Profile Card */}
      <div className="space-y-6">
        <div
          onClick={() => handleNav('profile')}
          className="flex flex-col items-center cursor-pointer group"
          title="Click to Edit Cartoon Avatar & View Profile"
        >
          {/* 3D Round Avatar Container */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full border-4 border-white shadow-[0_8px_20px_rgba(150,180,165,0.3)] flex items-center justify-center text-3xl overflow-hidden group-hover:scale-105 transition-transform"
              style={{
                backgroundColor: profile?.avatar_config?.skin_tone || '#FDD5B1'
              }}
            >
              <div className="relative flex flex-col items-center">
                <span className="text-3xl">
                  {profile?.avatar_config?.expression === 'wink' ? '😉' :
                   profile?.avatar_config?.expression === 'focused' ? '🧐' :
                   profile?.avatar_config?.expression === 'chill' ? '😎' :
                   profile?.avatar_config?.expression === 'sparkle' ? '🤩' : '😊'}
                </span>
                {profile?.avatar_config?.headphones && (
                  <span className="absolute -top-1 text-2xl opacity-90">🎧</span>
                )}
              </div>
            </div>
            {/* Rank Badge */}
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#EB8B68] text-white text-[10px] font-black border-2 border-white shadow-sm flex items-center gap-0.5">
              <span>{profile?.rank || 'F'}-Rank</span>
            </div>
            {/* Mascot Mini Badge */}
            {profile?.avatar_config?.mascot && profile.avatar_config.mascot !== 'none' && (
              <div className="absolute -top-1 -left-1 text-sm bg-white rounded-full p-0.5 border border-white shadow-sm">
                {getMascotEmoji()}
              </div>
            )}
          </div>

          <div className="text-center mt-3">
            <div className="text-base font-extrabold text-[#2C241F] flex items-center justify-center gap-1 group-hover:text-[#EB8B68] transition-colors">
              <span>Hi, {profile?.name.split(' ')[0] || 'Scholar'}!</span>
              <span className="text-amber-500 text-sm">👋</span>
            </div>
            <div className="text-[11px] font-semibold text-[#6E7B74] mt-0.5 flex items-center justify-center gap-1.5">
              <span>{profile?.character_class || 'Algorithm Apprentice'}</span>
              <span className="text-[10px] text-[#EB8B68] font-bold">✎ Edit</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-[#2E241E] shadow-[0_6px_16px_rgba(150,180,165,0.28),inset_0_1px_2px_rgba(255,255,255,0.9)] scale-[1.02]'
                    : 'text-[#4F5E57] hover:text-[#25302B] hover:bg-white/40'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-[#D3E4DB] text-[#3D785D]' : 'text-[#5C6E66]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom 3D Peach Card: Judge Demo Deck & Rank Perk */}
      <div className="mt-6 bg-gradient-to-br from-[#FCDAC9] to-[#F7C6B0] p-4 rounded-3xl border-2 border-white/80 shadow-[0_8px_20px_rgba(235,139,104,0.22)] space-y-2.5 text-center">
        <div className="w-10 h-10 rounded-2xl bg-white mx-auto flex items-center justify-center text-xl shadow-md border border-white">
          <Crown className="w-5 h-5 text-[#EB8B68]" />
        </div>
        <div>
          <h4 className="text-xs font-black text-[#4A2D1F]">
            Autonomous Loop
          </h4>
          <p className="text-[10px] font-medium text-[#7C5A48] mt-0.5">
            DDA: <strong className="text-[#C85931]">{profile?.dda_mode || 'Adventurer'}</strong>
          </p>
        </div>
        <button
          onClick={onOpenJudgeDeck}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-[#EB8B68] to-[#DF734D] hover:from-[#E47B54] hover:to-[#D5653E] text-white font-bold text-[11px] shadow-md shadow-[#EB8B68]/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Judge Demo Deck</span>
        </button>
      </div>
    </aside>
  );
};
