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
import { FloatingLootProvider } from './components/gamification/FloatingLootManager';
import { LevelUpOverlay } from './components/gamification/LevelUpOverlay';
import { BossRaidExamModal } from './components/diagnostic/BossRaidExamModal';
import { GuildMasterDialogue, GuildMasterMessage } from './components/agent/GuildMasterDialogue';
import {
  api, StudentProfile, Campaign, Quest, CalendarBlock,
  SkillNode, RewardItem, AgentThoughtLog, DialogueInfo
} from './services/api';
import { 
  subscribeToAuthChanges, 
  logoutUser, 
  fetchUserProfileFromFirestore, 
  saveUserProfileToFirestore 
} from './services/firebase';

const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  id: "guest-alex",
  name: "Alex Rivers",
  email: "scholar@oracle.ai",
  bio: "Adventurer in the realm of knowledge. Seeking mastery across all domains.",
  title: "Novice Apprentice",
  rank: "F",
  level: 1,
  xp: 120,
  next_level_xp: 500,
  gold: 250,
  credit_points: 2500,
  streak_days: 3,
  streak_shield_active: false,
  dda_mode: "Dynamic Flow (Active)",
  rolling_mastery: 85.0,
  diagnostic_accuracy: 88,
  total_study_minutes: 840,
  quests_completed_count: 12,
  active_campaign_id: "camp-001",
  daily_available_hours: 4,
  exam_target_date: "2026-10-15",
  character_class: "Algorithm Apprentice",
  avatar_config: {
    hair_style: "layered",
    hair_color: "#6366f1",
    outfit_color: "#1e1b4b",
    skin_tone: "#ffd1a4",
    headphones: "cat-ears",
    accessory: "matrix-glasses",
    expression: "confident",
    mascot: "cat",
    background_aura: "aurora"
  },
  badges: []
};

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // App Data State
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_STUDENT_PROFILE);
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

  // RPG Boss & Level-Up Modals
  const [bossModalOpen, setBossModalOpen] = useState(false);
  const [bossTopic, setBossTopic] = useState('Graphs & Dynamic Programming');
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [showDialogueToast, setShowDialogueToast] = useState(true);

  const loadAllData = async () => {
    try {
      const userRes = await api.getCurrentUser();
      if (userRes?.profile) {
        setProfile(prev => ({ ...DEFAULT_STUDENT_PROFILE, ...prev, ...userRes.profile }));
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

    // Listen to Firebase Auth state
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (user) {
        const firestoreProf = await fetchUserProfileFromFirestore(user.uid);
        if (firestoreProf) {
          setProfile(prev => ({ ...DEFAULT_STUDENT_PROFILE, ...prev, ...firestoreProf }));
        }
        setIsLoggedIn(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = async (loginInfo: any) => {
    const fullProfile = { ...DEFAULT_STUDENT_PROFILE, ...(profile || {}), ...loginInfo };
    try {
      if (loginInfo.id && !loginInfo.id.startsWith('guest-')) {
        await saveUserProfileToFirestore(loginInfo.id, fullProfile);
      }
      setProfile(fullProfile);
      const res = await api.login(loginInfo.name || fullProfile.name, loginInfo.character_class || fullProfile.character_class);
      if (res?.profile) {
        setDialogue(res.active_dialogue);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(true);
    loadAllData();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Logout error:", e);
    }
    setIsLoggedIn(false);
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

  const handleOpenBossRaid = (topic: string = "Graphs & Dynamic Programming") => {
    setBossTopic(topic);
    setBossModalOpen(true);
  };

  const handleBossVictory = (xpEarned: number, goldEarned: number) => {
    if (profile) {
      const nextXp = profile.xp + xpEarned;
      const nextGold = profile.gold + goldEarned;
      const nextLevel = profile.level + 1;
      setProfile({
        ...profile,
        xp: nextXp,
        gold: nextGold,
        level: nextLevel
      });
      setLevelUpModalOpen(true);
    }
  };

  const handleGuildMasterAction = (action: string) => {
    if (action === 'boss') {
      handleOpenBossRaid();
    } else if (action === 'boost') {
      setDialogue({
        mood: 'motivation',
        dialogue: '🔥 Focus Surge Activated! Eliminate all distractions. Your retention efficiency is heightened by +25%.'
      });
    } else if (action === 'lore') {
      setDialogue({
        mood: 'lore',
        dialogue: '📜 Ancient Codex Lore: Greedy selection in Dijkstra guarantees shortest path optimality only when all edge weights are non-negative.'
      });
    }
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
    <FloatingLootProvider>
      <div className="min-h-screen bg-[#F7F2EA] text-[#2E241E] p-4 sm:p-6 lg:p-8 font-inter">
        {/* 3D Clay Outer App Container matching Pinterest Dashboard */}
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-6">
          {/* Left 3D Sage Green Sidebar */}
          <Sidebar
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenJudgeDeck={() => setJudgeDeckOpen(true)}
            onSwitchHero={handleLogout}
            onLogout={handleLogout}
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
              onSwitchHero={handleLogout}
              onLogout={handleLogout}
              onOpenProfile={() => setActiveTab('profile')}
              onOpenBossRaid={() => handleOpenBossRaid()}
              onTriggerLevelUp={() => setLevelUpModalOpen(true)}
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
                  onOpenBossRaid={() => handleOpenBossRaid()}
                  onSummonGuildMaster={() => setShowDialogueToast(true)}
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
                  {/* Boss Fight CTA Card */}
                  <div className="clay-card p-6 rounded-[36px] border-4 border-amber-400 bg-gradient-to-r from-[#201533] via-[#2F1D4A] to-[#1D1130] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-red-600/30 border-2 border-red-400 flex items-center justify-center text-3xl shrink-0 animate-pulse">
                        ⚔️
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40 mb-1">
                          Mythic Exam Encounter
                        </div>
                        <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-300">
                          Boss Raid Exam: Chronos The Titan
                        </h3>
                        <p className="text-xs text-amber-100/70 font-semibold">
                          Engage in an epic combat trial with a real-time Boss HP bar and legendary relic drops!
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBossRaid()}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white font-black text-xs shadow-lg hover:scale-105 transition-all whitespace-nowrap"
                    >
                      Enter Boss Arena
                    </button>
                  </div>

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

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenQuiz(trial.topic, trial.subtopic)}
                            className="flex-1 clay-button-peach py-2.5 rounded-2xl text-xs font-black"
                          >
                            Standard Quiz
                          </button>
                          <button
                            onClick={() => handleOpenBossRaid(trial.subtopic)}
                            className="px-3 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black shadow-sm hover:scale-105 transition-transform"
                            title="Fight as Boss Raid"
                          >
                            ⚔️
                          </button>
                        </div>
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

        {/* AI Guild Master Styled Dialogue Box Toast */}
        {showDialogueToast && (
          <GuildMasterDialogue
            message={{
              mood: (dialogue.mood as any) || 'tactical',
              dialogue: dialogue.dialogue,
              companionName: profile?.character_class ? `Sage (${profile.character_class})` : 'Sage Sylva'
            }}
            onDismiss={() => setShowDialogueToast(false)}
            onActionClick={handleGuildMasterAction}
          />
        )}

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

        {/* Boss Raid Exam Modal */}
        <BossRaidExamModal
          isOpen={bossModalOpen}
          onClose={() => setBossModalOpen(false)}
          onVictory={handleBossVictory}
          bossTopic={bossTopic}
        />

        {/* Anime Level-Up Fullscreen Overlay */}
        <LevelUpOverlay
          isOpen={levelUpModalOpen}
          onClose={() => setLevelUpModalOpen(false)}
          newLevel={profile ? profile.level + 1 : 15}
          newRank={profile?.rank ? `${profile.rank}-Rank Grand Scholar` : 'S-Rank Grand Scholar'}
          characterClass={profile?.character_class || 'Spellblade Scholar'}
        />

        <JudgeDemoDeck
          isOpen={judgeDeckOpen}
          onClose={() => setJudgeDeckOpen(false)}
          onSimulationTriggered={handleSimulationUpdate}
        />
      </div>
    </FloatingLootProvider>
  );
};
