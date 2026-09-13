import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, CheckCircle2, XCircle, ArrowRight, HelpCircle, RefreshCw, BookOpen, Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, api } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface QuizEngineModalProps {
  topic: string;
  subtopic: string;
  onClose: () => void;
  onQuizCompleted: (result: any) => void;
  onViewRemedial: (subtopic: string) => void;
}

export const QuizEngineModal: React.FC<QuizEngineModalProps> = ({
  topic,
  subtopic,
  onClose,
  onQuizCompleted,
  onViewRemedial
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [topic, subtopic]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await api.getQuestions(topic, subtopic);
      if (data && data.length > 0) {
        setQuestions(data);
      } else {
        const fallback = await api.getQuestions();
        setQuestions(fallback);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    soundFX.playCoin();
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        topic: topic || "Graphs",
        subtopic: subtopic || "Dijkstras Algorithm",
        answers: selectedAnswers
      };
      const res = await api.submitQuiz(payload);
      setQuizResult(res);

      if (!res.is_gap_detected) {
        soundFX.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        soundFX.playAlert();
      }

      onQuizCompleted(res);
    } catch (e) {
      console.error("Quiz submission error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];
  const allAnswered = questions.length > 0 && questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto select-none">
      <div className="clay-card max-w-2xl w-full p-6 sm:p-8 rounded-[40px] border-4 border-white shadow-2xl relative my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE2] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FDECC8] border-2 border-white shadow-sm flex items-center justify-center text-2xl text-[#8B6810]">
              🧪
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B7E74]">
                Diagnostic Knowledge Assessment
              </span>
              <h3 className="text-lg font-black text-[#2E241E]">
                {subtopic || topic}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-[#F6F1EA] hover:bg-[#EFEAE2] flex items-center justify-center text-[#5C5046] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#EB8B68] animate-spin mx-auto" />
            <div className="text-xs font-bold text-[#8B7E74]">Loading Assessment Trial...</div>
          </div>
        ) : quizResult ? (
          /* Results Screen */
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border-3 text-center space-y-3 ${
              quizResult.is_gap_detected
                ? 'clay-card-peach border-white shadow-lg'
                : 'clay-card-mint border-white shadow-lg'
            }`}>
              <div className="text-4xl">{quizResult.is_gap_detected ? '⚠️' : '🏆'}</div>
              <h3 className="text-2xl font-black text-[#2E241E]">
                {quizResult.is_gap_detected ? 'Knowledge Gap Detected!' : 'Mastery Confirmed!'}
              </h3>
              <div className="text-3xl font-black font-mono text-[#D35B30]">
                {quizResult.score_pct.toFixed(1)}% Score
              </div>
              <p className="text-xs font-semibold text-[#6E4230] max-w-md mx-auto">
                {quizResult.correct_count} of {quizResult.total_questions} questions correct.
                {quizResult.is_gap_detected
                  ? ' Score is below 60% threshold. The Autonomous Agent has dynamically rescheduled your timetable.'
                  : ' Excellent performance! Prerequisite cleared and XP/Gold credited.'}
              </p>
            </div>

            {/* Guild Master Response */}
            <div className="p-4 rounded-2xl bg-[#F9F5EE] border border-[#EDE5DA] space-y-1">
              <div className="text-xs font-black text-[#8B3B1C] flex items-center gap-1.5">
                <span>🧙‍♂️ Guild Master Vaelen:</span>
              </div>
              <p className="text-xs font-semibold text-[#4E3F35] italic">
                "{quizResult.dialogue?.dialogue}"
              </p>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              <div className="text-xs font-black text-[#8B7E74] uppercase">Trial Audit:</div>
              {quizResult.question_results?.map((res: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs space-y-1 ${
                    res.is_correct ? 'bg-[#D4E8DD]/50 border-[#A5D1B8]' : 'bg-[#FAD4C0]/50 border-[#F2B395]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[#2E241E]">
                    <span>Q{idx + 1}: {res.question}</span>
                    {res.is_correct ? (
                      <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Correct</span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Incorrect</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#6E5D50]">{res.explanation}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {quizResult.is_gap_detected ? (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      onViewRemedial(subtopic);
                    }}
                    className="flex-1 clay-button-peach py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open Remedial Notes</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-3 rounded-2xl bg-[#F0EBE2] hover:bg-[#E8E1D6] text-[#5C5046] font-bold text-xs"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full clay-button-mint py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Claim Rewards & Continue</span>
                </button>
              )}
            </div>
          </div>
        ) : currentQ ? (
          /* Question Form */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-[#8B7E74]">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FDECC8] text-[#735A22] text-[10px] font-black">
                {currentQ.difficulty} Tier
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-[#2E241E] leading-snug">
                {currentQ.question}
              </h3>

              {currentQ.code_snippet && (
                <pre className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EDE5DA] text-xs font-mono text-[#5C4535] overflow-x-auto">
                  <code>{currentQ.code_snippet}</code>
                </pre>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FAD4C0] border-[#EB8B68] text-[#3E2318] shadow-sm scale-[1.01]'
                        : 'bg-[#FAF6F0] hover:bg-[#F4EFE6] border-[#EDE5DA] text-[#5A4D43]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                        isSelected ? 'bg-[#EB8B68] text-white' : 'bg-white text-[#6E5D50] shadow-sm'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#EB8B68]" />}
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            {currentQ.hint && (
              <div>
                {showHint[currentQ.id] ? (
                  <div className="p-3 rounded-xl bg-[#FDECC8] border border-[#F5D89A] text-xs text-[#735A22] font-semibold">
                    💡 <strong>Hint:</strong> {currentQ.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHint(prev => ({ ...prev, [currentQ.id]: true }))}
                    className="text-xs text-[#EB8B68] hover:underline flex items-center gap-1 font-bold"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Reveal Diagnostic Hint</span>
                  </button>
                )}
              </div>
            )}

            {/* Navigation & Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE2]">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-[#F0EBE2] text-[#5C5046] text-xs font-bold disabled:opacity-40"
              >
                Previous
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="clay-button-peach px-5 py-2 rounded-2xl text-xs font-black flex items-center gap-1"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  disabled={!allAnswered || isSubmitting}
                  onClick={handleSubmitQuiz}
                  className="clay-button-peach px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Auditing Performance...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Submit Diagnostic Trial</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
