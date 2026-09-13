/**
 * API Service Client for Oracle Backend
 */

export interface AvatarConfig {
  hair_style: string;
  hair_color: string;
  outfit_color: string;
  skin_tone: string;
  headphones: string;
  accessory: string;
  expression: string;
  mascot: string;
  background_aura: string;
}

export interface StudentBadge {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  title: string;
  rank: 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  level: number;
  xp: number;
  next_level_xp: number;
  gold: number;
  credit_points: number;
  streak_days: number;
  streak_shield_active: boolean;
  dda_mode: string;
  rolling_mastery: number;
  diagnostic_accuracy?: number;
  total_study_minutes?: number;
  quests_completed_count?: number;
  active_campaign_id: string;
  daily_available_hours: number;
  exam_target_date: string;
  character_class: string;
  avatar_url?: string;
  avatar_config?: AvatarConfig;
  badges?: StudentBadge[];
}

export interface SkillNode {
  id: string;
  name: string;
  branch: string;
  level: number;
  max_level: number;
  xp_cost: number;
  unlocked: boolean;
  icon: string;
  description: string;
  prerequisites: string[];
  bonus_perk: string;
}

export interface Quest {
  id: string;
  campaign_id: string;
  title: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  xp_reward: number;
  gold_reward: number;
  estimated_minutes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'remedial_active' | 'paused' | 'missed';
  prerequisite_quest_ids: string[];
  scheduled_date: string;
  scheduled_time: string;
  is_remedial: boolean;
  remedial_reason?: string;
  mastery_score?: number;
}

export interface CalendarBlock {
  id: string;
  quest_id?: string;
  title: string;
  topic: string;
  subtopic?: string;
  date_str: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  status: 'upcoming' | 'completed' | 'missed' | 'replanned' | 'conflict';
  is_remedial: boolean;
  note?: string;
  original_date?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  icon: string;
  total_quests: number;
  completed_quests: number;
  target_date: string;
  status: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  question: string;
  code_snippet?: string;
  options: string[];
  correct_idx: number;
  explanation: string;
  hint: string;
}

export interface RemedialResource {
  id: string;
  subtopic: string;
  topic: string;
  title: string;
  summary: string;
  key_takeaways: string[];
  code_analogy: string;
  code_example?: string;
  practice_drill: string;
  difficulty_fix: string;
  estimated_read_min: number;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  category: 'real_world' | 'in_game';
  coin_cost: number;
  icon: string;
  is_custom: boolean;
  redeemed_count: number;
}

export interface AgentThoughtLog {
  id: string;
  timestamp: string;
  phase: 'Analyze' | 'Diagnose' | 'Fetch' | 'Reschedule' | 'Notify';
  trigger_event: string;
  thought_summary: string;
  details: Record<string, unknown>;
  mood: string;
}

export interface DialogueInfo {
  mood: string;
  dialogue: string;
  action_notice?: string;
  audio_cue?: string;
}

const API_BASE = (typeof window !== 'undefined' && window.location.origin) ? `${window.location.origin}/api` : "http://localhost:8000/api";

