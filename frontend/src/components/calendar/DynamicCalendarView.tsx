import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, RefreshCw, Zap, ShieldAlert, Check, Plus } from 'lucide-react';
import { CalendarBlock } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface DynamicCalendarViewProps {
  calendar: CalendarBlock[];
  onUpdateStatus: (blockId: string, status: string) => void;
  onRegisterConflict: (dateStr: string, hours: number) => void;
}

export const DynamicCalendarView: React.FC<DynamicCalendarViewProps> = ({
  calendar,
  onUpdateStatus,
  onRegisterConflict
}) => {
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictDate, setConflictDate] = useState(
    calendar[0]?.date_str || new Date().toISOString().split('T')[0]
  );
  const [conflictHours, setConflictHours] = useState(3.0);
  const [conflictReason, setConflictReason] = useState('Surprise Midterm Exam Prep');

  const grouped = calendar.reduce((acc, block) => {
    const key = block.date_str;
    if (!acc[key]) acc[key] = [];
    acc[key].push(block);
    return acc;
  }, {} as Record<string, CalendarBlock[]>);

  const dates = Object.keys(grouped).sort();

  const handleMarkDone = (id: string) => {
    soundFX.playQuestComplete();
    onUpdateStatus(id, 'completed');
  };

  const handleMarkMissed = (id: string) => {
    soundFX.playAlert();
    onUpdateStatus(id, 'missed');
  };

  const handleConflictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playAlert();
    onRegisterConflict(conflictDate, conflictHours);
    setConflictModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Banner */}
      <div className="clay-card-mint p-6 rounded-[36px] border-4 border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-[#2D5A42]">
            📅
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1E3A2B]">
              Adaptive Study Calendar
            </h2>
            <p className="text-xs font-semibold text-[#4B6B59] mt-0.5">
              Autonomous replanning engine shifts missed sessions and inserts remedial quests dynamically.
            </p>
          </div>
        </div>

        <button
          onClick={() => setConflictModalOpen(true)}
          className="clay-button-peach px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Simulate Calendar Conflict</span>
        </button>
      </div>

      {/* Date-Grouped Timeline */}
      <div className="space-y-6">
        {dates.map((dateStr) => {
          const blocks = grouped[dateStr];
          const isToday = dateStr === new Date().toISOString().split('T')[0];

          return (
            <div key={dateStr} className="space-y-3">
              {/* Date Header Pill */}
              <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-2xl text-xs font-black shadow-sm ${
                  isToday
                    ? 'bg-[#EB8B68] text-white'
                    : 'bg-white text-[#5A4D43] border border-[#EDE5DA]'
                }`}>
                  {isToday ? 'TODAY · ' : ''}{dateStr}
                </div>
                <div className="h-0.5 flex-1 bg-[#EAE3D8] rounded-full" />
              </div>

              {/* Study Blocks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blocks.map((block) => {
                  const isCompleted = block.status === 'completed';
                  const isRemedial = block.is_remedial;
                  const isReplanned = block.status === 'replanned';

                  return (
                    <div
                      key={block.id}
                      className={`p-5 rounded-3xl border-3 transition-all flex flex-col justify-between space-y-4 ${
                        isRemedial
                          ? 'clay-card-peach border-white shadow-[0_10px_25px_rgba(235,139,104,0.2)]'
                          : isCompleted
                          ? 'clay-card-mint border-white opacity-85'
                          : isReplanned
                          ? 'clay-card-yellow border-white'
                          : 'clay-card border-white'
                      }`}
                    >
                      <div>
                        {/* Header Badge & Time */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                            isRemedial
                              ? 'bg-[#EB8B68] text-white'
                              : isCompleted
                              ? 'bg-[#5C9C7B] text-white'
                              : isReplanned
                              ? 'bg-[#DCA642] text-white'
                              : 'bg-[#D0E5F5] text-[#2C5D83]'
                          }`}>
                            {isRemedial ? '⚡ Remedial Quest' : isCompleted ? '✓ Completed' : isReplanned ? '🔄 Replanned' : 'Upcoming'}
                          </span>

                          <div className="flex items-center gap-1 text-xs font-bold text-[#6E5D50]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{block.start_time} - {block.end_time}</span>
                          </div>
                        </div>

                        {/* Title & Topic */}
                        <h3 className="font-extrabold text-sm text-[#2E241E]">{block.title}</h3>
                        <div className="text-xs font-semibold text-[#8B7E74] mt-1">
                          Topic: <strong className="text-[#4E3F35]">{block.topic}</strong> · {block.duration_min} mins
                        </div>

                        {block.note && (
                          <div className="mt-2 p-2.5 rounded-xl bg-white/70 border border-white text-[11px] font-medium text-[#7C4830]">
                            ℹ️ {block.note}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {!isCompleted && block.status !== 'missed' && (
                        <div className="pt-3 border-t border-black/5 flex items-center gap-2">
                          <button
                            onClick={() => handleMarkDone(block.id)}
                            className="flex-1 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 shadow-sm flex items-center justify-center gap-1 transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Done</span>
                          </button>
                          <button
                            onClick={() => handleMarkMissed(block.id)}
                            className="py-2 px-3 rounded-xl bg-white hover:bg-red-50 text-red-600 text-xs font-bold border border-red-200 shadow-sm flex items-center justify-center gap-1 transition-all"
                            title="Simulate missed study block"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Missed</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Conflict Modal */}
      {conflictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="clay-card max-w-md w-full p-7 rounded-[36px] space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-[#EB8B68]">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-black text-lg text-[#2E241E]">
                Register Calendar Conflict
              </h3>
            </div>
            <p className="text-xs font-semibold text-[#8B7E74]">
              Inject an unexpected external conflict. The Autonomous Agent will redistribute study blocks across the week without breaking your target exam timeline.
            </p>

            <form onSubmit={handleConflictSubmit} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-[#5C5046] block mb-1">Conflict Date:</label>
                <input
                  type="date"
                  value={conflictDate}
                  onChange={(e) => setConflictDate(e.target.value)}
                  className="w-full clay-input px-3.5 py-2.5 text-xs text-[#2E241E] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C5046] block mb-1">Hours Blocked (1 - 8 hrs):</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  step="0.5"
                  value={conflictHours}
                  onChange={(e) => setConflictHours(parseFloat(e.target.value))}
                  className="w-full clay-input px-3.5 py-2.5 text-xs text-[#2E241E] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C5046] block mb-1">Reason:</label>
                <input
                  type="text"
                  value={conflictReason}
                  onChange={(e) => setConflictReason(e.target.value)}
                  className="w-full clay-input px-3.5 py-2.5 text-xs text-[#2E241E] font-semibold"
                  placeholder="e.g. Surprise Hackathon / Project Deadline"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setConflictModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-[#F0EBE2] text-[#5C5046] text-xs font-bold hover:bg-[#E8E1D6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 clay-button-peach py-2.5 rounded-2xl text-xs font-black shadow-md"
                >
                  Execute Replan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
