import React, { useState } from 'react';
import { Brain, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { AgentThoughtLog } from '../../services/api';

interface AgentThoughtLogProps {
  logs: AgentThoughtLog[];
  onRefreshLogs: () => void;
}

export const AgentThoughtLogView: React.FC<AgentThoughtLogProps> = ({ logs, onRefreshLogs }) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'Analyze':
        return { bg: 'bg-[#D0E5F5] text-[#2C5D83]', icon: '🔍' };
      case 'Diagnose':
        return { bg: 'bg-[#FAD4C0] text-[#73351C]', icon: '🩺' };
      case 'Fetch':
        return { bg: 'bg-[#E2D9F6] text-[#5E3EA8]', icon: '📚' };
      case 'Reschedule':
        return { bg: 'bg-[#FDECC8] text-[#735A22]', icon: '📅' };
      case 'Notify':
        return { bg: 'bg-[#D4E8DD] text-[#2D5A42]', icon: '📢' };
      default:
        return { bg: 'bg-[#EDE5DA] text-[#5A4D43]', icon: '⚙️' };
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Banner */}
      <div className="clay-card-purple p-6 rounded-[36px] border-4 border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-[#6D4CB8]">
            🧠
          </div>
          <div>
            <h2 className="text-xl font-black text-[#2E1E4F]">
              Agent Activity & Replanning Audit Log
            </h2>
            <p className="text-xs font-semibold text-[#5B458A] mt-0.5">
              Live telemetry stream of the AI Guild Master's ReAct thought loops and schedule rewrites.
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshLogs}
          className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-xs font-bold text-[#2E1E4F] flex items-center gap-1.5 shadow-sm border border-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* 5-Step Loop Diagram */}
      <div className="clay-card p-5 rounded-[36px] border-4 border-white space-y-3">
        <div className="text-xs font-black uppercase text-[#8B7E74]">
          Autonomous Closed-Loop State Machine Flow:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs font-bold">
          <div className="p-3 rounded-2xl bg-[#D0E5F5] text-[#2C5D83] border-2 border-white shadow-sm">
            <div>1. Analyze</div>
            <div className="text-[10px] font-semibold text-[#446580]">Scores & Data</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAD4C0] text-[#73351C] border-2 border-white shadow-sm">
            <div>2. Diagnose</div>
            <div className="text-[10px] font-semibold text-[#7E4C38]">Gap Detection</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#E2D9F6] text-[#5E3EA8] border-2 border-white shadow-sm">
            <div>3. Fetch</div>
            <div className="text-[10px] font-semibold text-[#6D4CB8]">RAG Retrieval</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FDECC8] text-[#735A22] border-2 border-white shadow-sm">
            <div>4. Reschedule</div>
            <div className="text-[10px] font-semibold text-[#735A22]">Graph Replan</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#D4E8DD] text-[#2D5A42] border-2 border-white shadow-sm col-span-2 sm:col-span-1">
            <div>5. Notify</div>
            <div className="text-[10px] font-semibold text-[#4B6B59]">Guild Master</div>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {logs.map((log) => {
          const badge = getPhaseBadge(log.phase);
          const isExpanded = expandedLogId === log.id;

          return (
            <div
              key={log.id}
              className="clay-card rounded-3xl border-3 border-white overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF6F0]"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-2xl text-xs font-black shadow-sm flex items-center gap-1.5 ${badge.bg}`}>
                    <span>{badge.icon}</span>
                    <span>{log.phase}</span>
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-[#2E241E]">{log.trigger_event}</span>
                      <span className="text-[10px] font-bold text-[#8B7E74] font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#6E5D50] mt-0.5">{log.thought_summary}</p>
                  </div>
                </div>

                <div className="text-[#8B7E74]">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#F0EBE2] bg-[#FAF6F0]">
                  <div className="text-[10px] font-black uppercase text-[#8B7E74] mb-1.5">Execution JSON Payload:</div>
                  <pre className="p-3.5 rounded-2xl bg-white border border-[#EDE5DA] text-[11px] font-mono text-[#5C4535] overflow-x-auto shadow-inner">
                    <code>{JSON.stringify(log.details, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
