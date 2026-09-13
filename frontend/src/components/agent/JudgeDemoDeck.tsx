import React, { useState } from 'react';
import { Cpu, Zap, Calendar, AlertTriangle, Trophy, RefreshCw, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface JudgeDemoDeckProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulationTriggered: (res: any) => void;
}

export const JudgeDemoDeck: React.FC<JudgeDemoDeckProps> = ({
  isOpen,
  onClose,
  onSimulationTriggered
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [lastNotice, setLastNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateQuizFailure = async () => {
    setLoadingAction('failure');
    soundFX.playAlert();
    try {
      const res = await api.simulateQuizFailure();
      setLastNotice("⚡ Triggered Quiz Failure on Dijkstra (33.3%). Remedial quest deployed & timetable recalculated!");
      onSimulationTriggered(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSimulateMissedSession = async () => {
    setLoadingAction('missed');
    soundFX.playAlert();
    try {
      const res = await api.simulateMissedSession();
      setLastNotice("📅 Triggered Missed Session. Moved block to tomorrow & updated dependent downstream quests.");
      onSimulationTriggered(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSimulateEmergencyConflict = async () => {
    setLoadingAction('conflict');
    soundFX.playAlert();
    try {
      const res = await api.simulateEmergencyConflict();
      setLastNotice("🚨 Registered 4-Hour Emergency Conflict. Relocated overlapping study sessions forward.");
      onSimulationTriggered(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSimulateAceStreak = async () => {
    setLoadingAction('ace');
    soundFX.playLevelUp();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    try {
      const res = await api.simulateAceStreak();
      setLastNotice("🏆 Triggered 100% Ace Streak. Scaled Dynamic Difficulty (DDA) to Master Tier & credited bonus Gold!");
      onSimulationTriggered(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReset = async () => {
    setLoadingAction('reset');
    soundFX.playCoin();
    try {
      const res = await api.resetSimulation();
      setLastNotice("🔄 State restored to pristine demo baseline.");
      onSimulationTriggered(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto select-none">
      <div className="clay-card max-w-xl w-full p-7 sm:p-8 rounded-[40px] border-4 border-white shadow-2xl relative my-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE2]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FCDAC9] flex items-center justify-center text-2xl text-[#8B3B1C] shadow-sm">
              <Cpu className="w-6 h-6 text-[#EB8B68]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-[#2E241E]">
                  Judge Demonstration Deck
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#EB8B68] text-white text-[9px] font-black uppercase">
                  LIVE TESTER
                </span>
              </div>
              <p className="text-xs font-semibold text-[#8B7E74]">
                1-Click autonomous edge-case simulation triggers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-[#F6F1EA] hover:bg-[#EFEAE2] flex items-center justify-center text-[#5C5046]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        {lastNotice && (
          <div className="p-3.5 rounded-2xl bg-[#FDECC8] border border-[#F5D89A] text-xs font-bold text-[#735A22] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#DCA642] shrink-0" />
            <span>{lastNotice}</span>
          </div>
        )}

        {/* Trigger Cards */}
        <div className="space-y-3">
          {/* 1. Simulate Quiz Failure */}
          <button
            disabled={loadingAction !== null}
            onClick={handleSimulateQuizFailure}
            className="w-full p-4 rounded-3xl clay-card-peach border-3 border-white text-left transition-all hover:scale-[1.01] group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-[#3E2318]">
                <Zap className="w-4 h-4 text-[#EB8B68]" />
                <span>1. Simulate Quiz Failure (&lt;60% on Dijkstra)</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#EB8B68] text-white">
                {loadingAction === 'failure' ? 'Testing...' : 'Trigger ⚡'}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#6E4230]">
              Agent detects gap, fetches RAG remedial material, halts downstream topics, and rewrites schedule.
            </p>
          </button>

          {/* 2. Simulate Missed Study Block */}
          <button
            disabled={loadingAction !== null}
            onClick={handleSimulateMissedSession}
            className="w-full p-4 rounded-3xl clay-card-yellow border-3 border-white text-left transition-all hover:scale-[1.01] group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-[#42310A]">
                <Calendar className="w-4 h-4 text-[#DCA642]" />
                <span>2. Simulate Missed Study Block</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#DCA642] text-white">
                {loadingAction === 'missed' ? 'Testing...' : 'Trigger 📅'}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#6E5014]">
              Agent relocates missed session to tomorrow and recalibrates dependent study blocks.
            </p>
          </button>

          {/* 3. Simulate Emergency Conflict */}
          <button
            disabled={loadingAction !== null}
            onClick={handleSimulateEmergencyConflict}
            className="w-full p-4 rounded-3xl clay-card-blue border-3 border-white text-left transition-all hover:scale-[1.01] group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-[#1C374D]">
                <AlertTriangle className="w-4 h-4 text-[#5A9FD4]" />
                <span>3. Simulate 4-Hour Emergency Conflict</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#5A9FD4] text-white">
                {loadingAction === 'conflict' ? 'Testing...' : 'Trigger 🚨'}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#3B627F]">
              Injects sudden external calendar conflict, smoothly redistributing study load.
            </p>
          </button>

          {/* 4. Simulate Ace Streak */}
          <button
            disabled={loadingAction !== null}
            onClick={handleSimulateAceStreak}
            className="w-full p-4 rounded-3xl clay-card-mint border-3 border-white text-left transition-all hover:scale-[1.01] group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-[#1E3A2B]">
                <Trophy className="w-4 h-4 text-[#5C9C7B]" />
                <span>4. Simulate 100% Ace Streak & DDA Boost</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#5C9C7B] text-white">
                {loadingAction === 'ace' ? 'Testing...' : 'Trigger 🏆'}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#4B6B59]">
              Elevates Dynamic Difficulty (DDA) to Master Tier and credits bonus Gold.
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE2]">
          <button
            disabled={loadingAction !== null}
            onClick={handleReset}
            className="px-4 py-2 rounded-2xl bg-[#F0EBE2] hover:bg-[#E8E1D6] text-xs font-bold text-[#5C5046] flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>

          <button
            onClick={onClose}
            className="clay-button-peach px-6 py-2.5 rounded-2xl text-xs font-black"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
