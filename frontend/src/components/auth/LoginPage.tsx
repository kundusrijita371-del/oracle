import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';
import { loginWithEmail, registerWithEmail, loginWithGoogle, fetchUserProfileFromFirestore } from '../../services/firebase';

interface LoginPageProps {
  onLoginSuccess: (profile: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('scholar@oracle.ai');
  const [displayName, setDisplayName] = useState('Alex Rivers');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedHero, setSelectedHero] = useState<string>('alex');
  const [lampGlow, setLampGlow] = useState(true);

  const heroPresets = [
    { id: 'alex', name: 'Alex Rivers', email: 'alex@oracle.ai', rank: 'F', class: 'Algorithm Apprentice', avatar: '⚔️' },
    { id: 'elena', name: 'Elena Rostova', email: 'elena@oracle.ai', rank: 'C', class: 'Systems Architect', avatar: '🛡️' },
    { id: 'kai', name: 'Kai Thorne', email: 'kai@oracle.ai', rank: 'A', class: 'Neural Sorcerer', avatar: '🔮' },
  ];

  const handleHeroSelect = (hero: typeof heroPresets[0]) => {
    setSelectedHero(hero.id);
    setDisplayName(hero.name);
    setEmail(hero.email);
    setPassword('password123');
    setErrorMessage(null);
    soundFX.playCoin();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      soundFX.playPageFlip();
      let firebaseUser;
      if (isSignUp) {
        firebaseUser = await registerWithEmail(email, password, displayName);
      } else {
        firebaseUser = await loginWithEmail(email, password);
      }

      // Fetch or assemble student profile
      const firestoreProfile = await fetchUserProfileFromFirestore(firebaseUser.uid);
      
      const profileToUse = firestoreProfile || {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || displayName || email.split('@')[0],
        email: firebaseUser.email || email,
        character_class: selectedHero === 'elena' ? 'Systems Architect' : selectedHero === 'kai' ? 'Neural Sorcerer' : 'Algorithm Apprentice',
        rank: 'F',
        level: 1,
        xp: 0,
        gold: 150
      };

      setTimeout(() => {
        onLoginSuccess(profileToUse);
      }, 500);
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = "Authentication failed. Please check your credentials.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = "Invalid email or password. If new, click 'Sign Up' below.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "Email is already registered. Please log in.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      } else if (err.message) {
        message = err.message;
      }
      setErrorMessage(message);
      soundFX.playAlert();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      soundFX.playPageFlip();
      const user = await loginWithGoogle();
      const firestoreProfile = await fetchUserProfileFromFirestore(user.uid);
      
      const profileToUse = firestoreProfile || {
        id: user.uid,
        name: user.displayName || 'Google Scholar',
        email: user.email || '',
        character_class: 'Neural Sorcerer',
        rank: 'F',
        level: 1,
        xp: 0,
        gold: 150
      };

