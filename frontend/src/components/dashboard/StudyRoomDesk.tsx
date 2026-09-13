import React, { useState, useEffect } from 'react';
import {
  Sun, Moon, Sunset, Sunrise, Sparkles, Coffee, Calendar,
  Radio, Swords, Zap, AlertTriangle, Lightbulb, Clock, Info, CheckCircle2
} from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';
import { useFloatingLoot } from '../gamification/FloatingLootManager';

export type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'midnight';

interface StudyRoomDeskProps {
  onOpenCalendar: () => void;
  onOpenBossRaid: () => void;
  onOpenRewards: () => void;
  onTriggerFocusBoost: () => void;
  onToggleLoFi: () => void;
  onSummonGuildMaster: () => void;
  warningActive?: boolean;
  warningReason?: string;
}

export const StudyRoomDesk: React.FC<StudyRoomDeskProps> = ({
  onOpenCalendar,
  onOpenBossRaid,
  onOpenRewards,
  onTriggerFocusBoost,
  onToggleLoFi,
  onSummonGuildMaster,
  warningActive = false,
  warningReason = "Missed Study Session / Dropped Quiz Score Detected"
}) => {
  const { triggerLoot } = useFloatingLoot();

  // Time of Day state: defaults based on real hour
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'dawn';
    if (hour >= 10 && hour < 17) return 'day';
    if (hour >= 17 && hour < 21) return 'sunset';
    return 'midnight';
  });

  const [lampWarning, setLampWarning] = useState(warningActive);
  const [focusBoostActive, setFocusBoostActive] = useState(false);
  const [steamPuff, setSteamPuff] = useState(true);

  useEffect(() => {
    setLampWarning(warningActive);
  }, [warningActive]);

  const handleCoffeeClick = () => {
    soundFX.playCoin();
    setFocusBoostActive(true);
    triggerLoot("+25% Focus Turbo", 'xp');
    onTriggerFocusBoost();
    setTimeout(() => setFocusBoostActive(false), 3000);
  };

  const handleToggleLampWarning = () => {
    soundFX.playAlert();
    setLampWarning(!lampWarning);
  };

  // Environment styling configurations
  const envConfigs = {
    dawn: {
      skyGradient: 'from-amber-200 via-rose-300 to-sky-300',
      windowBackdrop: 'from-orange-100 to-amber-200',
      roomAura: 'from-amber-50/80 to-orange-50/50',
      deskWood: 'from-[#8B5A2B] via-[#9E6B38] to-[#7A4B20]',
      sunMoonIcon: '🌅',
      label: 'Morning Dawn (Focus Horizon)'
    },
    day: {
      skyGradient: 'from-sky-300 via-blue-200 to-indigo-100',
      windowBackdrop: 'from-blue-100 to-sky-200',
      roomAura: 'from-sky-50/60 to-white/40',
      deskWood: 'from-[#966336] via-[#A87445] to-[#825026]',
      sunMoonIcon: '☀️',
      label: 'High Sun (Peak Cognition)'
    },
    sunset: {
      skyGradient: 'from-amber-400 via-rose-400 to-purple-600',
      windowBackdrop: 'from-amber-300 via-pink-400 to-indigo-500',
      roomAura: 'from-amber-100/70 via-rose-50/40 to-purple-50/30',
      deskWood: 'from-[#7A4920] via-[#8C582C] to-[#683B16]',
      sunMoonIcon: '🌇',
      label: 'Warm Golden Sunset (Review Hour)'
    },
    midnight: {
      skyGradient: 'from-[#0B0A1A] via-[#1A1633] to-[#0E0C1C]',
      windowBackdrop: 'from-[#060510] via-[#120E24] to-[#1E1738]',
      roomAura: 'from-indigo-950/80 via-purple-950/40 to-black/60',
      deskWood: 'from-[#422615] via-[#52331C] to-[#361E10]',
      sunMoonIcon: '🌙',
      label: 'Midnight Starlight (Deep Sanctuary)'
    }
  };

  const currentEnv = envConfigs[timeOfDay];

  return (
    <div className="relative clay-card rounded-[38px] border-4 border-white shadow-2xl overflow-hidden select-none transition-all duration-700">
      {/* Dynamic Day-to-Night Background Sky & Room Ambient Aura */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentEnv.roomAura} transition-all duration-1000`} />

      {/* Time of Day Switcher Bar */}
      <div className="relative z-10 px-6 pt-5 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentEnv.sunMoonIcon}</span>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#3E291C]">
              Cozy Interactive Study Desk
            </h3>
            <span className="text-[10px] text-[#7C6353] font-bold">
              {currentEnv.label}
            </span>
          </div>
        </div>

        {/* Time Preset Buttons */}
        <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-2xl border border-white shadow-sm">
          {(['dawn', 'day', 'sunset', 'midnight'] as TimeOfDay[]).map(t => (
            <button
              key={t}
              onClick={() => {
                soundFX.playTapeClick();
                setTimeOfDay(t);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-black capitalize transition-all flex items-center gap-1 ${
                timeOfDay === t
                  ? 'bg-[#3E291C] text-amber-200 shadow-md scale-105'
                  : 'text-[#8B7768] hover:bg-black/5'
              }`}
            >
              {t === 'dawn' && <Sunrise className="w-3 h-3" />}
              {t === 'day' && <Sun className="w-3 h-3" />}
              {t === 'sunset' && <Sunset className="w-3 h-3" />}
              {t === 'midnight' && <Moon className="w-3 h-3" />}
              <span>{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2.5D Animated Study Room Scene */}
      <div className="relative p-6 sm:p-8 min-h-[340px] sm:min-h-[380px] flex flex-col justify-between overflow-hidden">
        {/* Background Arcane Window View */}
        <div className="absolute top-4 right-8 w-44 sm:w-56 h-36 sm:h-44 rounded-3xl border-4 border-[#8B6B4F] shadow-2xl overflow-hidden bg-gradient-to-b from-sky-400 to-indigo-900">
          {/* Sky Gradient */}
          <div className={`w-full h-full bg-gradient-to-b ${currentEnv.windowBackdrop} relative transition-all duration-1000`}>
            {/* Stars for Midnight / Sunset */}
            {(timeOfDay === 'midnight' || timeOfDay === 'sunset') && (
              <div className="absolute inset-0">
                <div className="absolute top-3 left-6 text-[10px] animate-ping opacity-80 text-yellow-200">✦</div>
                <div className="absolute top-8 left-20 text-xs animate-pulse opacity-90 text-white">★</div>
                <div className="absolute top-4 right-8 text-[9px] animate-pulse opacity-75 text-amber-200">✦</div>
                <div className="absolute top-12 right-16 text-[8px] animate-ping opacity-60 text-white">★</div>
                {/* Glowing Moon */}
                <div className="absolute top-4 right-5 w-8 h-8 rounded-full bg-amber-100 shadow-[0_0_20px_rgba(254,240,138,0.9)] flex items-center justify-center text-xs">
                  🌙
                </div>
              </div>
            )}

            {/* Sun for Dawn / Day */}
            {(timeOfDay === 'dawn' || timeOfDay === 'day') && (
              <div className="absolute top-4 right-6 w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.8)] animate-pulse" />
            )}

            {/* Window Grid Crossbars */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-1 bg-[#73553C]/80" />
              <div className="h-full w-1 bg-[#73553C]/80 absolute" />
            </div>
          </div>
        </div>

        {/* The "Warning" Lamp & Light Cone */}
        <div className="absolute top-6 left-8 sm:left-12 z-20">
          {/* Lamp Base & Stem */}
          <div
            onClick={handleToggleLampWarning}
            className="cursor-pointer group relative flex flex-col items-center"
            title={lampWarning ? `Magical Warning Spell Active: ${warningReason}` : "Click to test Warning Lamp spell"}
          >
            {/* Lamp Shade & Glow */}
            <div
              className={`w-14 h-12 rounded-t-full rounded-b-lg bg-gradient-to-b from-amber-600 to-amber-700 border-2 border-amber-300 shadow-xl flex items-center justify-center transition-all ${
                lampWarning ? 'animate-lamp-flicker' : 'shadow-[0_0_25px_rgba(251,191,36,0.8)]'
              }`}
            >
              <Lightbulb className={`w-6 h-6 ${lampWarning ? 'text-red-400 animate-pulse' : 'text-yellow-200'}`} />
            </div>
            {/* Lamp Stand */}
            <div className="w-2 h-14 bg-gradient-to-b from-amber-800 to-[#4A2F13] shadow" />
            <div className="w-10 h-3 rounded-full bg-[#4A2F13] border border-amber-600/40 shadow-md" />

            {/* Warning Spell Rune Banner if lamp is flickering */}
            {lampWarning && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1 whitespace-nowrap animate-bounce">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>Spell Warning!</span>
              </div>
            )}
          </div>

          {/* Warm Desk Light Cone Overlay */}
          <div
            className={`pointer-events-none absolute -top-4 -left-12 w-64 h-80 bg-gradient-to-b from-amber-300/35 via-amber-200/15 to-transparent rounded-full blur-2xl transition-opacity duration-700 ${
              lampWarning ? 'animate-lamp-flicker' : 'opacity-80'
            }`}
          />
        </div>

        {/* Center Study Table Desk Surface */}
        <div className="relative z-10 mt-28 sm:mt-24 pt-6 pb-4">
          {/* Wooden Desk Plank Top */}
          <div className={`w-full rounded-[28px] p-5 sm:p-6 bg-gradient-to-r ${currentEnv.deskWood} border-4 border-amber-900/30 shadow-[0_15px_35px_rgba(0,0,0,0.35),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-wrap items-center justify-around gap-4 text-white relative`}>
            
            {/* 1. Hot Coffee / Mana Potion Object */}
            <div
              onClick={handleCoffeeClick}
              className={`group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 active:scale-95 ${
                focusBoostActive ? 'scale-110' : ''
              }`}
            >
              {/* Coffee Mug with Steam */}
              <div className="relative">
                {/* Steam particles */}
                <div className="absolute -top-5 left-2 w-1.5 h-1.5 rounded-full bg-white/70 animate-steam-1" />
                <div className="absolute -top-7 left-4 w-2 h-2 rounded-full bg-white/60 animate-steam-2" />
                <div className="absolute -top-6 left-6 w-1.5 h-1.5 rounded-full bg-white/70 animate-steam-3" />

                <div className="w-12 h-11 rounded-2xl bg-gradient-to-b from-[#E76F51] to-[#C84B2F] border-2 border-white/60 shadow-lg flex items-center justify-center text-xl">
                  ☕
                </div>
                {/* Mug Handle */}
                <div className="absolute top-2 -right-2.5 w-3.5 h-6 rounded-r-full border-2 border-[#C84B2F] bg-transparent" />
              </div>
              <span className="mt-1.5 text-[10px] font-black uppercase tracking-wider text-amber-200 bg-black/40 px-2 py-0.5 rounded-full">
                Focus Boost
              </span>
            </div>

            {/* 2. Desk Calendar Parchment */}
            <div
              onClick={onOpenCalendar}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5E6] text-[#4A2F13] border-2 border-amber-300 shadow-lg flex flex-col items-center justify-center p-1 relative">
                <span className="text-[9px] font-black uppercase tracking-tight text-red-600">SEP 13</span>
                <span className="text-xs font-black">📅</span>
              </div>
              <span className="mt-1.5 text-[10px] font-black uppercase tracking-wider text-amber-200 bg-black/40 px-2 py-0.5 rounded-full">
                Schedule
              </span>
            </div>

            {/* 3. Boss Raid Grimoire */}
            <div
              onClick={onOpenBossRaid}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-purple-800 to-indigo-900 border-2 border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center text-xl text-yellow-300">
                ⚔️
              </div>
              <span className="mt-1.5 text-[10px] font-black uppercase tracking-wider text-purple-200 bg-black/40 px-2 py-0.5 rounded-full">
                Boss Raid
              </span>
            </div>

            {/* 4. Lo-Fi Retro Cassette Tape */}
            <div
              onClick={onToggleLoFi}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-500 to-orange-600 border-2 border-white/60 shadow-lg flex items-center justify-center text-xl">
                📻
              </div>
              <span className="mt-1.5 text-[10px] font-black uppercase tracking-wider text-amber-200 bg-black/40 px-2 py-0.5 rounded-full">
                Lo-Fi Deck
              </span>
            </div>

            {/* 5. Astral AI Crystal Orb */}
            <div
              onClick={onSummonGuildMaster}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-500 border-2 border-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.6)] flex items-center justify-center text-xl animate-pulse">
                🔮
              </div>
              <span className="mt-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-200 bg-black/40 px-2 py-0.5 rounded-full">
                Guild Master
              </span>
            </div>

            {/* 6. Gold Stash & Streak Potions */}
            <div
              onClick={onOpenRewards}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-400 to-yellow-500 border-2 border-amber-200 shadow-lg flex items-center justify-center text-xl">
                🪙
              </div>
              <span className="mt-1.5 text-[10px] font-black uppercase tracking-wider text-yellow-200 bg-black/40 px-2 py-0.5 rounded-full">
                Shop & Potions
              </span>
            </div>

          </div>
        </div>

        {/* Bottom Interactive Desk Tip Bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-bold text-[#6D5343] px-2 pt-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Hub: Click any desk relic above to trigger instant study actions</span>
          </div>
          {lampWarning && (
            <div className="text-red-600 font-black flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Warning Lamp Triggered: Check Diagnostic/Timetable!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
