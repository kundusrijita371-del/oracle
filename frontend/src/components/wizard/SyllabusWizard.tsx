import React, { useState } from 'react';
import { Calendar, Clock, Check, ArrowRight, ArrowLeft, Cpu, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface SyllabusWizardProps {
  onSyllabusGenerated: () => void;
}

export const SyllabusWizard: React.FC<SyllabusWizardProps> = ({ onSyllabusGenerated }) => {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [targetDate, setTargetDate] = useState('2026-11-15');
  const [dailyHours, setDailyHours] = useState(3.0);
  const [difficulty, setDifficulty] = useState('Balanced');
  const [topics, setTopics] = useState<string[]>([
    'Graph Representations & Adjacency',
    'Breadth-First Search (BFS)',
    'Depth-First Search & Backtracking',
    'Dijkstras Shortest Path Algorithm',
    'Minimum Spanning Trees (Prim / Kruskal)',
    '1D Dynamic Programming Memoization',
    '2D Grid & Knapsack DP'
  ]);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const presetTracks = [
    {
      title: 'Data Structures & Algorithms',
      icon: '⚔️',
      desc: 'Master Graphs, Dynamic Programming, Trees, Heaps, and Asymptotics.',
      topics: [
        'Graph Representations & Adjacency',
        'Breadth-First Search (BFS)',
        'Depth-First Search & Backtracking',
        'Dijkstras Shortest Path Algorithm',
        'Minimum Spanning Trees (Prim / Kruskal)',
        '1D Dynamic Programming Memoization',
        '2D Grid & Knapsack DP'
      ]
    },
    {
      title: 'Distributed Systems & Cloud Architecture',
      icon: '🛡️',
      desc: 'Raft Consensus, CAP Theorem, Event-Driven Streaming & Partition Tolerance.',
      topics: [
        'CAP Theorem & Partition Strategies',
        'Raft & Paxos Consensus Protocols',
        'Distributed Caching & Invalidation',
        'Event-Driven Microservices (Kafka)',
        'High-Availability Load Balancing'
      ]
    },
    {
      title: 'Deep Learning & Neural Architectures',
      icon: '🔮',
      desc: 'Backprop calculus, Transformers, Attention Layers & Diffusion Models.',
      topics: [
        'Backpropagation Matrix Calculus',
        'Convolutional & Recurrent Feature Extraction',
        'Self-Attention Mechanism & Transformers',
        'Contrastive Learning & Latent Embeddings',
        'RLHF & Alignment Strategies'
      ]
    }
  ];

  const handleSelectPreset = (track: typeof presetTracks[0]) => {
    soundFX.playCoin();
    setSubject(track.title);
    setTopics(track.topics);
  };

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    setTopics(prev => [...prev, newTopicInput.trim()]);
    setNewTopicInput('');
    soundFX.playCoin();
  };

  const handleRemoveTopic = (idx: number) => {
    setTopics(prev => prev.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    soundFX.playAlert();
    try {
      await api.generateCustomSyllabus({
        subject,
        target_date: targetDate,
        daily_available_hours: dailyHours,
        difficulty_preference: difficulty,
        topics
      });
      soundFX.playLevelUp();
      onSyllabusGenerated();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 select-none">
      {/* Top Banner */}
      <div className="clay-card-mint p-6 rounded-[36px] border-4 border-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-[#2D5A42]">
            🧙
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1E3A2B]">
              Goal & Syllabus Setup Wizard
            </h2>
            <p className="text-xs font-semibold text-[#4B6B59] mt-0.5">
              Step {step} of 3: {step === 1 ? 'Choose Knowledge Domain' : step === 2 ? 'Calibrate Bandwidth' : 'Customize & Deploy'}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${
                step === s
                  ? 'bg-[#EB8B68] text-white shadow-sm'
                  : step > s
                  ? 'bg-[#D4E8DD] text-[#2D5A42]'
                  : 'bg-white text-[#A89D93]'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="clay-card p-7 sm:p-8 rounded-[40px] border-4 border-white space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#2E241E]">
              Select Syllabus Track or Enter Custom Academic Course
            </h3>
            <p className="text-xs font-semibold text-[#8B7E74]">
              Pick a domain preset or create your own custom study path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presetTracks.map((track) => {
              const isSelected = subject === track.title;
              return (
                <div
                  key={track.title}
                  onClick={() => handleSelectPreset(track)}
                  className={`p-5 rounded-3xl border-3 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'clay-card-peach border-white shadow-md scale-[1.02]'
                      : 'bg-[#FAF6F0] hover:bg-[#F4EFE6] border-[#EDE5DA]'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-3xl p-2 rounded-2xl bg-white shadow-sm inline-block">{track.icon}</span>
                    <h4 className="font-extrabold text-xs text-[#2E241E]">{track.title}</h4>
                    <p className="text-xs font-semibold text-[#6E5D50]">{track.desc}</p>
                  </div>
                  <div className="text-[11px] font-black text-[#EB8B68]">
                    {track.topics.length} Chapters
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#F0EBE2] space-y-2">
            <label className="text-xs font-bold text-[#5C5046] block uppercase">Custom Subject Title:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full clay-input px-4 py-3 text-xs text-[#2E241E] font-semibold"
              placeholder="e.g. Operating Systems / Deep Learning / Web Security"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => { soundFX.playCoin(); setStep(2); }}
              className="clay-button-peach px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2"
            >
              <span>Next: Timeline & Hours</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="clay-card p-7 sm:p-8 rounded-[40px] border-4 border-white space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#2E241E]">
              Calibrate Study Bandwidth & Deadlines
            </h3>
            <p className="text-xs font-semibold text-[#8B7E74]">
              The AI Scheduler balances daily quest workload according to your capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5C5046] flex items-center gap-1.5 uppercase">
                <Calendar className="w-4 h-4 text-[#EB8B68]" />
                <span>Target Exam / Mastery Date:</span>
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full clay-input px-4 py-3 text-xs text-[#2E241E] font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5C5046] flex items-center gap-1.5 uppercase">
                <Clock className="w-4 h-4 text-[#EB8B68]" />
                <span>Daily Availability: <strong>{dailyHours} Hours/Day</strong></span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-[#EB8B68] mt-2"
              />
              <div className="flex justify-between text-[10px] text-[#8B7E74] font-bold">
                <span>1 Hour</span>
                <span>4 Hours</span>
                <span>8 Hours</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5C5046] block uppercase">Pacing Preference:</label>
            <div className="grid grid-cols-3 gap-3">
              {['Steady & Methodical', 'Balanced', 'Intensive Bootcamp'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`p-3 rounded-2xl border-2 text-xs font-bold text-center transition-all ${
                    difficulty === d
                      ? 'bg-[#FAD4C0] border-[#EB8B68] text-[#3E2318]'
                      : 'bg-[#FAF6F0] border-[#EDE5DA] text-[#6E5D50]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#F0EBE2]">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-2xl bg-[#F0EBE2] text-[#5C5046] text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => { soundFX.playCoin(); setStep(3); }}
              className="clay-button-peach px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2"
            >
              <span>Next: Chapters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="clay-card p-7 sm:p-8 rounded-[40px] border-4 border-white space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#2E241E]">
              Customize Chapters & Deploy Planner
            </h3>
            <p className="text-xs font-semibold text-[#8B7E74]">
              Review the syllabus chapters the AI agent will convert into quests and calendar blocks.
            </p>
          </div>

          {/* Topics List */}
          <div className="space-y-2">
            {topics.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#EDE5DA] flex items-center justify-between text-xs font-bold text-[#2E241E]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-xl bg-white shadow-sm flex items-center justify-center text-[10px] text-[#EB8B68]">
                    {idx + 1}
                  </span>
                  <span>{t}</span>
                </div>
                <button
                  onClick={() => handleRemoveTopic(idx)}
                  className="text-[#8B7E74] hover:text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopicInput}
              onChange={(e) => setNewTopicInput(e.target.value)}
              placeholder="Add another topic..."
              className="flex-1 clay-input px-3.5 py-2.5 text-xs text-[#2E241E] font-semibold"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddTopic(); }}
            />
            <button
              onClick={handleAddTopic}
              className="px-4 py-2.5 rounded-2xl bg-[#F0EBE2] hover:bg-[#E8E1D6] text-[#5C5046] text-xs font-bold"
            >
              + Add
            </button>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#F0EBE2]">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-2xl bg-[#F0EBE2] text-[#5C5046] text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              disabled={isGenerating || topics.length === 0}
              onClick={handleGenerate}
              className="clay-button-peach px-8 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Timetable...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Deploy Campaign & Schedule</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
