import React, { useState } from 'react';
import {
  Sparkles, Save, RotateCcw, Shuffle, Check, Shield, Coins,
  Flame, Award, BookOpen, Clock, Target, User, Mail, Edit3, Crown,
  Zap, Heart, Star, CheckCircle2, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile, AvatarConfig, api } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface AvatarProfileSectionProps {
  profile: StudentProfile;
  onProfileUpdated: () => void;
}

export const AvatarProfileSection: React.FC<AvatarProfileSectionProps> = ({
  profile,
  onProfileUpdated
}) => {
  // Avatar Customizer State
  const initialConfig: AvatarConfig = profile.avatar_config || {
    hair_style: 'bun',
    hair_color: '#6B4423',
    outfit_color: '#B8A4E3',
    skin_tone: '#FFE0BD',
    headphones: 'pink',
    accessory: 'none',
    expression: 'happy',
    mascot: 'cat',
    background_aura: 'lavender'
  };

  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(initialConfig);
  const [activeCustomTab, setActiveCustomTab] = useState<'hair' | 'outfit' | 'face' | 'accessories' | 'mascot'>('hair');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Profile Info State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email || 'alex.rivers@liferpg.academy');
  const [bio, setBio] = useState(profile.bio || 'Aspiring Software Engineer & Algorithm Knight preparing for Technical Mastery.');
  const [characterClass, setCharacterClass] = useState(profile.character_class);
  const [dailyHours, setDailyHours] = useState(profile.daily_available_hours);
  const [examDate, setExamDate] = useState(profile.exam_target_date);
  const [creditBonusClaimed, setCreditBonusClaimed] = useState(false);

  // Customizer Options
  const hairStyles = [
    { id: 'bun', label: 'Top Bun', icon: '👱‍♀️' },
    { id: 'ponytail', label: 'Ponytail', icon: '💁‍♀️' },
    { id: 'wavy', label: 'Long Wavy', icon: '👩' },
    { id: 'short', label: 'Chic Short', icon: '👧' },
    { id: 'spiky', label: 'Hero Spiky', icon: '🧑' },
  ];

  const hairColors = [
    { id: '#6B4423', label: 'Chestnut', bg: '#6B4423' },
    { id: '#2A1810', label: 'Raven Black', bg: '#2A1810' },
    { id: '#E6C280', label: 'Honey Blonde', bg: '#E6C280' },
    { id: '#9B7CE3', label: 'Pastel Lilac', bg: '#9B7CE3' },
    { id: '#5A9FD4', label: 'Ocean Cyan', bg: '#5A9FD4' },
    { id: '#EB8B68', label: 'Coral Orange', bg: '#EB8B68' },
    { id: '#E1708F', label: 'Rose Pink', bg: '#E1708F' },
  ];

  const outfitColors = [
    { id: '#B8A4E3', label: 'Lavender Purple', bg: '#B8A4E3' },
    { id: '#D4E8DD', label: 'Sage Mint', bg: '#D4E8DD' },
    { id: '#FAD4C0', label: 'Soft Peach', bg: '#FAD4C0' },
    { id: '#FDECC8', label: 'Butter Yellow', bg: '#FDECC8' },
    { id: '#D0E5F5', label: 'Sky Powder Blue', bg: '#D0E5F5' },
    { id: '#EB8B68', label: 'Warm Terracotta', bg: '#EB8B68' },
    { id: '#3A3042', label: 'Midnight Obsidian', bg: '#3A3042' },
  ];

  const headphonesOptions = [
    { id: 'pink', label: 'Cute Pink', color: '#F472B6', icon: '🎧' },
    { id: 'sage', label: 'Sage Mint', color: '#6EE7B7', icon: '🎧' },
    { id: 'purple', label: 'Pastel Violet', color: '#A78BFA', icon: '🎧' },
    { id: 'gold', label: 'Scholar Gold', color: '#FBBF24', icon: '🎧' },
    { id: 'none', label: 'None', color: '#9CA3AF', icon: '🚫' },
  ];

  const accessoryOptions = [
    { id: 'none', label: 'None', icon: '🚫' },
    { id: 'glasses', label: 'Round Glasses', icon: '👓' },
    { id: 'crown', label: 'Golden Crown', icon: '👑' },
    { id: 'wizard', label: 'Wizard Hat', icon: '🧙' },
    { id: 'star_pin', label: 'Star Hairpin', icon: '⭐' },
  ];

  const expressionOptions = [
    { id: 'happy', label: 'Smiling & Sweet', emoji: '😊' },
    { id: 'focused', label: 'Deep Focus', emoji: '🧐' },
    { id: 'excited', label: 'Sparkly Excited', emoji: '🤩' },
    { id: 'chill', label: 'Chill & Relaxed', emoji: '😌' },
  ];

  const mascotOptions = [
    { id: 'cat', label: 'Kawaii Cat', emoji: '🐱' },
    { id: 'plant', label: 'Study Desk Plant', emoji: '🪴' },
    { id: 'drone', label: 'Cyber AI Drone', emoji: '🤖' },
    { id: 'owl', label: 'Wisdom Owl', emoji: '🦉' },
    { id: 'dragon', label: 'Baby Dragon', emoji: '🐲' },
  ];

  const auraOptions = [
    { id: 'lavender', label: 'Lilac Dream', gradient: 'from-[#E7E0F8] via-[#DDD5F3] to-[#D0C4EE]' },
    { id: 'mint', label: 'Sage Garden', gradient: 'from-[#E5F3EC] via-[#D3E8DC] to-[#BFDFC9]' },
    { id: 'peach', label: 'Sunset Glow', gradient: 'from-[#FEE8DC] via-[#FAD4C0] to-[#F7BFA7]' },
    { id: 'yellow', label: 'Sunny Morning', gradient: 'from-[#FEF7E5] via-[#FDECC8] to-[#F7DC9E]' },
    { id: 'cosmic', label: 'Cosmic Nebula', gradient: 'from-[#E0D7F5] via-[#C9B9EE] to-[#B39AE8]' },
  ];

  const handleRandomize = () => {
    soundFX.playCoin();
    const randomHair = hairStyles[Math.floor(Math.random() * hairStyles.length)].id;
    const randomColor = hairColors[Math.floor(Math.random() * hairColors.length)].id;
    const randomOutfit = outfitColors[Math.floor(Math.random() * outfitColors.length)].id;
    const randomHP = headphonesOptions[Math.floor(Math.random() * headphonesOptions.length)].id;
    const randomAcc = accessoryOptions[Math.floor(Math.random() * accessoryOptions.length)].id;
    const randomExp = expressionOptions[Math.floor(Math.random() * expressionOptions.length)].id;
    const randomMascot = mascotOptions[Math.floor(Math.random() * mascotOptions.length)].id;
    const randomAura = auraOptions[Math.floor(Math.random() * auraOptions.length)].id;

    setAvatarConfig({
      hair_style: randomHair,
      hair_color: randomColor,
      outfit_color: randomOutfit,
      skin_tone: '#FFE0BD',
      headphones: randomHP,
      accessory: randomAcc,
      expression: randomExp,
      mascot: randomMascot,
      background_aura: randomAura
    });
  };

  const handleSaveAvatar = async () => {
    setIsSaving(true);
    soundFX.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    try {
      await api.updateAvatar(avatarConfig);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onProfileUpdated();
    } catch (e) {
      console.error("Failed to save avatar:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfileInfo = async () => {
    soundFX.playCoin();
    try {
      await api.updateProfile({
        name,
        email,
        bio,
        character_class: characterClass,
        daily_available_hours: dailyHours,
        exam_target_date: examDate
      });
      setIsEditingInfo(false);
      onProfileUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaimDailyCredit = () => {
    if (creditBonusClaimed) return;
    soundFX.playCoin();
    confetti({ particleCount: 40, spread: 50 });
    profile.credit_points += 150;
    setCreditBonusClaimed(true);
  };

  const currentAura = auraOptions.find(a => a.id === avatarConfig.background_aura) || auraOptions[0];

  return (
    <div className="space-y-7 pb-16 select-none max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="clay-card-peach p-6 rounded-[36px] border-4 border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl text-[#8B3B1C]">
            🎨
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#3E2318] tracking-tight">
              Cartoon Avatar Studio & Scholar Identity
            </h2>
            <p className="text-xs font-semibold text-[#6E4230] mt-0.5">
              Customize your 3D cartoon avatar, inspect LifeRPG Credit Points, and manage your academic profile.
            </p>
          </div>
        </div>

        {/* Total Credit Points Pill */}
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-white shrink-0">
          <span className="text-2xl animate-bounce">💎</span>
          <div>
            <div className="text-[10px] font-bold text-[#8B7E74]">LifeRPG Credit Points</div>
            <div className="text-base font-black text-[#2E241E]">{profile.credit_points || 1450} CREDITS</div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Section: 3D Cartoon Avatar Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Live 3D Cartoon Avatar Preview Card */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="clay-card p-6 rounded-[40px] border-4 border-white flex flex-col items-center justify-between relative overflow-hidden shadow-xl">
            {/* Background Studio Aura */}
            <div className={`absolute inset-0 bg-gradient-to-b ${currentAura.gradient} opacity-90 transition-all duration-700`} />

            {/* Top Badge */}
            <div className="relative z-10 w-full flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/90 text-[#3E2318] text-[11px] font-black shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EB8B68]" />
                <span>3D Live Cartoon Preview</span>
              </span>

              <div className="px-3 py-1 rounded-full bg-[#EB8B68] text-white text-[11px] font-black shadow-sm">
                {profile.rank}-Rank Scholar
              </div>
            </div>

            {/* Rendered 3D Cartoon Character Canvas */}
            <div className="relative z-10 my-8 w-64 h-80 flex flex-col items-center justify-center animate-float-slow">
              {/* Mascot Floating Beside Character */}
              <div className="absolute -top-3 -right-2 text-4xl p-2 rounded-2xl bg-white/80 border-2 border-white shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
                {mascotOptions.find(m => m.id === avatarConfig.mascot)?.emoji || '🐱'}
              </div>

              {/* Character Head Accessories (Hat / Crown / Star Pin) */}
              {avatarConfig.accessory === 'crown' && (
                <div className="text-3xl -mb-4 z-30 animate-pulse">👑</div>
              )}
              {avatarConfig.accessory === 'wizard' && (
                <div className="text-4xl -mb-6 z-30 transform -rotate-12">🧙</div>
              )}
              {avatarConfig.accessory === 'star_pin' && (
                <div className="absolute top-6 right-16 text-xl z-30">⭐</div>
              )}

              {/* Hair Top / Bun */}
              {avatarConfig.hair_style === 'bun' && (
                <div
                  className="w-16 h-16 rounded-full border-4 border-black/20 shadow-md absolute top-2 left-24 z-10"
                  style={{ backgroundColor: avatarConfig.hair_color }}
                />
              )}
              {avatarConfig.hair_style === 'ponytail' && (
                <div
                  className="w-10 h-24 rounded-full border-3 border-black/20 shadow-md absolute top-6 -right-1 z-0 transform rotate-45"
                  style={{ backgroundColor: avatarConfig.hair_color }}
                />
              )}

              {/* Face Container */}
              <div
                className="w-28 h-28 rounded-full border-2 border-[#F3C89B] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center z-20"
                style={{ backgroundColor: avatarConfig.skin_tone }}
              >
                {/* Front Hair Strands */}
                <div
                  className="absolute top-0 inset-x-0 h-10 rounded-b-3xl"
                  style={{ backgroundColor: avatarConfig.hair_color }}
                />

                {/* Eyes & Glasses */}
                <div className="flex gap-6 mt-4 z-20 relative">
                  {avatarConfig.accessory === 'glasses' && (
                    <div className="absolute -top-1 -inset-x-3 h-6 border-2 border-[#4A2D1A] rounded-full flex items-center justify-around px-1 bg-white/20">
                      <div className="w-5 h-5 rounded-full border-2 border-[#4A2D1A]" />
                      <div className="w-5 h-5 rounded-full border-2 border-[#4A2D1A]" />
                    </div>
                  )}
                  {/* Eye 1 */}
                  <div className="w-4 h-4 rounded-full bg-[#2A1810] border-2 border-[#4A2D1A] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white -mt-1 -ml-1" />
                  </div>
                  {/* Eye 2 */}
                  <div className="w-4 h-4 rounded-full bg-[#2A1810] border-2 border-[#4A2D1A] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white -mt-1 -ml-1" />
                  </div>
                </div>

                {/* Rosy Cheeks */}
                <div className="flex justify-between w-20 px-2 mt-1.5 z-10">
                  <div className="w-3.5 h-2 rounded-full bg-pink-400/50 blur-[1px]" />
                  <div className="w-3.5 h-2 rounded-full bg-pink-400/50 blur-[1px]" />
                </div>

                {/* Facial Expression Smile */}
                {avatarConfig.expression === 'happy' && (
                  <div className="w-4 h-2 rounded-b-full border-b-2 border-[#8B4513] z-10 mt-0.5" />
                )}
                {avatarConfig.expression === 'excited' && (
                  <div className="w-5 h-3 rounded-b-full bg-[#D97706] border border-[#8B4513] z-10 mt-0.5" />
                )}
                {avatarConfig.expression === 'focused' && (
                  <div className="w-3.5 h-0.5 bg-[#8B4513] z-10 mt-1" />
                )}
                {avatarConfig.expression === 'chill' && (
                  <div className="w-4 h-1.5 rounded-b-full border-b-2 border-[#8B4513] z-10 mt-0.5 transform rotate-6" />
                )}
              </div>

              {/* Headphones Overlay */}
              {avatarConfig.headphones !== 'none' && (
                <div className="absolute top-6 inset-x-8 h-20 flex items-center justify-between z-30 pointer-events-none">
                  <div
                    className="w-7 h-12 rounded-2xl border-2 border-white shadow-lg"
                    style={{
                      backgroundColor:
                        avatarConfig.headphones === 'pink' ? '#F472B6' :
                        avatarConfig.headphones === 'sage' ? '#6EE7B7' :
                        avatarConfig.headphones === 'purple' ? '#A78BFA' : '#FBBF24'
                    }}
                  />
                  <div
                    className="w-7 h-12 rounded-2xl border-2 border-white shadow-lg"
                    style={{
                      backgroundColor:
                        avatarConfig.headphones === 'pink' ? '#F472B6' :
                        avatarConfig.headphones === 'sage' ? '#6EE7B7' :
                        avatarConfig.headphones === 'purple' ? '#A78BFA' : '#FBBF24'
                    }}
                  />
                </div>
              )}

              {/* Character Hoodie Torso */}
              <div
                className="w-36 h-36 rounded-t-3xl rounded-b-2xl border-4 border-white/80 shadow-2xl relative flex flex-col items-center -mt-2 z-10"
                style={{ backgroundColor: avatarConfig.outfit_color }}
              >
                {/* White Hoodie Strings */}
                <div className="flex gap-4 mt-2">
                  <div className="w-1.5 h-8 bg-white rounded-full shadow-sm" />
                  <div className="w-1.5 h-8 bg-white rounded-full shadow-sm" />
                </div>
                {/* Crest Emblem on Hoodie */}
                <div className="w-8 h-8 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center text-xs mt-1">
                  🎓
                </div>
              </div>

              {/* White Joggers */}
              <div className="w-28 h-20 bg-white rounded-b-2xl shadow-md flex justify-between px-3 -mt-1 z-0">
                <div className="w-10 h-full bg-[#F3F4F6] rounded-b-xl border border-slate-200" />
                <div className="w-10 h-full bg-[#F3F4F6] rounded-b-xl border border-slate-200" />
              </div>
            </div>

            {/* Bottom Controls (Randomize & Save) */}
            <div className="relative z-10 w-full flex items-center gap-3 pt-3 border-t border-white/60">
              <button
                onClick={handleRandomize}
                className="flex-1 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-[#3E2318] text-xs font-black border-2 border-white shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Shuffle className="w-4 h-4 text-[#EB8B68]" />
                <span>Randomize</span>
              </button>

              <button
                disabled={isSaving}
                onClick={handleSaveAvatar}
                className="flex-1 clay-button-peach py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Avatar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Customization Controls Panel */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="clay-card p-6 sm:p-7 rounded-[40px] border-4 border-white flex-1 space-y-5">
            {/* Customizer Sub-tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'hair', label: '💇‍♀️ Hair & Color' },
                { id: 'outfit', label: '👕 Hoodie & Outfit' },
                { id: 'face', label: '😊 Face & Mood' },
                { id: 'accessories', label: '🎧 Headset & Acc' },
                { id: 'mascot', label: '🪴 Mascot & Aura' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFX.playCoin();
                    setActiveCustomTab(tab.id as any);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                    activeCustomTab === tab.id
                      ? 'bg-[#EB8B68] text-white shadow-sm scale-[1.02]'
                      : 'bg-[#F9F5EE] text-[#6E5D50] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Hair Style & Colors */}
            {activeCustomTab === 'hair' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-[#5C5046] block uppercase mb-2">
                    Hair Style:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {hairStyles.map(h => (
                      <button
                        key={h.id}
                        onClick={() => {
                          soundFX.playCoin();
                          setAvatarConfig(prev => ({ ...prev, hair_style: h.id }));
                        }}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                          avatarConfig.hair_style === h.id
                            ? 'bg-[#FAD4C0] border-[#EB8B68] shadow-sm scale-105'
                            : 'bg-[#FAF6F0] border-[#EDE5DA] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        <span className="text-2xl">{h.icon}</span>
                        <span className="text-[10px] font-bold text-[#2E241E]">{h.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-[#5C5046] block uppercase mb-2">
                    Hair Color:
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {hairColors.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          soundFX.playCoin();
                          setAvatarConfig(prev => ({ ...prev, hair_color: c.id }));
                        }}
                        className={`w-10 h-10 rounded-2xl border-3 transition-transform flex items-center justify-center ${
                          avatarConfig.hair_color === c.id ? 'border-[#EB8B68] scale-110 shadow-md' : 'border-white'
                        }`}
                        style={{ backgroundColor: c.bg }}
                        title={c.label}
                      >
                        {avatarConfig.hair_color === c.id && <Check className="w-4 h-4 text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Outfit Color */}
            {activeCustomTab === 'outfit' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-[#5C5046] block uppercase mb-2">
                    Study Hoodie Color:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {outfitColors.map(o => (
                      <button
                        key={o.id}
                        onClick={() => {
                          soundFX.playCoin();
                          setAvatarConfig(prev => ({ ...prev, outfit_color: o.id }));
                        }}
                        className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all ${
                          avatarConfig.outfit_color === o.id
                            ? 'bg-[#FAD4C0] border-[#EB8B68] shadow-sm scale-105'
                            : 'bg-[#FAF6F0] border-[#EDE5DA]'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: o.bg }} />
                        <span className="text-[11px] font-bold text-[#2E241E] truncate">{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Face & Expressions */}
            {activeCustomTab === 'face' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-[#5C5046] block uppercase mb-2">
                    Facial Expression:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {expressionOptions.map(e => (
                      <button
                        key={e.id}
                        onClick={() => {
                          soundFX.playCoin();
                          setAvatarConfig(prev => ({ ...prev, expression: e.id }));
                        }}
                        className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          avatarConfig.expression === e.id
                            ? 'bg-[#FAD4C0] border-[#EB8B68] shadow-sm scale-105'
                            : 'bg-[#FAF6F0] border-[#EDE5DA]'
                        }`}
                      >
                        <span className="text-3xl">{e.emoji}</span>
                        <span className="text-[11px] font-bold text-[#2E241E]">{e.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Headphones & Accessories */}
            {activeCustomTab === 'accessories' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-[#5C5046] block uppercase mb-2">
                    Headphones Style:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {headphonesOptions.map(h => (
                      <button
                        key={h.id}
                        onClick={() => {
                          soundFX.playCoin();
                          setAvatarConfig(prev => ({ ...prev, headphones: h.id }));
                        }}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                          avatarConfig.headphones === h.id
                            ? 'bg-[#FAD4C0] border-[#EB8B68] shadow-sm scale-105'
                            : 'bg-[#FAF6F0] border-[#EDE5DA]'
                        }`}
                      >
                        <span className="text-2xl">{h.icon}</span>
                        <span className="text-[10px] font-bold text-[#2E241E]">{h.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-[#5C5046] block uppercase mb-2">
                    Head Accessory / Props:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {accessoryOptions.map(a => (
                      <button
                        key={a.id}
                        onClick={() => {
                          soundFX.playCoin();
                          setAvatarConfig(prev => ({ ...prev, accessory: a.id }));
                        }}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                          avatarConfig.accessory === a.id
                            ? 'bg-[#FAD4C0] border-[#EB8B68] shadow-sm scale-105'
                            : 'bg-[#FAF6F0] border-[#EDE5DA]'
                        }`}
                      >
                        <span className="text-2xl">{a.icon}</span>
                        <span className="text-[10px] font-bold text-[#2E241E]">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Mascot Companion & Background Aura */}
            {activeCustomTab === 'mascot' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-[#5C5046] block uppercase mb-2">
                    Companion Mascot:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {mascotOptions.map(m => (
                      <button
                        key={m.id}
                        onClick={() => {
                          soundFX.playCoin();
                          setAvatarConfig(prev => ({ ...prev, mascot: m.id }));
                        }}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                          avatarConfig.mascot === m.id
                            ? 'bg-[#FAD4C0] border-[#EB8B68] shadow-sm scale-105'
                            : 'bg-[#FAF6F0] border-[#EDE5DA]'
                        }`}
                      >
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="text-[10px] font-bold text-[#2E241E]">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-[#5C5046] block uppercase mb-2">
                    Studio Background Aura:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {auraOptions.map(a => (
                      <button
                        key={a.id}
                        onClick={() => {
                          soundFX.playCoin();
                          setAvatarConfig(prev => ({ ...prev, background_aura: a.id }));
                        }}
                        className={`p-3 rounded-2xl border-2 flex items-center gap-2 transition-all ${
                          avatarConfig.background_aura === a.id
                            ? 'bg-[#FAD4C0] border-[#EB8B68] shadow-sm scale-105'
                            : 'bg-[#FAF6F0] border-[#EDE5DA]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${a.gradient} border border-black/10 shrink-0`} />
                        <span className="text-[11px] font-bold text-[#2E241E] truncate">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Credit Points & Gamified Economy Section */}
      <div className="clay-card-yellow p-7 sm:p-8 rounded-[40px] border-4 border-white space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F5D89A]">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💎</span>
            <div>
              <h3 className="text-lg font-black text-[#42310A]">
                LifeRPG Credit Points & Scholar Economy
              </h3>
              <p className="text-xs font-semibold text-[#735A22]">
                Accumulate credits through flawless diagnostic assessments and continuous study streaks.
              </p>
            </div>
          </div>

          {/* Daily Credit Claim Button */}
          <button
            disabled={creditBonusClaimed}
            onClick={handleClaimDailyCredit}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all ${
              creditBonusClaimed
                ? 'bg-[#D4E8DD] text-[#2D5A42] cursor-default'
                : 'clay-button-peach active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{creditBonusClaimed ? '✓ Daily Bonus Claimed' : 'Claim +150 Daily Check-In Credits'}</span>
          </button>
        </div>

        {/* 4 Economy Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white shadow-sm border border-white space-y-1">
            <div className="text-[10px] font-bold text-[#8B7E74] uppercase">Total Balance</div>
            <div className="text-2xl font-black text-[#D35B30]">{profile.credit_points || 1450} 💎</div>
            <div className="text-[10px] font-bold text-emerald-600">+150 earned today</div>
          </div>

          <div className="p-4 rounded-3xl bg-white shadow-sm border border-white space-y-1">
            <div className="text-[10px] font-bold text-[#8B7E74] uppercase">Gold Stash</div>
            <div className="text-2xl font-black text-[#735A22]">{profile.gold} 🪙</div>
            <div className="text-[10px] font-bold text-[#7C5A14]">Redeemable in Shop</div>
          </div>

          <div className="p-4 rounded-3xl bg-white shadow-sm border border-white space-y-1">
            <div className="text-[10px] font-bold text-[#8B7E74] uppercase">Streak Multiplier</div>
            <div className="text-2xl font-black text-[#2C5D83]">{(1.0 + (profile?.streak_days ?? 1) * 0.1).toFixed(1)}x 🔥</div>
            <div className="text-[10px] font-bold text-[#446580]">{profile?.streak_days ?? 1}-Day Streak Bonus</div>
          </div>

          <div className="p-4 rounded-3xl bg-white shadow-sm border border-white space-y-1">
            <div className="text-[10px] font-bold text-[#8B7E74] uppercase">Scholar Level XP</div>
            <div className="text-2xl font-black text-[#5E3EA8]">{profile.xp} / {profile.next_level_xp}</div>
            <div className="text-[10px] font-bold text-[#8B6FCE]">Lvl {profile.level} {profile.title}</div>
          </div>
        </div>
      </div>

      {/* 4. Detailed User Identity & Academic Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile Details Form */}
        <div className="lg:col-span-2 clay-card p-7 sm:p-8 rounded-[40px] border-4 border-white space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE2]">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-[#EB8B68]" />
              <h3 className="font-black text-base text-[#2E241E]">
                Scholar Profile & Goals
              </h3>
            </div>

            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="text-xs font-bold text-[#EB8B68] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingInfo ? 'Cancel' : 'Edit Profile Details'}</span>
            </button>
          </div>

          {isEditingInfo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#5C5046] block mb-1">Scholar Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full clay-input px-3.5 py-2 text-xs font-semibold text-[#2E241E]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5C5046] block mb-1">Email / Academy ID:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full clay-input px-3.5 py-2 text-xs font-semibold text-[#2E241E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C5046] block mb-1">Bio / Academic Mission:</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full clay-input px-3.5 py-2 text-xs font-semibold text-[#2E241E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#5C5046] block mb-1">Character Class:</label>
                  <input
                    type="text"
                    value={characterClass}
                    onChange={(e) => setCharacterClass(e.target.value)}
                    className="w-full clay-input px-3.5 py-2 text-xs font-semibold text-[#2E241E]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5C5046] block mb-1">Daily Hours (h/day):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full clay-input px-3.5 py-2 text-xs font-semibold text-[#2E241E]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5C5046] block mb-1">Target Exam Date:</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full clay-input px-3.5 py-2 text-xs font-semibold text-[#2E241E]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfileInfo}
                  className="clay-button-peach px-6 py-2.5 rounded-2xl text-xs font-black"
                >
                  Save Profile Info
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-[#FAF6F0] border border-[#EDE5DA]">
                  <div className="text-[10px] font-bold text-[#8B7E74] uppercase">Full Name</div>
                  <div className="text-sm font-black text-[#2E241E] mt-0.5">{profile.name}</div>
                  <div className="text-xs font-semibold text-[#735A22]">{profile.character_class}</div>
                </div>

                <div className="p-4 rounded-3xl bg-[#FAF6F0] border border-[#EDE5DA]">
                  <div className="text-[10px] font-bold text-[#8B7E74] uppercase">Academy Contact</div>
                  <div className="text-xs font-bold text-[#2E241E] mt-0.5">{profile.email || 'alex.rivers@liferpg.academy'}</div>
                  <div className="text-[11px] font-semibold text-[#5C9C7B]">Verified Scholar ID #7842</div>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-[#FAF6F0] border border-[#EDE5DA]">
                <div className="text-[10px] font-bold text-[#8B7E74] uppercase">Academic Mission</div>
                <p className="text-xs font-semibold text-[#5C4D41] mt-1 leading-relaxed">
                  "{profile.bio || 'Aspiring Software Engineer & Algorithm Knight preparing for Autumn 2026 Technical Mastery.'}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#D4E8DD] text-center">
                  <div className="text-[10px] font-bold text-[#4B6B59]">Diagnostic Accuracy</div>
                  <div className="text-base font-black text-[#1E3A2B] mt-0.5">{profile.diagnostic_accuracy || 78.4}%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FDECC8] text-center">
                  <div className="text-[10px] font-bold text-[#735A22]">Study Time Logged</div>
                  <div className="text-base font-black text-[#42310A] mt-0.5">{((profile.total_study_minutes || 840) / 60).toFixed(1)} hrs</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#D0E5F5] text-center">
                  <div className="text-[10px] font-bold text-[#446580]">Quests Completed</div>
                  <div className="text-base font-black text-[#1C374D] mt-0.5">{profile.quests_completed_count || 18} Quests</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Badges & Honors Gallery */}
        <div className="clay-card p-7 rounded-[40px] border-4 border-white space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#EB8B68]" />
            <h3 className="font-black text-base text-[#2E241E]">
              Scholar Badges & Honors
            </h3>
          </div>

          <div className="space-y-2.5">
            {(profile.badges || []).map((b, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#EDE5DA] flex items-center gap-3"
              >
                <span className="text-2xl p-1.5 rounded-xl bg-white shadow-sm shrink-0">{b.icon}</span>
                <div>
                  <div className="font-bold text-xs text-[#2E241E]">{b.name}</div>
                  <div className="text-[10px] font-semibold text-[#8B7E74] leading-tight">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
