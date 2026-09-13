import React, { useState, useEffect } from 'react';
import {
  Swords, Shield, Flame, Sparkles, Trophy, Heart, AlertTriangle,
  CheckCircle2, XCircle, ArrowRight, RefreshCw, X, Zap, Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/audioEffects';
import { useFloatingLoot } from '../gamification/FloatingLootManager';

interface BossQuestion {
  id: string;
  question: string;
  options: string[];
  correct_idx: number;
  damage: number;
  explanation: string;
  subtopic: string;
}

interface BossRaidExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVictory: (xpEarned: number, goldEarned: number) => void;
  bossTopic?: string;
}

export const BossRaidExamModal: React.FC<BossRaidExamModalProps> = ({
  isOpen,
  onClose,
  onVictory,
  bossTopic = "Graphs & Dynamic Programming"
}) => {
  const { triggerLoot } = useFloatingLoot();

  const maxBossHp = 1000;
  const maxPlayerHp = 100;

  const [bossHp, setBossHp] = useState(maxBossHp);
  const [playerHp, setPlayerHp] = useState(maxPlayerHp);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isHitAnim, setIsHitAnim] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>(["Boss Raid Commenced! Strike down the Titan."]);
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);

  // Boss Questions Dataset
  const questions: BossQuestion[] = [
    {
      id: 'bq-1',
      question: "In Dijkstra's algorithm with a Min-Heap, what is the tight time complexity for a graph with V vertices and E edges?",
      options: [
        "O(V^2)",
        "O((V + E) log V)",
        "O(V * E)",
        "O(E log E + V)"
      ],
      correct_idx: 1,
      damage: 250,
      subtopic: "Dijkstra Invariants",
      explanation: "Extracting min V times takes O(V log V) and decreasing keys at most E times takes O(E log V), summing to O((V + E) log V)."
    },
    {
      id: 'bq-2',
      question: "Which invariant guarantees that 1D DP memoization achieves polynomial runtime for overlapping subproblems?",
      options: [
        "Optimal Substructure + State Caching without re-computation",
        "Randomized pivoting",
        "Greedy local choice property",
        "Depth-first search backtracking"
      ],
      correct_idx: 0,
      damage: 250,
      subtopic: "1D DP Memoization",
      explanation: "Optimal substructure allows global solutions from sub-solutions, and caching prevents re-evaluating identical state subtrees."
    },
    {
      id: 'bq-3',
      question: "Why does standard Dijkstra fail on graphs with negative edge weights even without negative cycles?",
      options: [
        "It overflows integer memory",
        "Once a vertex is popped from the priority queue, Dijkstra assumes its shortest path is final and never relaxes it again",
        "The graph becomes disconnected",
        "Heap operations take exponential time"
      ],
      correct_idx: 1,
      damage: 250,
      subtopic: "Negative Edge Invariants",
      explanation: "Dijkstra greedily locks in node distances when finalized. A later negative edge could provide a shorter path, violating the greedy premise."
    },
    {
      id: 'bq-4',
      question: "In a Raft Consensus Cluster of 5 nodes, what is the minimum quorum required to commit a log entry?",
      options: [
        "2 nodes",
        "3 nodes (Majority = floor(5/2) + 1)",
        "4 nodes",
        "5 nodes (Unanimous)"
      ],
      correct_idx: 1,
      damage: 250,
      subtopic: "Distributed Consensus Quorums",
      explanation: "Raft requires a simple majority (n/2 + 1) of active nodes to guarantee non-overlapping quorums and prevent split-brain states."
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setBossHp(maxBossHp);
      setPlayerHp(maxPlayerHp);
      setCurrentQIndex(0);
      setSelectedOpt(null);
      setIsAnswered(false);
      setIsVictory(false);
      setIsDefeated(false);
      setCombatLog(["Boss Raid Commenced! Strike down the Titan with pure intellect."]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentQIndex] || questions[0];
  const isEnraged = bossHp <= maxBossHp * 0.5;

  const handleSelectOption = (idx: number) => {
    if (isAnswered || isVictory || isDefeated) return;
    setSelectedOpt(idx);
  };

  const handleConfirmAttack = () => {
    if (selectedOpt === null || isAnswered) return;
    setIsAnswered(true);

    const isCorrect = selectedOpt === currentQ.correct_idx;

    if (isCorrect) {
      soundFX.playSlash();
      soundFX.playBossHit();
      setIsHitAnim(true);
      setTimeout(() => setIsHitAnim(false), 550);

      const nextHp = Math.max(0, bossHp - currentQ.damage);
      setBossHp(nextHp);

      triggerLoot(`-${currentQ.damage} CRIT DMG`, 'damage');
      triggerLoot("+120 XP", 'xp');

      setCombatLog(prev => [
        `⚡ Critical Strike! You inflicted ${currentQ.damage} DMG on Chronos. (${currentQ.subtopic} Mastered)`,
        ...prev.slice(0, 4)
      ]);

      if (nextHp <= 0) {
        // Victory!
        setIsVictory(true);
        soundFX.playBossDefeat();
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      }
    } else {
      soundFX.playAlert();
      const nextPlayerHp = Math.max(0, playerHp - 35);
      setPlayerHp(nextPlayerHp);

      setCombatLog(prev => [
        `💥 Chronos retaliated with Temporal Backlash! You took 35 DMG.`,
        ...prev.slice(0, 4)
      ]);

      if (nextPlayerHp <= 0) {
        setIsDefeated(true);
      }
    }
  };

  const handleNextPhase = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    }
  };

  const handleClaimVictoryLoot = () => {
    onVictory(500, 250);
    triggerLoot("+500 XP Boss Raid", 'xp');
    triggerLoot("+250 Gold Coins", 'gold');
    triggerLoot("Relic: Crown of Dijkstra", 'item');
    onClose();
  };

  const hpPercent = Math.round((bossHp / maxBossHp) * 100);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-gradient-to-b from-[#181126] via-[#22163A] to-[#120B20] rounded-[40px] border-4 border-amber-500/80 shadow-[0_0_60px_rgba(245,158,11,0.4)] p-6 sm:p-8 text-white my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 flex items-center justify-center border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Boss Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Mythic Diagnostic Boss Raid</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400 tracking-tight">
            Chronos, The Procrastination Titan
          </h2>
          <p className="text-xs text-amber-200/70 font-semibold">
            Topic Domain: {bossTopic}
          </p>
        </div>

        {/* Boss Visual & Animated Health Bar */}
        <div className="bg-black/40 border border-white/10 rounded-3xl p-5 mb-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Animated Boss Avatar */}
              <div className={`text-4xl p-3 rounded-2xl bg-red-950/60 border-2 border-red-500/50 shadow-inner ${isHitAnim ? 'animate-boss-hit' : ''} ${isEnraged ? 'animate-pulse' : ''}`}>
                {isEnraged ? '🔥👹🔥' : '⏳🗿⚔️'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-red-400">BOSS HP</span>
                  {isEnraged && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white uppercase tracking-wider">
                      Phase 2: Enraged!
                    </span>
                  )}
                </div>
                <div className="text-xl font-black text-white">
                  {bossHp} <span className="text-xs text-gray-400 font-semibold">/ {maxBossHp} HP</span>
                </div>
              </div>
            </div>

            {/* Player HP */}
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                <Heart className="w-3.5 h-3.5 fill-emerald-400" /> Scholar HP
              </span>
              <div className="text-lg font-black text-white">
                {playerHp} / {maxPlayerHp}
              </div>
            </div>
          </div>

          {/* Health Bar Slider */}
          <div className="w-full h-5 bg-black/60 rounded-full overflow-hidden border-2 border-white/20 p-0.5">
            <div
              style={{ width: `${hpPercent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isEnraged
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
            />
          </div>
        </div>

        {/* Combat Area / Question Section */}
        {!isVictory && !isDefeated && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
                <span>Phase Attack #{currentQIndex + 1} of {questions.length}</span>
                <span className="text-gray-400">Strike Power: {currentQ.damage} DMG</span>
              </div>
              <h3 className="font-black text-base text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                let btnStyle = "bg-white/5 border-white/15 text-gray-200 hover:bg-white/10";

                if (isAnswered) {
                  if (idx === currentQ.correct_idx) {
                    btnStyle = "bg-emerald-600/40 border-emerald-400 text-emerald-200 font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                  } else if (isSelected) {
                    btnStyle = "bg-red-600/40 border-red-400 text-red-200 line-through";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-amber-500/30 border-amber-400 text-amber-200 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-black text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation on Answer */}
            {isAnswered && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-amber-200/90 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentQ.explanation}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-400 font-medium">
                {combatLog[0]}
              </div>

              {!isAnswered ? (
                <button
                  onClick={handleConfirmAttack}
                  disabled={selectedOpt === null}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 disabled:opacity-40 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
                >
                  <Swords className="w-4 h-4" />
                  <span>Unleash Spell Attack</span>
                </button>
              ) : (
                <button
                  onClick={handleNextPhase}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-[#2E1A04] font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <span>Next Tactical Phase</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {isVictory && (
          <div className="text-center py-8 space-y-5 animate-fadeIn">
            <div className="text-6xl animate-bounce">👑🏆✨</div>
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500">
              BOSS RAID CLEARED!
            </h3>
            <p className="text-sm text-amber-200 font-semibold max-w-md mx-auto">
              You decimated Chronos the Procrastination Titan and solidified your mastery over {bossTopic}!
            </p>

            {/* Loot Drop Showcase */}
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-3xl p-5 max-w-md mx-auto grid grid-cols-3 gap-3">
              <div className="bg-black/40 rounded-2xl p-3 text-center border border-amber-400/20">
                <div className="text-2xl">⚡</div>
                <div className="text-xs font-black text-amber-300 mt-1">+500 XP</div>
              </div>
              <div className="bg-black/40 rounded-2xl p-3 text-center border border-amber-400/20">
                <div className="text-2xl">🪙</div>
                <div className="text-xs font-black text-yellow-300 mt-1">+250 GOLD</div>
              </div>
              <div className="bg-black/40 rounded-2xl p-3 text-center border border-amber-400/20">
                <div className="text-2xl">👑</div>
                <div className="text-[10px] font-black text-purple-300 mt-1">Dijkstra Relic</div>
              </div>
            </div>

            <button
              onClick={handleClaimVictoryLoot}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-[#2B1B04] font-black text-sm shadow-[0_10px_25px_rgba(245,158,11,0.5)] border-2 border-white/60 hover:scale-105 transition-transform"
            >
              Claim Epic Spoils & Return
            </button>
          </div>
        )}

        {/* Defeat Screen */}
        {isDefeated && (
          <div className="text-center py-8 space-y-4">
            <div className="text-5xl">💀⚔️</div>
            <h3 className="text-2xl font-black text-red-400">
              Scholar Barrier Broken!
            </h3>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              Chronos overwhelmed your focus defenses. Review your remedial notes or use a Focus Boost before challenging him again.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
            >
              Retreat to Guild Hall
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
