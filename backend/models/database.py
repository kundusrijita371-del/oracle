"""
Database models and in-memory persistent store for Oracle.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date

class StudentProfile(BaseModel):
    id: str = "hero-1"
    name: str = "Alex Rivers"
    email: str = "alex.rivers@liferpg.academy"
    bio: str = "Aspiring Software Engineer & Algorithm Knight preparing for Autumn 2026 Technical Mastery."
    title: str = "F-Rank Novice"
    rank: str = "F"  # F, E, D, C, B, A, S
    level: int = 1
    xp: int = 150
    next_level_xp: int = 500
    gold: int = 280
    credit_points: int = 1450
    streak_days: int = 4
    streak_shield_active: bool = False
    dda_mode: str = "Adventurer"  # Novice, Adventurer, Master, Nightmare
    rolling_mastery: float = 68.5  # 0 to 100%
    diagnostic_accuracy: float = 78.4
    total_study_minutes: int = 840
    quests_completed_count: int = 18
    active_campaign_id: str = "camp-dsa"
    daily_available_hours: float = 3.0
    exam_target_date: str = "2026-10-30"
    avatar_url: str = "/login-ref.jpg"
    character_class: str = "Algorithm Apprentice"
    avatar_config: Dict[str, Any] = Field(default_factory=lambda: {
        "hair_style": "bun",
        "hair_color": "#6B4423",
        "outfit_color": "#B8A4E3",
        "skin_tone": "#FFE0BD",
        "headphones": "pink",
        "accessory": "none",
        "expression": "happy",
        "mascot": "cat",
        "background_aura": "lavender"
    })
    badges: List[Dict[str, str]] = Field(default_factory=lambda: [
        {"id": "b-graph", "name": "Graph Cartographer", "icon": "🌐", "desc": "Cleared BFS and DFS Traversals with >85% score"},
        {"id": "b-streak", "name": "Flame of Discipline", "icon": "🔥", "desc": "Maintained a 4+ day consecutive quest streak"},
        {"id": "b-diagnose", "name": "Diagnostic Voyager", "icon": "🩺", "desc": "Completed 5 diagnostic knowledge audits"},
        {"id": "b-remedial", "name": "Adaptive Scholar", "icon": "📚", "desc": "Synthesized 3 remedial RAG learning decks"},
        {"id": "b-gold", "name": "Bounty Hunter", "icon": "🪙", "desc": "Accumulated over 500 lifetime Quest Gold"}
    ])

class SkillNode(BaseModel):
    id: str
    name: str
    branch: str  # "Algorithms", "Data Structures", "Systems", "AI & Math"
    level: int
    max_level: int = 5
    xp_cost: int = 100
    unlocked: bool = False
    icon: str
    description: str
    prerequisites: List[str] = []
    bonus_perk: str

class Quest(BaseModel):
    id: str
    campaign_id: str
    title: str
    topic: str
    subtopic: str
    difficulty: str  # "Easy", "Medium", "Hard", "Boss"
    xp_reward: int
    gold_reward: int
    estimated_minutes: int
    status: str  # "pending", "in_progress", "completed", "missed", "remedial_active", "paused"
    prerequisite_quest_ids: List[str] = []
    scheduled_date: str  # YYYY-MM-DD
    scheduled_time: str  # HH:MM
    is_remedial: bool = False
    remedial_reason: Optional[str] = None
    mastery_score: Optional[float] = None

class CalendarBlock(BaseModel):
    id: str
    quest_id: Optional[str] = None
    title: str
    topic: str
    subtopic: Optional[str] = None
    date_str: str  # YYYY-MM-DD
    start_time: str  # HH:MM
    end_time: str  # HH:MM
    duration_min: int = 60
    status: str  # "upcoming", "completed", "missed", "replanned", "conflict"
    is_remedial: bool = False
    note: Optional[str] = None
    original_date: Optional[str] = None

class Campaign(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    total_quests: int
    completed_quests: int
    target_date: str
    status: str  # "active", "completed", "locked"
    category: str

class QuizQuestion(BaseModel):
    id: str
    topic: str
    subtopic: str
    difficulty: str
    question: str
    code_snippet: Optional[str] = None
    options: List[str]
    correct_idx: int
    explanation: str
    hint: str

class QuizSubmission(BaseModel):
    topic: str
    subtopic: str
    answers: Dict[str, int]  # question_id -> selected_idx
    time_spent_seconds: int = 120

class RemedialResource(BaseModel):
    id: str
    subtopic: str
    topic: str
    title: str
    summary: str
    key_takeaways: List[str]
    code_analogy: str
    code_example: Optional[str] = None
    practice_drill: str
    difficulty_fix: str
    estimated_read_min: int = 5

class RewardItem(BaseModel):
    id: str
    title: str
    description: str
    category: str  # "real_world", "in_game"
    coin_cost: int
    icon: str
    is_custom: bool = False
    redeemed_count: int = 0
    cooldown_hours: Optional[int] = None

class AgentThoughtLog(BaseModel):
    id: str
    timestamp: str
    phase: str  # "Analyze", "Diagnose", "Fetch", "Reschedule", "Notify"
    trigger_event: str
    thought_summary: str
    details: Dict[str, Any]
    mood: str  # "thinking", "alert", "celebration", "tactical", "stern"
