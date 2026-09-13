"""
In-Memory State Store with reset, simulation, and persistence capabilities.
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
from models.database import (
    StudentProfile, SkillNode, Quest, CalendarBlock, Campaign,
    QuizQuestion, RemedialResource, RewardItem, AgentThoughtLog
)
from data.seed_data import (
    INITIAL_PROFILE, INITIAL_CAMPAIGNS, generate_initial_quests_and_calendar,
    INITIAL_SKILL_NODES, INITIAL_REWARDS, QUIZ_QUESTION_BANK,
    REMEDIAL_KNOWLEDGE_BASE, INITIAL_THOUGHT_LOGS
)
from agent.engine import AutonomousAgentEngine

class OracleStore:
    def __init__(self):
        self.agent_engine = AutonomousAgentEngine()
        self.reset_to_default()

    def reset_to_default(self):
        self.profile = INITIAL_PROFILE.model_copy(deep=True)
        self.campaigns = [c.model_copy(deep=True) for c in INITIAL_CAMPAIGNS]
        quests, calendar = generate_initial_quests_and_calendar()
        self.quests = quests
        self.calendar = calendar
        self.skill_nodes = [s.model_copy(deep=True) for s in INITIAL_SKILL_NODES]
        self.rewards = [r.model_copy(deep=True) for r in INITIAL_REWARDS]
        self.quiz_questions = [q.model_copy(deep=True) for q in QUIZ_QUESTION_BANK]
        self.remedial_resources = [rem.model_copy(deep=True) for rem in REMEDIAL_KNOWLEDGE_BASE]
        self.thought_logs = [l.model_copy(deep=True) for l in INITIAL_THOUGHT_LOGS]
        self.active_dialogue = self.agent_engine.persona.get_greeting(
            self.profile.name, self.profile.rank, self.profile.streak_days
        )

    def log_thought(self, phase: str, trigger_event: str, summary: str, details: Dict[str, Any], mood: str = "thinking"):
        log = AgentThoughtLog(
            id=f"log-{int(datetime.now().timestamp())}-{len(self.thought_logs)}",
            timestamp=datetime.now().strftime("%H:%M:%S"),
            phase=phase,
            trigger_event=trigger_event,
            thought_summary=summary,
            details=details,
            mood=mood
        )
        self.thought_logs.insert(0, log)
        if len(self.thought_logs) > 50:
            self.thought_logs = self.thought_logs[:50]
        return log

# Singleton instance
store = OracleStore()
