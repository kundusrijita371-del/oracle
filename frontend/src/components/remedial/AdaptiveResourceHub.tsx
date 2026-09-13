import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, CheckCircle2, Copy, Check, Lightbulb, Zap } from 'lucide-react';
import { RemedialResource, api } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface AdaptiveResourceHubProps {
  onTakeQuiz: (topic: string, subtopic: string) => void;
  selectedSubtopic?: string;
}

export const AdaptiveResourceHub: React.FC<AdaptiveResourceHubProps> = ({
  onTakeQuiz,
  selectedSubtopic
}) => {
  const [resources, setResources] = useState<RemedialResource[]>([]);
  const [activeResId, setActiveResId] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await api.getRemedialResources();
      setResources(data);
      if (selectedSubtopic) {
        const match = data.find((r: RemedialResource) => r.subtopic.toLowerCase() === selectedSubtopic.toLowerCase());
        if (match) setActiveResId(match.id);
        else if (data.length > 0) setActiveResId(data[0].id);
      } else if (data.length > 0) {
        setActiveResId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeRes = resources.find(r => r.id === activeResId) || resources[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    soundFX.playCoin();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Banner */}
      <div className="clay-card-peach p-6 rounded-[36px] border-4 border-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-[#8B3B1C]">
            📚
          </div>
          <div>
            <h2 className="text-xl font-black text-[#3E2318]">
              Adaptive Remedial Learning Hub
            </h2>
            <p className="text-xs font-semibold text-[#6E4230] mt-0.5">
              Targeted conceptual remediation, intuitive analogies, and drill sessions for identified knowledge gaps.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Remedial Modules List */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase text-[#8B7E74] tracking-wider">
            Detected Knowledge Gaps:
          </div>
          <div className="space-y-2.5">
            {resources.map((res) => {
              const isActive = res.id === activeResId;
              return (
                <button
                  key={res.id}
                  onClick={() => {
                    soundFX.playCoin();
                    setActiveResId(res.id);
                  }}
                  className={`w-full p-4 rounded-3xl border-3 text-left transition-all ${
                    isActive
                      ? 'clay-card-peach border-white shadow-md scale-[1.02]'
                      : 'clay-card border-white hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-[#EB8B68]">
                      {res.topic}
                    </span>
                    <span className="text-[10px] font-bold text-[#8B7E74]">
                      {res.estimated_read_min} min read
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-[#2E241E]">{res.title}</h4>
                  <p className="text-xs font-semibold text-[#6E5D50] line-clamp-1 mt-1">{res.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Detailed Knowledge Card */}
        <div className="lg:col-span-2">
          {activeRes ? (
            <div className="clay-card p-7 sm:p-8 rounded-[40px] border-4 border-white space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE2]">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#FAD4C0] text-[#73351C] text-[10px] font-black uppercase">
                    RAG Knowledge Synthesis
                  </span>
                  <h3 className="text-xl font-black text-[#2E241E] mt-2">
                    {activeRes.title}
                  </h3>
                </div>

                <button
                  onClick={() => onTakeQuiz(activeRes.topic, activeRes.subtopic)}
                  className="clay-button-peach px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shrink-0"
                >
                  <Brain className="w-4 h-4" />
                  <span>Retake Diagnostic Trial</span>
                </button>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm font-semibold text-[#4E3F35] leading-relaxed">
                {activeRes.summary}
              </p>

              {/* Analogy Box */}
              <div className="p-4 rounded-3xl bg-[#FDECC8] border-2 border-white space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black text-[#735A22]">
                  <Lightbulb className="w-4 h-4 text-[#DCA642]" />
                  <span>Real-World Intuitive Analogy:</span>
                </div>
                <p className="text-xs font-semibold text-[#5A4515] italic leading-relaxed">
                  "{activeRes.code_analogy}"
                </p>
              </div>

              {/* Key Invariants */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase text-[#8B7E74]">
                  Key Invariants & Rules:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {activeRes.key_takeaways.map((takeaway, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#F9F5EE] border border-[#EDE5DA] text-xs font-semibold text-[#4E3F35] flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Example */}
              {activeRes.code_example && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#8B7E74]">
                      Invariant Implementation Code:
                    </span>
                    <button
                      onClick={() => handleCopy(activeRes.code_example!)}
                      className="text-xs font-bold text-[#EB8B68] hover:underline flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EDE5DA] text-xs font-mono text-[#5C4535] overflow-x-auto">
                    <code>{activeRes.code_example}</code>
                  </pre>
                </div>
              )}

              {/* Drill */}
              <div className="p-4 rounded-3xl bg-[#D4E8DD] border-2 border-white space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black text-[#2D5A42]">
                  <Zap className="w-4 h-4 text-[#5C9C7B]" />
                  <span>Targeted Remedial Drill:</span>
                </div>
                <p className="text-xs font-semibold text-[#1E3A2B] font-mono">
                  {activeRes.practice_drill}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
