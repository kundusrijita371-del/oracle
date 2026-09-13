import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Sparkles, Brain, BookOpen, CheckCircle2,
  AlertTriangle, ArrowRight, Star, Target, Flame, Coins, Clock,
  Timer, TrendingUp, TrendingDown, Award, Zap, ShieldAlert, Palette, X
} from 'lucide-react';
import { StudentProfile, Campaign, Quest, DialogueInfo } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface GuildHallOverviewProps {
  profile: StudentProfile;
  campaigns: Campaign[];
  quests: Quest[];
  dialogue: DialogueInfo;
  onTakeQuiz: (topic: string, subtopic: string) => void;
  onViewRemedial: (subtopic: string) => void;
  onCompleteQuest: (questId: string) => void;
  onNavigateTab: (tab: string) => void;
}

interface StrengthWeaknessReport {
  taskTitle: string;
  topic: string;
  actualSeconds: number;
  benchmarkSeconds: number;
  speedRatio: number;
  efficiencyScore: number;
  strengths: { title: string; score: number; desc: string }[];
  weaknesses: { title: string; severity: 'high' | 'medium' | 'low'; desc: string; remedyTopic: string }[];
  aiFeedback: string;
  creditsEarned: number;
  goldEarned: number;
  timestamp: string;
}

export const GuildHallOverview: React.FC<GuildHallOverviewProps> = ({
  profile,
  campaigns,
  quests,
  dialogue,
  onTakeQuiz,
  onViewRemedial,
  onCompleteQuest,
  onNavigateTab
}) => {
  const activeCampaign = campaigns.find(c => c.id === profile.active_campaign_id) || campaigns[0];
  const remedialQuests = quests.filter(q => q.is_remedial && q.status !== 'completed');
  const activeQuests = quests.filter(q => !q.is_remedial && (q.status === 'in_progress' || q.status === 'pending')).slice(0, 3);
  const completedQuests = quests.filter(q => q.status === 'completed').slice(0, 3);

  // Avatar config with safe fallbacks matching user's cartoon avatar customizer
  const avatar = profile.avatar_config || {
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

  // Focus Clock & Task Timer State
  const [selectedTaskTitle, setSelectedTaskTitle] = useState(activeQuests[0]?.title || "Dijkstra's Algorithm Implementation");
  const [selectedTopic, setSelectedTopic] = useState(activeQuests[0]?.topic || "Graphs");
  const [selectedBenchmarkMin, setSelectedBenchmarkMin] = useState(15);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeReport, setActiveReport] = useState<StrengthWeaknessReport | null>(null);
  const [recentReports, setRecentReports] = useState<StrengthWeaknessReport[]>([]);
  const timerRef = useRef<any>(null);

  // Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    soundFX.playCoin();
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    soundFX.playCoin();
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate Strengths and Weaknesses Report based on completion time
  const handleCompleteAndAnalyze = () => {
    soundFX.playLevelUp();
    setIsTimerRunning(false);

    const actual = timerSeconds || 480; // default to 8 min if zero
    const benchmark = selectedBenchmarkMin * 60;
    const speedRatio = Number((actual / benchmark).toFixed(2));
    const isFast = actual <= benchmark;

    // Calculate score
    const efficiency = Math.max(55, Math.min(98, Math.round((1 - (actual - benchmark) / (benchmark * 1.5)) * 85 + 10)));

    const strengths: { title: string; score: number; desc: string }[] = [
      {
        title: "Algorithmic State Intuition",
        score: Math.min(98, efficiency + 4),
        desc: "Rapid conceptual formulation of subproblems and data flow invariants."
      },
      {
        title: "Active Working Memory",
        score: Math.min(95, efficiency + 2),
        desc: "Maintained trace variables across recursion branches without cognitive thrashing."
      }
    ];

    const weaknesses: { title: string; severity: 'high' | 'medium' | 'low'; desc: string; remedyTopic: string }[] = [
      {
        title: "Edge-Case Verification Latency",
        severity: isFast ? 'low' : 'high',
        desc: isFast
          ? "Good baseline speed, but negative-cycle checks took an extra +45 seconds."
          : "Significant pause detected during boundary condition verification (empty inputs / single nodes).",
        remedyTopic: selectedTopic
      },
      {
        title: "Space-Complexity Memoization Tradeoff",
        severity: 'medium',
        desc: "Over-allocated auxiliary hash tables instead of in-place pointer manipulation.",
        remedyTopic: "Dynamic Programming"
      }
    ];

    if (isFast) {
      strengths.unshift({
        title: "High-Velocity Synthesis",
        score: 96,
        desc: `Completed ${(benchmark - actual)}s faster than standard benchmark with crisp execution.`
      });
    }

    const report: StrengthWeaknessReport = {
      taskTitle: selectedTaskTitle,
      topic: selectedTopic,
      actualSeconds: actual,
      benchmarkSeconds: benchmark,
      speedRatio,
      efficiencyScore: efficiency,
      strengths,
      weaknesses,
      aiFeedback: isFast
        ? `Exceptional focus pace, Scholar! You conquered "${selectedTaskTitle}" in ${formatTime(actual)} (${Math.round((1 - speedRatio) * 100)}% faster than benchmark). Your graph traversal recall is solidifying into muscle memory.`
        : `Task completed in ${formatTime(actual)}. You took slightly longer on boundary invariants. The AI Guild Master has generated a targeted 5-minute remedial drill to eliminate this bottleneck.`,
      creditsEarned: isFast ? 150 : 100,
      goldEarned: isFast ? 75 : 45,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setActiveReport(report);
    setRecentReports(prev => [report, ...prev].slice(0, 3));
    setTimerSeconds(0);
  };

  const getAuraGradient = () => {
    switch (avatar.background_aura) {
      case 'peach': return 'from-[#FFD8C9] via-[#FFEADB] to-[#FFF6F0]';
      case 'mint': return 'from-[#CBE8D8] via-[#E2F4EB] to-[#F3FAF6]';
      case 'lavender': return 'from-[#E1D4F5] via-[#EFE6FC] to-[#FAF6FE]';
      case 'solar': return 'from-[#FFE8AC] via-[#FFF3D1] to-[#FFFAEE]';
      case 'void': return 'from-[#CBD4EC] via-[#E2E7F6] to-[#F4F6FC]';
      default: return 'from-[#FFE0BD] via-[#FFF0DE] to-[#FFF9F2]';
    }
  };

  const getMascotEmoji = () => {
    if (avatar.mascot === 'cat') return '🐱';
    if (avatar.mascot === 'dragon') return '🐉';
    if (avatar.mascot === 'fox') return '🦊';
    if (avatar.mascot === 'owl') return '🦉';
    if (avatar.mascot === 'robot') return '🤖';
    return '🐱';
  };

  const getExpressionEmoji = () => {
    if (avatar.expression === 'wink') return '😉';
    if (avatar.expression === 'focused') return '🧐';
    if (avatar.expression === 'chill') return '😎';
    if (avatar.expression === 'sparkle') return '🤩';
    return '😊';
  };

  const handleStartQuest = (q: Quest) => {
    soundFX.playCoin();
    setSelectedTaskTitle(q.title);
    setSelectedTopic(q.topic);
    setSelectedBenchmarkMin(q.estimated_minutes || 15);
    onTakeQuiz(q.topic, q.subtopic);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Hero Greeting Banner with Dynamic 3D Cartoon Avatar */}
      <div className="bg-[#FAD8C7] rounded-[38px] p-6 sm:p-7 border-4 border-white shadow-[0_15px_35px_rgba(235,139,104,0.18)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Left: Interactive 3D Cartoon Avatar Presentation */}
        <div className="flex items-center gap-5 sm:gap-6 z-10 w-full md:w-auto">
          {/* Layered Cartoon Avatar Box */}
          <div
            onClick={() => onNavigateTab('profile')}
            className="relative group cursor-pointer shrink-0"
            title="Click to customize your cartoon character & view credit stats"
          >
            {/* Ambient Aura Backdrop */}
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] bg-gradient-to-tr ${getAuraGradient()} border-4 border-white shadow-[0_8px_24px_rgba(235,139,104,0.25)] flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105`}>
              {/* Character Face & Head */}
              <div
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-3 border-white shadow-md flex flex-col items-center justify-center relative"
                style={{ backgroundColor: avatar.skin_tone || '#FFE0BD' }}
              >
                {/* Hair Top Accent */}
                <div
                  className="absolute -top-2 w-12 h-6 rounded-t-full border-t border-white/50"
                  style={{ backgroundColor: avatar.hair_color || '#6B4423' }}
                />

                {/* Expression */}
                <span className="text-3xl sm:text-4xl z-10 animate-float-slow">
                  {getExpressionEmoji()}
                </span>

                {/* Headphones */}
                {avatar.headphones && avatar.headphones !== 'none' && (
                  <span className="absolute -top-1.5 text-2xl sm:text-3xl opacity-90 z-20">
                    🎧
                  </span>
                )}
              </div>

              {/* Floating Mascot Companion */}
              {avatar.mascot && avatar.mascot !== 'none' && (
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-2xl border-2 border-white shadow-md text-sm sm:text-base animate-bounce">
                  {getMascotEmoji()}
                </div>
              )}

              {/* Rank Chip */}
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-lg bg-[#EB8B68] text-white text-[9px] font-black border border-white shadow-sm">
                {profile.rank || 'F'}-Rank
              </div>
            </div>

            {/* Edit Cartoon Hover Pill */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white text-[#EB8B68] text-[9px] font-black border border-[#FAD8C7] shadow-sm flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
              <Palette className="w-2.5 h-2.5" />
              <span>Edit Cartoon</span>
            </div>
          </div>

          {/* Greeting & AI Guild Master Dialogue */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#3E2318] tracking-tight">
                Good Day, {profile.name.split(' ')[0]}! ☀️
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#6E4230] leading-snug max-w-lg">
              "{dialogue.dialogue}"
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white text-[11px] font-bold text-[#D35B30] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#EB8B68]" />
                <span>{dialogue.action_notice || 'Autonomous AI loop active'}</span>
              </div>
              <button
                onClick={() => onNavigateTab('profile')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E8EDFB] border border-white text-[11px] font-bold text-[#324B8B] shadow-sm hover:scale-105 transition-transform"
              >
                <span>💎 {profile.credit_points ?? 2500} Credits</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right CTA Button & Desk Plant */}
        <div className="flex items-center gap-4 shrink-0 z-10 w-full md:w-auto justify-end">
          <div className="hidden lg:flex flex-col items-center">
            <span className="text-4xl filter drop-shadow-sm animate-float-slow">🪴</span>
          </div>

          <button
            onClick={() => {
              soundFX.playCoin();
              if (remedialQuests.length > 0) {
                onTakeQuiz(remedialQuests[0].topic, remedialQuests[0].subtopic);
              } else if (activeQuests.length > 0) {
                onTakeQuiz(activeQuests[0].topic, activeQuests[0].subtopic);
              } else {
                onNavigateTab('calendar');
              }
            }}
            className="clay-button-peach px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{remedialQuests.length > 0 ? 'Resume Remedial Quest' : 'Start Today\'s Quest'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Focus & Task Completion Clock (With Strengths & Weaknesses Intelligence) */}
      <div className="clay-card-yellow p-6 rounded-[38px] border-4 border-white shadow-[0_12px_30px_rgba(220,166,66,0.15)] space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl text-[#8B6810] shrink-0">
              ⏱️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#3E2B08]">
                  Task Focus Clock & Performance Diagnostics
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#8B6810] text-[10px] font-black border border-white">
                  AI Strengths & Weaknesses Evaluator
                </span>
              </div>
              <p className="text-xs font-semibold text-[#6E5014] mt-0.5">
                Time your study tasks. The AI Guild Master analyzes your completion pace to generate cognitive strength and weakness reports.
              </p>
            </div>
          </div>

          {/* Quick Task Selection Pill */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <select
              value={selectedTaskTitle}
              onChange={(e) => {
                setSelectedTaskTitle(e.target.value);
                const matched = quests.find(q => q.title === e.target.value);
                if (matched) {
                  setSelectedTopic(matched.topic);
                  setSelectedBenchmarkMin(matched.estimated_minutes || 15);
                }
              }}
              className="px-3.5 py-2 rounded-2xl bg-white/90 font-bold text-xs text-[#3E2B08] border-2 border-white shadow-sm focus:outline-none focus:border-[#EB8B68]"
            >
              {quests.map((q) => (
                <option key={q.id} value={q.title}>
                  🎯 {q.title} ({q.estimated_minutes || 15} min)
                </option>
              ))}
              <option value="Custom Deep Focus Block">⚡ Custom Algorithmic Drill (20 min)</option>
            </select>
          </div>
        </div>

        {/* Clock Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Digital Clock Display */}
          <div className="bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner flex items-center justify-between px-6">
            <div>
              <div className="text-[10px] font-black uppercase text-[#8B6810]">Active Timer</div>
              <div className="text-3xl sm:text-4xl font-black text-[#2E241E] font-mono tracking-wider">
                {formatTime(timerSeconds)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#8B7E74]">Target Benchmark</div>
              <div className="text-sm font-black text-[#8B6810]">{selectedBenchmarkMin}:00 min</div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                isTimerRunning
                  ? 'bg-[#FAD4C0] hover:bg-[#F7C2A9] text-[#732912] border-2 border-white'
                  : 'bg-[#5C9C7B] hover:bg-[#4E886A] text-white border-2 border-white shadow-[0_4px_12px_rgba(92,156,123,0.3)]'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isTimerRunning ? 'Pause Timer' : 'Start Focus Clock'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#5C5046] border-2 border-white shadow-sm"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Complete & Evaluate Button */}
          <button
            onClick={handleCompleteAndAnalyze}
            className="clay-button-peach py-3.5 px-5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(235,139,104,0.28)]"
          >
            <Zap className="w-4 h-4 fill-current text-amber-200" />
            <span>Finish Task & Generate Report</span>
          </button>
        </div>

        {/* Live Strengths & Weaknesses Report Card Modal / Drawer */}
        {activeReport && (
          <div className="mt-4 p-5 sm:p-6 rounded-3xl bg-white border-3 border-white shadow-[0_15px_35px_rgba(180,160,140,0.18)] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#F2ECE2] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F5EE] border border-emerald-200 flex items-center justify-center text-xl text-emerald-700">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base text-[#2E241E]">
                      Cognitive Diagnostic Report: {activeReport.taskTitle}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#D4E8DD] text-[#2D5A42] text-[10px] font-black">
                      {activeReport.efficiencyScore}% Focus Efficiency
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#8B7E74]">
                    Completed in <strong>{formatTime(activeReport.actualSeconds)}</strong> vs {formatTime(activeReport.benchmarkSeconds)} benchmark ({activeReport.timestamp})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveReport(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Guild Master Feedback */}
            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#FAD4C0] text-xs font-semibold text-[#6E4230] leading-relaxed flex items-start gap-3">
              <span className="text-2xl">🧙‍♂️</span>
              <p>{activeReport.aiFeedback}</p>
            </div>

            {/* Strengths & Weaknesses 2-Column Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identified Strengths */}
              <div className="p-4 rounded-2xl bg-[#F2FAF5] border border-[#D4E8DD] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-black text-[#2D5A42] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Key Cognitive Strengths
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">Validated</span>
                </div>
                <div className="space-y-2">
                  {activeReport.strengths.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#1E3A2B]">{s.title}</span>
                        <span className="text-[10px] font-black text-emerald-600">{s.score}%</span>
                      </div>
                      <p className="text-[11px] text-[#4B6B59] font-medium leading-tight">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identified Weaknesses & Knowledge Gaps */}
              <div className="p-4 rounded-2xl bg-[#FFF5F2] border border-[#FAD8C7] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-black text-[#8B3B1C] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-rose-500" />
                    Identified Bottlenecks & Gaps
                  </span>
                  <span className="text-[10px] font-bold text-rose-600">Action Needed</span>
                </div>
                <div className="space-y-2">
                  {activeReport.weaknesses.map((w, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-rose-100 shadow-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#3E2318]">{w.title}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                          w.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {w.severity.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E4230] font-medium leading-tight">{w.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar with Reward Claim */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F2ECE2]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#5C5046]">Reward Claimed:</span>
                <span className="px-2.5 py-1 rounded-xl bg-[#FDECC8] text-[#735A22] text-xs font-black">
                  +{activeReport.goldEarned} 🪙 Gold
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#E8EDFB] text-[#324B8B] text-xs font-black">
                  +{activeReport.creditsEarned} 💎 Credits
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewRemedial(activeReport.topic)}
                  className="px-4 py-2 rounded-xl bg-[#F0EBE2] hover:bg-[#E7DFD4] text-xs font-black text-[#3E2318]"
                >
                  Generate Remedial Drill
                </button>
                <button
                  onClick={() => onTakeQuiz(activeReport.topic, activeReport.taskTitle)}
                  className="clay-button-peach px-4 py-2 rounded-xl text-xs font-black"
                >
                  Take Verification Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Stat Cards Row (4 3D Pastel Claymorphic Cards matching Pinterest) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Mint Green - Mastery Index */}
        <div className="clay-card-mint p-5 rounded-3xl flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
            🎵
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#4B6B59] uppercase tracking-wide">
              Mastery Score
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E3A2B] mt-0.5">
              {profile.rolling_mastery.toFixed(1)}%
            </div>
            <div className="text-[11px] font-bold text-[#326B4A] mt-1">
              +4.5% this week
            </div>
          </div>
        </div>

        {/* Card 2: Peach - Gold Balance */}
        <div className="clay-card-peach p-5 rounded-3xl flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
            🪙
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#7E4C38] uppercase tracking-wide">
              Gold Stash
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#432014] mt-0.5">
              {profile.gold}
            </div>
            <div className="text-[11px] font-bold text-[#8B3B1C] mt-1">
              +75 quest reward
            </div>
          </div>
        </div>

        {/* Card 3: Butter Yellow - Daily Study Hours */}
        <div className="clay-card-yellow p-5 rounded-3xl flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
            ⏰
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#735A22] uppercase tracking-wide">
              Daily Target
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#42310A] mt-0.5">
              {profile.daily_available_hours}h
            </div>
            <div className="text-[11px] font-bold text-[#7C5A14] mt-1">
              Optimal Study Load
            </div>
          </div>
        </div>

        {/* Card 4: Sky Blue - Quest Streak */}
        <div className="clay-card-blue p-5 rounded-3xl flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
            🔥
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#446580] uppercase tracking-wide">
              Current Streak
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1C374D] mt-0.5">
              {profile.streak_days}
            </div>
            <div className="text-[11px] font-bold text-[#2C5D83] mt-1">
              days in a row
            </div>
          </div>
        </div>
      </div>

      {/* 4. Urgent Remedial Quest Banner (if active) */}
      {remedialQuests.length > 0 && (
        <div className="clay-card-peach p-5 rounded-3xl border-3 border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl text-red-500 shrink-0">
              ⚡
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 rounded-md bg-[#EB8B68] text-white text-[10px] font-black uppercase">
                Autonomous Intervention
              </div>
              <h3 className="text-sm font-black text-[#3E2318] mt-0.5">
                {remedialQuests[0].title}
              </h3>
              <p className="text-xs text-[#6E4230]">
                {remedialQuests[0].remedial_reason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onViewRemedial(remedialQuests[0].subtopic)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#3E2318] text-xs font-bold border border-white shadow-sm"
            >
              Study Notes
            </button>
            <button
              onClick={() => onTakeQuiz(remedialQuests[0].topic, remedialQuests[0].subtopic)}
              className="flex-1 sm:flex-initial clay-button-peach px-4 py-2 rounded-xl text-xs font-black"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}

      {/* 5. Middle Rows: Weekly Study Load Overview & Topic Mastery Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Study Overview Bar Chart + Active Quests */}
        <div className="lg:col-span-2 clay-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#2E241E]">Study Overview</h3>
              <p className="text-xs font-semibold text-[#8B7E74]">Autonomous workload balancing</p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#F6F1EA] text-xs font-bold text-[#5C5046] border border-[#ECE5DC]">
              This Week ▾
            </div>
          </div>

          {/* 3D Pastel Bar Chart */}
          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EDE5DA] flex items-end justify-between h-40 pt-6 px-4">
            {[
              { day: 'Mon', h: '3.2h', pct: 60, color: '#FAD4C0' },
              { day: 'Tue', h: '4.5h', pct: 85, color: '#FDECC8' },
              { day: 'Wed', h: '3.0h', pct: 55, color: '#D4E8DD' },
              { day: 'Thu', h: '5.0h', pct: 95, color: '#FAD4C0' },
              { day: 'Fri', h: '3.5h', pct: 65, color: '#D0E5F5' },
              { day: 'Sat', h: '4.8h', pct: 90, color: '#D4E8DD' },
              { day: 'Sun', h: '3.0h', pct: 55, color: '#E2D9F6' },
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-[#8B7E74]">{bar.h}</span>
                <div
                  className="w-7 sm:w-9 rounded-xl shadow-sm transition-all hover:scale-105"
                  style={{
                    height: `${bar.pct}%`,
                    backgroundColor: bar.color,
                    border: '2px solid rgba(255,255,255,0.9)'
                  }}
                />
                <span className="text-xs font-bold text-[#5C5046]">{bar.day}</span>
              </div>
            ))}
          </div>

          {/* Active Quests Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#8B7E74]">
                Today's Active Quests
              </h4>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="text-xs font-bold text-[#EB8B68] hover:underline"
              >
                View Timetable →
              </button>
            </div>

            <div className="space-y-2.5">
              {activeQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="p-3.5 rounded-2xl bg-[#F9F5EE] hover:bg-[#F4EFE6] border-2 border-white flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStartQuest(quest)}
                      className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#EB8B68] hover:scale-105 transition-transform"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-[#2E241E]">{quest.title}</span>
                        <span className="px-2 py-0.2 rounded-md bg-[#D4E8DD] text-[#2D5A42] text-[9px] font-black">
                          {quest.difficulty}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#8B7E74]">
                        {quest.topic} · {quest.estimated_minutes} min · <strong className="text-[#D35B30]">+{quest.gold_reward} Gold</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onCompleteQuest(quest.id)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Top Mastery Donut & Campaign Spotlight */}
        <div className="space-y-6">
          {/* Donut Chart Mastery */}
          <div className="clay-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-black text-[#2E241E]">Mastery Breakdown</h3>

            {/* Visual 3D Pastel Donut representation */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-[#FAD4C0] via-[#D4E8DD] to-[#D0E5F5] p-3 shadow-inner flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white shadow-md flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-[#2E241E]">{profile.rolling_mastery.toFixed(0)}%</span>
                  <span className="text-[9px] font-bold text-[#8B7E74]">Total Mastered</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-[#F2ECE2]">
              <div className="flex items-center gap-2 text-[#6E5A4D]">
                <span className="w-3 h-3 rounded-full bg-[#FAD4C0]" />
                <span>Graphs (45%)</span>
              </div>
              <div className="flex items-center gap-2 text-[#6E5A4D]">
                <span className="w-3 h-3 rounded-full bg-[#D4E8DD]" />
                <span>DP (25%)</span>
              </div>
              <div className="flex items-center gap-2 text-[#6E5A4D]">
                <span className="w-3 h-3 rounded-full bg-[#D0E5F5]" />
                <span>Trees (20%)</span>
              </div>
              <div className="flex items-center gap-2 text-[#6E5A4D]">
                <span className="w-3 h-3 rounded-full bg-[#E2D9F6]" />
                <span>Systems (10%)</span>
              </div>
            </div>
          </div>

          {/* Campaign Spotlight Card */}
          <div className="clay-card p-6 rounded-3xl space-y-3 bg-gradient-to-b from-white to-[#FDF9F4]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#8B7E74]">Active Campaign</span>
              <span className="text-xs font-bold text-[#EB8B68]">{profile.exam_target_date}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-white flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">
                ⚔️
              </div>
              <div>
                <h4 className="text-xs font-black text-[#2E241E]">
                  {activeCampaign?.title || 'The Graph & DP Trials'}
                </h4>
                <p className="text-[11px] font-semibold text-[#8B7E74] line-clamp-1 mt-0.5">
                  {activeCampaign?.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('skills')}
              className="w-full py-2.5 rounded-xl bg-[#F0EBE2] hover:bg-[#E9E2D7] text-[#42352B] font-bold text-xs transition-colors flex items-center justify-center gap-1"
            >
              <span>Explore Skill Tree</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Bottom Discover Banner with 3D Cute Star */}
      <div className="clay-card-mint p-5 rounded-3xl border-3 border-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-amber-400">
            ⭐
          </div>
          <div>
            <h4 className="text-sm font-black text-[#1E3A2B]">
              Discover Autonomous Remedial Paths ✨
            </h4>
            <p className="text-xs font-semibold text-[#4B6B59]">
              AI synthesizes analogies, code invariants, and drill sessions for every detected weakness.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('remedial')}
          className="clay-button-mint px-6 py-2.5 text-xs font-black whitespace-nowrap"
        >
          Explore Remedial RAG Hub
        </button>
      </div>
    </div>
  );
};
