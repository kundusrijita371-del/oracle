import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Sparkles, Compass, Shield, ArrowRight, BookOpen, Star } from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';

interface LoginPageProps {
  onLoginSuccess: (profile: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('Alex Rivers');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [selectedHero, setSelectedHero] = useState<string>('alex');
  const [lampGlow, setLampGlow] = useState(true);

  const heroPresets = [
    { id: 'alex', name: 'Alex Rivers', rank: 'F', class: 'Algorithm Apprentice', avatar: '⚔️' },
    { id: 'elena', name: 'Elena Rostova', rank: 'C', class: 'Systems Architect', avatar: '🛡️' },
    { id: 'kai', name: 'Kai Thorne', rank: 'A', class: 'Neural Sorcerer', avatar: '🔮' },
  ];

  const handleLogin = (e?: React.FormEvent, customHero?: { name: string; class: string }) => {
    if (e) e.preventDefault();
    soundFX.playPageFlip();
    setIsPageTurning(true);

    const chosenName = customHero?.name || username || 'Alex Rivers';
    const chosenClass = customHero?.class || (selectedHero === 'elena' ? 'Systems Architect' : selectedHero === 'kai' ? 'Neural Sorcerer' : 'Algorithm Apprentice');

    setTimeout(() => {
      onLoginSuccess({
        name: chosenName,
        character_class: chosenClass
      });
    }, 900);
  };

  const handleHeroSelect = (hero: typeof heroPresets[0]) => {
    setSelectedHero(hero.id);
    setUsername(hero.name);
    soundFX.playCoin();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#DCD4F2] text-slate-800 flex items-center justify-center p-4 sm:p-8 overflow-hidden font-inter select-none">
      {/* 3D Pastel Studio Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Lavender Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E7E0F8] via-[#DDD5F3] to-[#D0C4EE]" />

        {/* 3D Floating Clouds */}
        <div className="absolute top-10 left-[10%] w-36 h-20 bg-white/90 rounded-full blur-[1px] shadow-[0_15px_30px_rgba(150,130,210,0.2)] animate-float-slow">
          <div className="absolute -top-7 left-6 w-20 h-20 bg-white/90 rounded-full" />
          <div className="absolute -top-4 right-4 w-16 h-16 bg-white/90 rounded-full" />
        </div>

        <div className="absolute top-20 right-[15%] w-44 h-24 bg-white/85 rounded-full blur-[1px] shadow-[0_15px_30px_rgba(150,130,210,0.2)] animate-float-slow" style={{ animationDelay: '1.5s' }}>
          <div className="absolute -top-9 left-8 w-24 h-24 bg-white/85 rounded-full" />
          <div className="absolute -top-5 right-6 w-18 h-18 bg-white/85 rounded-full" />
        </div>

        {/* Hanging 3D Lamp on Top Right */}
        <div
          onClick={() => { setLampGlow(!lampGlow); soundFX.playAlert(); }}
          className="absolute top-0 right-[22%] pointer-events-auto cursor-pointer flex flex-col items-center group z-10"
          title="Click to toggle Lamp Light"
        >
          <div className="w-1 h-28 bg-[#8F7EB6] shadow-sm" />
          <div className="relative">
            <div className={`w-14 h-12 rounded-t-full bg-gradient-to-b from-[#A592D0] to-[#8C76BE] border-b-4 border-[#765FA8] shadow-lg transition-all ${
              lampGlow ? 'shadow-[0_15px_40px_rgba(255,230,150,0.8)]' : ''
            }`}>
              <div className="absolute -bottom-2 inset-x-2 h-3 rounded-full bg-amber-100/90 shadow-md flex items-center justify-center">
                <div className="w-4 h-1.5 rounded-full bg-amber-300" />
              </div>
            </div>
            {/* Lamp Light Beam */}
            {lampGlow && (
              <div className="absolute top-10 -left-16 w-48 h-72 bg-gradient-to-b from-amber-100/40 via-amber-200/10 to-transparent clip-path-lamp pointer-events-none blur-sm" />
            )}
          </div>
        </div>

        {/* 3D Bookshelf on Right */}
        <div className="absolute top-36 right-8 hidden xl:flex flex-col items-center">
          <div className="w-40 h-28 bg-[#C8B8E6]/60 rounded-2xl border-4 border-white/60 p-3 flex items-end justify-between shadow-[0_12px_25px_rgba(140,115,190,0.2)]">
            <div className="flex items-end gap-1.5">
              <div className="w-4 h-16 bg-[#FCA5A5] rounded-t-md shadow-sm transform -rotate-6" />
              <div className="w-4 h-20 bg-[#93C5FD] rounded-t-md shadow-sm" />
              <div className="w-4 h-14 bg-[#FDE047] rounded-t-md shadow-sm" />
            </div>
            {/* Cute Kawaii Cat / Mascot on Shelf */}
            <div className="w-10 h-10 rounded-full bg-[#FCE7F3] border-2 border-pink-300 flex items-center justify-center text-xs shadow-md relative">
              <div className="absolute -top-1 left-1.5 w-2 h-2 bg-pink-300 rotate-45" />
              <div className="absolute -top-1 right-1.5 w-2 h-2 bg-pink-300 rotate-45" />
              <span>🐱</span>
            </div>
          </div>
          <div className="w-48 h-3.5 bg-gradient-to-r from-[#D5A77B] to-[#B88755] rounded-full shadow-md mt-1" />
        </div>

        {/* 3D Potted Plant on Wooden Stand (Bottom Right) */}
        <div className="absolute bottom-6 right-16 hidden lg:flex flex-col items-center z-10">
          <div className="text-4xl filter drop-shadow-md animate-float-slow" style={{ animationDelay: '0.8s' }}>
            🪴
          </div>
          <div className="w-14 h-10 rounded-b-2xl bg-gradient-to-b from-[#C4B5FD] to-[#A78BFA] border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold">
            ORACLE
          </div>
          <div className="w-16 h-3 bg-[#C89B6A] rounded-full shadow-sm mt-0.5" />
          <div className="flex justify-between w-12 -mt-0.5">
            <div className="w-1.5 h-6 bg-[#A77B4D] rounded-b-sm" />
            <div className="w-1.5 h-6 bg-[#A77B4D] rounded-b-sm" />
          </div>
        </div>

        {/* 3D Floor Podium */}
        <div className="absolute -bottom-24 inset-x-[-10%] h-64 bg-gradient-to-t from-[#BFAFE2] via-[#CBBDEB] to-[#DDD5F3] rounded-[100%] shadow-[inset_0_20px_40px_rgba(255,255,255,0.7)]" />
      </div>

      {/* Main Interactive Scene Container */}
      <div className={`relative z-20 flex items-center justify-center max-w-5xl w-full mx-auto transition-all duration-1000 ${
        isPageTurning ? 'book-page-turning' : ''
      }`}>
        {/* Left Side: 3D Cute Avatar Character Leaning on Card */}
        <div className="relative hidden md:flex flex-col items-center -mr-14 z-20 pointer-events-none">
          {/* 3D Character Illustration Container */}
          <div className="relative w-72 h-[480px] flex items-end justify-center">
            {/* Embedded 3D Character matching Pinterest Reference */}
            <img
              src="/login-ref.jpg"
              alt="3D Study Companion Character"
              className="absolute inset-0 w-full h-full object-cover object-left rounded-3xl opacity-0"
            />
            {/* Rendered 3D Clay Character Visual */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Cute Cartoon Character Head & Hair Bun */}
              <div className="relative">
                {/* Hair Bun */}
                <div className="w-16 h-16 rounded-full bg-[#6B4423] border-4 border-[#543315] shadow-lg absolute -top-8 left-6" />
                {/* Face */}
                <div className="w-28 h-28 rounded-full bg-[#FFE0BD] border-2 border-[#F3C89B] shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
                  {/* Hair Strands Front */}
                  <div className="absolute top-0 inset-x-0 h-10 bg-[#6B4423] rounded-b-3xl" />
                  {/* Cute Eyes */}
                  <div className="flex gap-6 mt-3 z-10">
                    <div className="w-4 h-4 rounded-full bg-[#2A1810] border-2 border-[#4A2D1A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white -mt-1 -ml-1" />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#2A1810] border-2 border-[#4A2D1A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white -mt-1 -ml-1" />
                    </div>
                  </div>
                  {/* Rosy Cheeks */}
                  <div className="flex justify-between w-20 px-2 mt-1 z-10">
                    <div className="w-3.5 h-2 rounded-full bg-pink-400/50 blur-[1px]" />
                    <div className="w-3.5 h-2 rounded-full bg-pink-400/50 blur-[1px]" />
                  </div>
                  {/* Sweet Smile */}
                  <div className="w-4 h-2 rounded-b-full border-b-2 border-[#8B4513] z-10 mt-0.5" />
                </div>
              </div>

              {/* Purple Hoodie Torso */}
              <div className="w-32 h-36 bg-gradient-to-b from-[#B8A4E3] to-[#9D86D4] rounded-t-3xl rounded-b-xl border-4 border-white/60 shadow-2xl relative flex flex-col items-center">
                {/* White Hoodie Drawstrings */}
                <div className="flex gap-4 mt-2">
                  <div className="w-1 h-8 bg-white rounded-full shadow-sm" />
                  <div className="w-1 h-8 bg-white rounded-full shadow-sm" />
                </div>
                {/* Hands Peeking over the Login Box */}
                <div className="absolute -right-4 top-10 w-8 h-8 rounded-full bg-[#FFE0BD] border-2 border-[#F3C89B] shadow-md z-30" />
              </div>

              {/* White Joggers */}
              <div className="w-24 h-28 bg-white rounded-b-2xl shadow-xl flex justify-between px-2 -mt-1">
                <div className="w-9 h-full bg-[#F3F4F6] rounded-b-xl border border-slate-200" />
                <div className="w-9 h-full bg-[#F3F4F6] rounded-b-xl border border-slate-200" />
              </div>

              {/* Purple Sneakers */}
              <div className="flex gap-4 -mt-2">
                <div className="w-12 h-6 rounded-full bg-[#A78BFA] border-2 border-white shadow-md flex items-center justify-center text-[8px] font-bold text-white">
                  👟
                </div>
                <div className="w-12 h-6 rounded-full bg-[#A78BFA] border-2 border-white shadow-md flex items-center justify-center text-[8px] font-bold text-white">
                  👟
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Soft 3D White Claymorphic Phone/Card Container */}
        <div className="relative z-10 w-full max-w-[420px]">
          <div className="bg-white rounded-[44px] p-8 sm:p-9 shadow-[0_30px_70px_rgba(110,80,180,0.22),0_10px_25px_rgba(0,0,0,0.06)] border-4 border-white relative overflow-hidden">
            
            {/* Top 3D App Icon / Badge with Golden Stars */}
            <div className="flex flex-col items-center justify-center mb-5">
              <div className="relative">
                {/* 3D Purple Squircle Icon */}
                <div className="w-20 h-20 rounded-[26px] bg-gradient-to-br from-[#B39AE8] via-[#9B7CE3] to-[#8765D8] flex items-center justify-center shadow-[0_12px_30px_rgba(140,105,220,0.45),inset_0_4px_8px_rgba(255,255,255,0.6)] border-2 border-white/50 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl text-white filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]">
                      🎵
                    </span>
                  </div>
                </div>

                {/* 3D Golden Star Accents */}
                <div className="absolute -top-1 -right-2 text-amber-300 text-lg filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)] animate-pulse">
                  ★
                </div>
                <div className="absolute bottom-2 -right-3 text-pink-300 text-sm filter drop-shadow-sm">
                  ✦
                </div>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-[26px] font-bold text-[#2E244B] mt-4 tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-xs font-medium text-[#7D7595] mt-1">
                Please login to continue
              </p>
            </div>

            {/* Quick 1-Click Hero Selector Pill Tabs */}
            <div className="mb-4 bg-[#F4F1FB] p-1 rounded-2xl flex items-center justify-between border border-[#E9E2F8]">
              {heroPresets.map(h => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => handleHeroSelect(h)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    selectedHero === h.id
                      ? 'bg-white text-[#7C5CC9] shadow-[0_3px_10px_rgba(124,92,201,0.2)] scale-[1.02]'
                      : 'text-[#8E86A8] hover:text-[#5E4C8D]'
                  }`}
                >
                  <span>{h.avatar}</span>
                  <span className="truncate">{h.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Username Input Pill */}
              <div className="relative flex items-center">
                <div className="absolute left-4.5 text-[#9B8EB8] pointer-events-none">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username / Email"
                  className="w-full h-13 pl-12 pr-4 bg-[#F4F1FB] hover:bg-[#EFEAF9] focus:bg-white text-sm font-semibold text-[#372C54] placeholder-[#A9A0C2] rounded-2xl border border-transparent focus:border-[#B197E6] focus:outline-none focus:shadow-[0_0_0_4px_rgba(177,151,230,0.15)] transition-all"
                  required
                />
              </div>

              {/* Password Input Pill */}
              <div className="relative flex items-center">
                <div className="absolute left-4.5 text-[#9B8EB8] pointer-events-none">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-13 pl-12 pr-12 bg-[#F4F1FB] hover:bg-[#EFEAF9] focus:bg-white text-sm font-semibold text-[#372C54] placeholder-[#A9A0C2] rounded-2xl border border-transparent focus:border-[#B197E6] focus:outline-none focus:shadow-[0_0_0_4px_rgba(177,151,230,0.15)] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#9B8EB8] hover:text-[#6D54A8] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => soundFX.playAlert()}
                  className="text-[11px] font-semibold text-[#7C5CC9] hover:text-[#5E3EA8] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* 3D Main Soft Purple Login Button */}
              <button
                type="submit"
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#A78BFA] via-[#936DE3] to-[#8054D6] hover:from-[#9D7DF5] hover:to-[#7445D1] text-white font-bold text-sm shadow-[0_10px_25px_rgba(147,109,227,0.45),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Social Login Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="h-px bg-[#E5DEFA] w-full" />
                <span className="px-3 bg-white text-[11px] font-semibold text-[#968EAA] whitespace-nowrap">
                  or continue with
                </span>
                <div className="h-px bg-[#E5DEFA] w-full" />
              </div>

              {/* Social Round Buttons (Google, Apple, Facebook) */}
              <div className="flex items-center justify-center gap-4">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleLogin(undefined, { name: 'Google Explorer', class: 'Algorithm Apprentice' })}
                  className="w-12 h-12 rounded-full bg-white border border-[#EBE4F8] shadow-[0_6px_16px_rgba(150,130,210,0.15)] hover:shadow-[0_8px_20px_rgba(150,130,210,0.25)] flex items-center justify-center hover:scale-105 transition-all"
                  title="Login with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleLogin(undefined, { name: 'Apple Scholar', class: 'Systems Architect' })}
                  className="w-12 h-12 rounded-full bg-white border border-[#EBE4F8] shadow-[0_6px_16px_rgba(150,130,210,0.15)] hover:shadow-[0_8px_20px_rgba(150,130,210,0.25)] flex items-center justify-center hover:scale-105 transition-all text-slate-900"
                  title="Login with Apple"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.96-14.42-7.07-10.88-12.35-23.01-15.82-36.39-3.48-13.38-5.22-25.77-5.22-37.17 0-16.1 4.13-29.47 12.38-40.11 8.26-10.65 18.71-16.14 31.37-16.48 4.9.11 10.4 1.34 16.51 3.69 6.1 2.34 10.1 3.59 12 3.73 2.23-.37 6.44-1.74 12.63-4.11 6.19-2.37 11.66-3.41 16.42-3.12 11.64.65 21.2 4.47 28.67 11.46 7.47 6.99 12.44 15.65 14.92 25.99-10.45 6.32-15.58 14.88-15.38 25.68.2 10.58 4.67 19.38 13.41 26.4 4.02 3.27 8.52 5.67 13.5 7.21-1.96 5.89-4.37 11.75-7.23 17.58zm-32.06-118.89c.11 3.59-.83 7.24-2.82 10.95-1.99 3.7-4.63 6.97-7.92 9.8-3.17 2.62-6.62 4.54-10.35 5.76-3.73 1.22-7.29 1.76-10.68 1.63-.22-3.38.83-6.91 3.15-10.6 2.33-3.69 5.09-6.9 8.28-9.63 3.39-2.83 6.97-4.91 10.74-6.24 3.78-1.32 7-1.88 9.6-1.67z"/>
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleLogin(undefined, { name: 'Meta Scholar', class: 'Neural Sorcerer' })}
                  className="w-12 h-12 rounded-full bg-white border border-[#EBE4F8] shadow-[0_6px_16px_rgba(150,130,210,0.15)] hover:shadow-[0_8px_20px_rgba(150,130,210,0.25)] flex items-center justify-center hover:scale-105 transition-all text-[#1877F2]"
                  title="Login with Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>

              {/* Sign Up Footer */}
              <div className="text-center pt-2">
                <p className="text-xs text-[#7D7595] font-medium">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleLogin(undefined, { name: 'New Hero', class: 'Algorithm Apprentice' })}
                    className="font-bold text-[#7C5CC9] hover:text-[#5E3EA8] hover:underline transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