      setTimeout(() => {
        onLoginSuccess(profileToUse);
      }, 500);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setErrorMessage(err.message || "Google sign-in was cancelled or encountered an error.");
      soundFX.playAlert();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestDemo = () => {
    soundFX.playPageFlip();
    const hero = heroPresets.find(h => h.id === selectedHero) || heroPresets[0];
    onLoginSuccess({
      id: `guest-${selectedHero}`,
      name: hero.name,
      character_class: hero.class,
      rank: hero.rank,
      level: 1,
      xp: 120,
      gold: 250
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#DCD4F2] text-slate-800 flex items-center justify-center p-4 sm:p-8 overflow-hidden font-inter select-none">
      {/* 3D Pastel Studio Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
            {lampGlow && (
              <div className="absolute top-10 -left-16 w-48 h-72 bg-gradient-to-b from-amber-100/40 via-amber-200/10 to-transparent pointer-events-none blur-sm" />
            )}
          </div>
        </div>

        {/* 3D Floor Podium */}
        <div className="absolute -bottom-24 inset-x-[-10%] h-64 bg-gradient-to-t from-[#BFAFE2] via-[#CBBDEB] to-[#DDD5F3] rounded-[100%] shadow-[inset_0_20px_40px_rgba(255,255,255,0.7)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-20 flex items-center justify-center max-w-5xl w-full mx-auto">
        
        {/* Left Side: 3D Cute Avatar Character Leaning on Card */}
        <div className="relative hidden md:flex flex-col items-center -mr-14 z-20 pointer-events-none">
          <div className="relative w-72 h-[480px] flex items-end justify-center">
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#6B4423] border-4 border-[#543315] shadow-lg absolute -top-8 left-6" />
                <div className="w-28 h-28 rounded-full bg-[#FFE0BD] border-2 border-[#F3C89B] shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute top-0 inset-x-0 h-10 bg-[#6B4423] rounded-b-3xl" />
                  <div className="flex gap-6 mt-3 z-10">
                    <div className="w-4 h-4 rounded-full bg-[#2A1810] border-2 border-[#4A2D1A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white -mt-1 -ml-1" />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#2A1810] border-2 border-[#4A2D1A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white -mt-1 -ml-1" />
                    </div>
                  </div>
                  <div className="flex justify-between w-20 px-2 mt-1 z-10">
                    <div className="w-3.5 h-2 rounded-full bg-pink-400/50 blur-[1px]" />
                    <div className="w-3.5 h-2 rounded-full bg-pink-400/50 blur-[1px]" />
                  </div>
                  <div className="w-4 h-2 rounded-b-full border-b-2 border-[#8B4513] z-10 mt-0.5" />
                </div>
              </div>

              <div className="w-32 h-36 bg-gradient-to-b from-[#B8A4E3] to-[#9D86D4] rounded-t-3xl rounded-b-xl border-4 border-white/60 shadow-2xl relative flex flex-col items-center">
                <div className="flex gap-4 mt-2">
                  <div className="w-1 h-8 bg-white rounded-full shadow-sm" />
                  <div className="w-1 h-8 bg-white rounded-full shadow-sm" />
                </div>
                <div className="absolute -right-4 top-10 w-8 h-8 rounded-full bg-[#FFE0BD] border-2 border-[#F3C89B] shadow-md z-30" />
              </div>

              <div className="w-24 h-28 bg-white rounded-b-2xl shadow-xl flex justify-between px-2 -mt-1">
                <div className="w-9 h-full bg-[#F3F4F6] rounded-b-xl border border-slate-200" />
                <div className="w-9 h-full bg-[#F3F4F6] rounded-b-xl border border-slate-200" />
              </div>

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

        {/* Center/Right: Soft 3D White Claymorphic Card Container */}
        <div className="relative z-10 w-full max-w-[440px]">
          <div className="bg-white rounded-[40px] p-7 sm:p-8 shadow-[0_30px_70px_rgba(110,80,180,0.22),0_10px_25px_rgba(0,0,0,0.06)] border-4 border-white relative overflow-hidden">
            
            {/* Top 3D App Icon / Badge with Golden Stars */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#B39AE8] via-[#9B7CE3] to-[#8765D8] flex items-center justify-center shadow-[0_10px_25px_rgba(140,105,220,0.45),inset_0_3px_6px_rgba(255,255,255,0.6)] border-2 border-white/50 transform hover:scale-105 transition-transform">
                  <span className="text-2xl text-white filter drop-shadow-sm">
                    🔮
                  </span>
                </div>
                <div className="absolute -top-1 -right-2 text-amber-300 text-base animate-pulse">
                  ★
                </div>
              </div>

              <h1 className="text-2xl font-bold text-[#2E244B] mt-3 tracking-tight">
                {isSignUp ? 'Create Scholar Account' : 'Oracle Realm Login'}
              </h1>
              <p className="text-xs font-medium text-[#7D7595] mt-0.5">
                {isSignUp ? 'Join the LifeRPG Autonomous Learning Guild' : 'Enter with Firebase Auth & Cloud Firestore'}
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-3.5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="leading-tight font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Quick 1-Click Hero Selector Pill Tabs */}
            <div className="mb-3 bg-[#F4F1FB] p-1 rounded-2xl flex items-center justify-between border border-[#E9E2F8]">
              {heroPresets.map(h => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => handleHeroSelect(h)}
                  className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
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
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              
              {isSignUp && (
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#9B8EB8] pointer-events-none">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Scholar / Adventurer Name"
                    className="w-full h-11 pl-11 pr-4 bg-[#F4F1FB] hover:bg-[#EFEAF9] focus:bg-white text-xs sm:text-sm font-semibold text-[#372C54] placeholder-[#A9A0C2] rounded-2xl border border-transparent focus:border-[#B197E6] focus:outline-none transition-all"
                    required
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#9B8EB8] pointer-events-none">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-11 pl-11 pr-4 bg-[#F4F1FB] hover:bg-[#EFEAF9] focus:bg-white text-xs sm:text-sm font-semibold text-[#372C54] placeholder-[#A9A0C2] rounded-2xl border border-transparent focus:border-[#B197E6] focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#9B8EB8] pointer-events-none">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 characters)"
                  className="w-full h-11 pl-11 pr-11 bg-[#F4F1FB] hover:bg-[#EFEAF9] focus:bg-white text-xs sm:text-sm font-semibold text-[#372C54] placeholder-[#A9A0C2] rounded-2xl border border-transparent focus:border-[#B197E6] focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#9B8EB8] hover:text-[#6D54A8] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#A78BFA] via-[#936DE3] to-[#8054D6] hover:from-[#9D7DF5] hover:to-[#7445D1] text-white font-bold text-xs sm:text-sm shadow-[0_8px_20px_rgba(147,109,227,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 mt-1"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Firebase Account' : 'Authenticate & Enter'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Social Login Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="h-px bg-[#E5DEFA] w-full" />
                <span className="px-3 bg-white text-[10px] font-semibold text-[#968EAA] whitespace-nowrap">
                  or sign in with
                </span>
                <div className="h-px bg-[#E5DEFA] w-full" />
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-11 rounded-2xl bg-white border border-[#EBE4F8] shadow-[0_4px_12px_rgba(150,130,210,0.12)] hover:shadow-[0_6px_16px_rgba(150,130,210,0.22)] flex items-center justify-center gap-2.5 text-xs font-bold text-[#372C54] hover:bg-[#FAF8FE] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Mode Toggle & Guest Demo */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F0EAF8] text-xs">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(null); }}
                  className="font-bold text-[#7C5CC9] hover:text-[#5E3EA8] transition-colors"
                >
                  {isSignUp ? 'Already registered? Log In' : "New Scholar? Sign Up"}
                </button>

                <button
                  type="button"
                  onClick={handleGuestDemo}
                  className="font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  ⚡ Quick Guest Mode
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
