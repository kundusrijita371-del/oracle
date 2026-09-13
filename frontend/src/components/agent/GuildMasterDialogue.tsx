import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Shield, Flame, BookOpen, MessageSquare, X, ChevronRight, Volume2 } from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';

export interface GuildMasterMessage {
  mood: 'tactical' | 'warning' | 'lore' | 'celebration' | 'motivation';
  dialogue: string;
  companionName?: string;
  avatarIcon?: string;
}

interface GuildMasterDialogueProps {
  message: GuildMasterMessage;
  onDismiss?: () => void;
  onActionClick?: (action: string) => void;
}

export const GuildMasterDialogue: React.FC<GuildMasterDialogueProps> = ({
  message,
  onDismiss,
  onActionClick
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const companion = message.companionName || 'Sage Sylva';
  const avatar = message.avatarIcon || (
    message.mood === 'warning' ? '🦉' :
    message.mood === 'celebration' ? '✨' :
    message.mood === 'lore' ? '📜' : '🧙‍♂️'
  );

  // Typewriter text effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let idx = 0;
    const fullText = message.dialogue;

    const interval = setInterval(() => {
      if (idx < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(idx));
        if (idx % 4 === 0) {
          soundFX.playDialogueBlip();
        }
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [message.dialogue]);

  const getMoodBadge = () => {
    switch (message.mood) {
      case 'warning':
        return {
          bg: 'bg-red-500/20 text-red-600 border-red-300',
          label: 'Magical Warning Spell',
          icon: <AlertTriangle className="w-3 h-3 text-red-500" />
        };
      case 'celebration':
        return {
          bg: 'bg-amber-500/20 text-amber-700 border-amber-300',
          label: 'Guild Victory Lore',
          icon: <Sparkles className="w-3 h-3 text-amber-600" />
        };
      case 'lore':
        return {
          bg: 'bg-purple-500/20 text-purple-700 border-purple-300',
          label: 'Ancient Codex Insight',
          icon: <BookOpen className="w-3 h-3 text-purple-600" />
        };
      default:
        return {
          bg: 'bg-sky-500/20 text-sky-700 border-sky-300',
          label: 'AI Guild Master Tactic',
          icon: <Shield className="w-3 h-3 text-sky-600" />
        };
    }
  };

  const badge = getMoodBadge();

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-6 z-40 select-none animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="clay-button-peach px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-2 shadow-2xl border-2 border-white"
        >
          <span className="text-base">{avatar}</span>
          <span>{companion} Online</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl select-none animate-fadeIn">
      <div className="clay-card p-4 sm:p-5 rounded-[32px] border-4 border-white shadow-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF4EA] to-[#F5ECE0] relative flex items-start gap-4">
        
        {/* Companion Avatar Portrait */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-white shadow-md flex items-center justify-center text-3xl">
            {avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        {/* Dialogue Content */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-[#3E291C]">{companion}</span>
              <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border ${badge.bg}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-[10px] font-bold text-[#8C7665] hover:text-[#3E291C] px-1.5 py-0.5 rounded"
              >
                Minimize
              </button>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="w-6 h-6 rounded-full hover:bg-black/5 text-[#8C7665] flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Dialogue Text */}
          <p className="text-xs sm:text-sm font-semibold text-[#4A382A] leading-relaxed min-h-[38px]">
            {displayedText}
            {isTyping && <span className="inline-block w-1.5 h-3.5 bg-amber-600 ml-1 animate-pulse" />}
          </p>

          {/* Quick Tactic Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => onActionClick?.('lore')}
              className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-white shadow-sm border border-[#E8DFC8] text-[#5C4230] hover:bg-amber-50 flex items-center gap-1 transition-colors"
            >
              <span>📜 Lore Wisdom</span>
            </button>
            <button
              onClick={() => onActionClick?.('boost')}
              className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 hover:bg-amber-200 flex items-center gap-1 transition-colors"
            >
              <span>⚡ Focus Tactic</span>
            </button>
            <button
              onClick={() => onActionClick?.('boss')}
              className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-purple-100/70 border border-purple-300 text-purple-900 hover:bg-purple-200 flex items-center gap-1 transition-colors"
            >
              <span>⚔️ Challenge Boss</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