export const api = {
  // Auth
  async getPresetHeroes() {
    const res = await fetch(`${API_BASE}/auth/presets`);
    return res.json();
  },
  async login(username: string, character_class: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, character_class })
    });
    return res.json();
  },
  async switchHero(heroId: string) {
    const res = await fetch(`${API_BASE}/auth/switch-hero/${heroId}`, {
      method: "POST"
    });
    return res.json();
  },
  async updateAvatar(config: Partial<AvatarConfig>) {
    const res = await fetch(`${API_BASE}/auth/avatar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });
    return res.json();
  },
  async updateProfile(details: { name?: string; email?: string; bio?: string; character_class?: string; daily_available_hours?: number; exam_target_date?: string }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details)
    });
    return res.json();
  },
  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`);
    return res.json();
  },

  // Campaigns & Quests
  async getCampaigns() {
    const res = await fetch(`${API_BASE}/campaigns`);
    return res.json();
  },
  async getQuests(campaign_id?: string) {
    const url = campaign_id ? `${API_BASE}/campaigns/quests?campaign_id=${campaign_id}` : `${API_BASE}/campaigns/quests`;
    const res = await fetch(url);
    return res.json();
  },
  async completeQuest(questId: string) {
    const res = await fetch(`${API_BASE}/campaigns/quest/${questId}/complete`, {
      method: "POST"
    });
    return res.json();
  },
  async generateCustomSyllabus(payload: {
    subject: string;
    target_date: string;
    daily_available_hours: number;
    difficulty_preference: string;
    topics: string[];
  }) {
    const res = await fetch(`${API_BASE}/campaigns/wizard/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Calendar
  async getCalendar() {
    const res = await fetch(`${API_BASE}/calendar`);
    return res.json();
  },
  async updateBlockStatus(blockId: string, status: string) {
    const res = await fetch(`${API_BASE}/calendar/block/${blockId}/status?status=${status}`, {
      method: "POST"
    });
    return res.json();
  },
  async registerConflict(payload: { conflict_date: string; hours_blocked: number; reason: string }) {
    const res = await fetch(`${API_BASE}/calendar/conflict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Diagnostic
  async getQuestions(topic?: string, subtopic?: string) {
    const params = new URLSearchParams();
    if (topic) params.append("topic", topic);
    if (subtopic) params.append("subtopic", subtopic);
    const res = await fetch(`${API_BASE}/diagnostic/questions?${params.toString()}`);
    return res.json();
  },
  async submitQuiz(payload: { topic: string; subtopic: string; answers: Record<string, number> }) {
    const res = await fetch(`${API_BASE}/diagnostic/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Gamification
  async getGamificationProfile() {
    const res = await fetch(`${API_BASE}/gamification/profile`);
    return res.json();
  },
  async upgradeSkill(nodeId: string) {
    const res = await fetch(`${API_BASE}/gamification/skill/${nodeId}/upgrade`, {
      method: "POST"
    });
    return res.json();
  },
  async redeemReward(rewardId: string) {
    const res = await fetch(`${API_BASE}/gamification/rewards/${rewardId}/redeem`, {
      method: "POST"
    });
    return res.json();
  },
  async addCustomReward(payload: { title: string; description: string; coin_cost: number; icon: string; category: string }) {
    const res = await fetch(`${API_BASE}/gamification/rewards/custom`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Remedial
  async getRemedialResources() {
    const res = await fetch(`${API_BASE}/remedial`);
    return res.json();
  },
  async getRemedialForSubtopic(subtopic: string) {
    const res = await fetch(`${API_BASE}/remedial/${encodeURIComponent(subtopic)}`);
    return res.json();
  },

  // Simulation (Judge Demo Deck)
  async getThoughtLogs() {
    const res = await fetch(`${API_BASE}/simulation/logs`);
    return res.json();
  },
  async simulateQuizFailure(subtopic = "Dijkstras Algorithm", topic = "Graphs") {
    const res = await fetch(`${API_BASE}/simulation/trigger-quiz-failure?subtopic=${encodeURIComponent(subtopic)}&topic=${encodeURIComponent(topic)}`, {
      method: "POST"
    });
    return res.json();
  },
  async simulateMissedSession() {
    const res = await fetch(`${API_BASE}/simulation/trigger-missed-session`, {
      method: "POST"
    });
    return res.json();
  },
  async simulateEmergencyConflict() {
    const res = await fetch(`${API_BASE}/simulation/trigger-emergency-conflict`, {
      method: "POST"
    });
    return res.json();
  },
  async simulateAceStreak() {
    const res = await fetch(`${API_BASE}/simulation/trigger-ace-streak`, {
      method: "POST"
    });
    return res.json();
  },
  async resetSimulation() {
    const res = await fetch(`${API_BASE}/simulation/reset`, {
      method: "POST"
    });
    return res.json();
  }
};
