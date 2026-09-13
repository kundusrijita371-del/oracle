import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { GuildHallOverview } from './components/dashboard/GuildHallOverview';
import { DynamicCalendarView } from './components/calendar/DynamicCalendarView';
import { AdaptiveResourceHub } from './components/remedial/AdaptiveResourceHub';
import { SkillTreeView } from './components/gamification/SkillTreeView';
import { RewardMarketplace } from './components/gamification/RewardMarketplace';
import { SyllabusWizard } from './components/wizard/SyllabusWizard';
import { AgentThoughtLogView } from './components/agent/AgentThoughtLog';
import { QuizEngineModal } from './components/diagnostic/QuizEngineModal';
import { JudgeDemoDeck } from './components/agent/JudgeDemoDeck';
import { AvatarProfileSection } from './components/profile/AvatarProfileSection';
import {
  api, StudentProfile, Campaign, Quest, CalendarBlock,
  SkillNode, RewardItem, AgentThoughtLog, DialogueInfo
} from './services/api';

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // App Data State
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [calendar, setCalendar] = useState<CalendarBlock[]>([]);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [thoughtLogs, setThoughtLogs] = useState<AgentThoughtLog[]>([]);
  const [dialogue, setDialogue] = useState<DialogueInfo>({
    mood: 'tactical',
    dialogue: 'Welcome to the Guild Hall, Adventurer. Your autonomous learning loop is online.'
  });

  // Modals & Sub-views
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState({ topic: 'Graphs', subtopic: 'Dijkstras Algorithm' });
  const [judgeDeckOpen, setJudgeDeckOpen] = useState(false);
  const [selectedRemedialSubtopic, setSelectedRemedialSubtopic] = useState<string | undefined>(undefined);

  const loadAllData = async () => {
    try {
      const userRes = await api.getCurrentUser();
      if (userRes?.profile) {
        setProfile(userRes.profile);
        setDialogue(userRes.active_dialogue);
      }

      const campRes = await api.getCampaigns();
      if (campRes?.campaigns) setCampaigns(campRes.campaigns);

      const qRes = await api.getQuests();
      if (Array.isArray(qRes)) setQuests(qRes);

      const calRes = await api.getCalendar();
      if (calRes?.blocks) setCalendar(calRes.blocks);

      const gamRes = await api.getGamificationProfile();
      if (gamRes?.skill_nodes) setSkillNodes(gamRes.skill_nodes);
      if (gamRes?.rewards) setRewards(gamRes.rewards);

      const logRes = await api.getThoughtLogs();
      if (Array.isArray(logRes)) setThoughtLogs(logRes);
    } catch (e) {
      console.error("Failed to load initial data:", e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLoginSuccess = async (loginInfo: { name: string; character_class: string }) => {
    try {
      const res = await api.login(loginInfo.name, loginInfo.character_class);
      if (res?.profile) {
        setProfile(res.profile);
        setDialogue(res.active_dialogue);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(true);
    loadAllData();
  };

  const handleOpenQuiz = (topic: string, subtopic: string) => {
    setQuizTopic({ topic, subtopic });
    setQuizModalOpen(true);
  };

  const handleOpenRemedial = (subtopic: string) => {
    setSelectedRemedialSubtopic(subtopic);
    setActiveTab('remedial');
  };

  const handleCompleteQuest = async (questId: string) => {
    try {
      const res = await api.completeQuest(questId);
      if (res?.profile) setProfile(res.profile);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCalendarStatus = async (blockId: string, status: string) => {
    try {
      const res = await api.updateBlockStatus(blockId, status);
      if (res?.dialogue) setDialogue(res.dialogue);
      if (res?.profile) setProfile(res.profile);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterConflict = async (conflict_date: string, hours_blocked: number) => {
    try {
      const res = await api.registerConflict({
        conflict_date,
        hours_blocked,
        reason: 'Emergency Calendar Conflict'
      });
      if (res?.dialogue) setDialogue(res.dialogue);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpgradeSkill = async (nodeId: string) => {
    try {
      const res = await api.upgradeSkill(nodeId);
      if (res?.profile) setProfile(res.profile);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const res = await api.redeemReward(rewardId);
      if (res?.profile) setProfile(res.profile);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCustomReward = async (newReward: any) => {
    try {
      await api.addCustomReward(newReward);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulationUpdate = (res: any) => {
    if (res?.dialogue) setDialogue(res.dialogue);
    if (res?.profile) setProfile(res.profile);
    loadAllData();
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard';
      case 'profile': return 'Avatar Studio & Scholar Profile';
      case 'calendar': return 'Adaptive Calendar';
      case 'diagnostic': return 'Diagnostic Hub';
      case 'remedial': return 'Remedial RAG';
      case 'skills': return 'Skill Tree';
      case 'rewards': return 'Life Marketplace';
      case 'wizard': return 'Syllabus Wizard';
      case 'logs': return 'Agent Thoughts';
      default: return 'Dashboard';
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#2E241E] p-4 sm:p-6 lg:p-8 font-inter">
      {/* 3D Clay Outer App Container matching Pinterest Dashboard */}
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-6">
        {/* Left 3D Sage Green Sidebar */}
        <Sidebar
          profile={profile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenJudgeDeck={() => setJudgeDeckOpen(true)}
          onSwitchHero={() => setIsLoggedIn(false)}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col space-y-6">
          {/* Top 3D Navbar */}
          <TopNavbar
            pageTitle={getPageTitle()}
            profile={profile}
            audioEnabled={audioEnabled}
            setAudioEnabled={setAudioEnabled}
            onOpenJudgeDeck={() => setJudgeDeckOpen(true)}
            onSwitchHero={() => setIsLoggedIn(false)}
            onOpenProfile={() => setActiveTab('profile')}
          />

          {/* Tab Views */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <GuildHallOverview
                profile={profile || ({} as StudentProfile)}
                campaigns={campaigns}
                quests={quests}
                dialogue={dialogue}
                onTakeQuiz={handleOpenQuiz}
                onViewRemedial={handleOpenRemedial}
                onCompleteQuest={handleCompleteQuest}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'profile' && (
              <AvatarProfileSection
                profile={profile || ({} as StudentProfile)}
                onProfileUpdated={loadAllData}
              />
            )}

            {activeTab === 'calendar' && (
              <DynamicCalendarView
                calendar={calendar}
                onUpdateStatus={handleUpdateCalendarStatus}
                onRegisterConflict={handleRegisterConflict}
              />
            )}

            {activeTab === 'diagnostic' && (
              <div className="space-y-6 select-none">
                <div className="clay-card-yellow p-6 rounded-[36px] border-4 border-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-[#8B6810]">
                      🧪
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#3E2B08]">
                        Diagnostic Quiz Trials
                      </h2>
                      <p className="text-xs font-semibold text-[#6E5014] mt-0.5">
                        Test your algorithmic competence. Scoring below 60% automatically triggers timetable replanning.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { topic: 'Graphs', subtopic: 'Dijkstras Algorithm', diff: 'Hard', icon: '⚡', desc: 'Shortest paths, priority queue mechanics, and negative cycle invariants.' },
                    { topic: 'Graphs', subtopic: 'Breadth-First Search', diff: 'Easy', icon: '🌐', desc: 'Layered queue exploration and unweighted shortest paths.' },
                    { topic: 'Dynamic Programming', subtopic: '1D DP Memoization', diff: 'Medium', icon: '💎', desc: 'Optimal substructure, overlapping subproblems, and state transitions.' },
                    { topic: 'Systems', subtopic: 'Raft Consensus', diff: 'Hard', icon: '🛡️', desc: 'Leader election, log replication, and split-brain resolution.' }
                  ].map((trial, idx) => (
                    <div key={idx} className="clay-card p-6 rounded-[36px] border-4 border-white space-y-3 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl p-2.5 rounded-2xl bg-[#F7F2EA] shadow-sm inline-block">{trial.icon}</span>
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-[#FDECC8] text-[#735A22]">
                            {trial.diff}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-[#2E241E]">{trial.subtopic}</h4>
                        <p className="text-xs font-semibold text-[#8B7E74]">{trial.desc}</p>
                      </div>

                      <button
                        onClick={() => handleOpenQuiz(trial.topic, trial.subtopic)}
                        className="w-full clay-button-peach py-2.5 rounded-2xl text-xs font-black"
                      >
                        Launch Assessment Trial
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'remedial' && (
              <AdaptiveResourceHub
                onTakeQuiz={handleOpenQuiz}
                selectedSubtopic={selectedRemedialSubtopic}
              />
            )}

            {activeTab === 'skills' && (
              <SkillTreeView
                skillNodes={skillNodes}
                profile={profile || ({} as StudentProfile)}
                onUpgradeSkill={handleUpgradeSkill}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardMarketplace
                rewards={rewards}
                profile={profile || ({} as StudentProfile)}
                onRedeemReward={handleRedeemReward}
                onAddCustomReward={handleAddCustomReward}
              />
            )}

            {activeTab === 'wizard' && (
              <SyllabusWizard
                onSyllabusGenerated={() => {
                  setActiveTab('overview');
                  loadAllData();
                }}
              />
            )}

            {activeTab === 'logs' && (
              <AgentThoughtLogView
                logs={thoughtLogs}
                onRefreshLogs={loadAllData}
              />
            )}
          </main>
        </div>
      </div>

      {/* Interactive Modals */}
      {quizModalOpen && (
        <QuizEngineModal
          topic={quizTopic.topic}
          subtopic={quizTopic.subtopic}
          onClose={() => setQuizModalOpen(false)}
          onQuizCompleted={loadAllData}
          onViewRemedial={(sub) => {
            setQuizModalOpen(false);
            handleOpenRemedial(sub);
          }}
        />
      )}

      <JudgeDemoDeck
        isOpen={judgeDeckOpen}
        onClose={() => setJudgeDeckOpen(false)}
        onSimulationTriggered={handleSimulationUpdate}
      />
    </div>
  );
};
