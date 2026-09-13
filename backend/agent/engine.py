"""
Autonomous Agent Engine (AI Guild Master Loop):
Executes the closed feedback loop: Analyze -> Diagnose -> Fetch -> Reschedule -> Notify.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime
from models.database import (
    StudentProfile, Quest, CalendarBlock, AgentThoughtLog, RemedialResource
)
from agent.persona import GuildMasterPersona
from agent.rag_service import EducationalRAGService
from agent.scheduler import DynamicScheduler

class AutonomousAgentEngine:
    def __init__(self):
        self.persona = GuildMasterPersona()
        self.rag = EducationalRAGService()
        self.scheduler = DynamicScheduler()

    def run_feedback_loop_on_quiz(
        self,
        topic: str,
        subtopic: str,
        score_pct: float,
        profile: StudentProfile,
        quests: List[Quest],
        calendar: List[CalendarBlock]
    ) -> Dict[str, Any]:
        """
        Executes the full 5-step feedback loop when a quiz is submitted.
        """
        logs: List[AgentThoughtLog] = []
        is_gap = score_pct < 60.0
        now_str = datetime.now().strftime("%H:%M:%S")

        # 1. ANALYZE PHASE
        log_analyze = AgentThoughtLog(
            id=f"log-{int(datetime.now().timestamp())}-1",
            timestamp=now_str,
            phase="Analyze",
            trigger_event=f"Diagnostic Quiz Finished: {subtopic} ({score_pct:.1f}%)",
            thought_summary=f"Analyzing student performance metrics on subtopic '{subtopic}'. Mastery score: {score_pct:.1f}%. Threshold for mastery pass is 60.0%.",
            details={
                "topic": topic,
                "subtopic": subtopic,
                "score_pct": score_pct,
                "threshold": 60.0,
                "status": "GAP_DETECTED" if is_gap else "MASTERY_ACHIEVED"
            },
            mood="alert" if is_gap else "celebration"
        )
        logs.append(log_analyze)

        # 2. DIAGNOSE PHASE
        if is_gap:
            diagnosis_msg = f"Critical conceptual gap identified in '{subtopic}'. Student struggle detected on invariant validation and edge-case execution."
            mood = "alert"
        else:
            diagnosis_msg = f"Strong competence verified in '{subtopic}'. Prerequisite mastery confirmed for downstream campaign chapters."
            mood = "celebration"

        log_diagnose = AgentThoughtLog(
            id=f"log-{int(datetime.now().timestamp())}-2",
            timestamp=datetime.now().strftime("%H:%M:%S"),
            phase="Diagnose",
            trigger_event="Knowledge Graph Audit",
            thought_summary=diagnosis_msg,
            details={
                "identified_gap": subtopic if is_gap else None,
                "severity": "HIGH (Remedial Required)" if is_gap else "NONE",
                "recommended_action": "FETCH_REMEDIAL_AND_REPLAN" if is_gap else "ADVANCE_CAMPAIGN"
            },
            mood=mood
        )
        logs.append(log_diagnose)

        remedial_material: Optional[RemedialResource] = None
        diff_summary: Dict[str, Any] = {}
        updated_quests = quests
        updated_calendar = calendar

        if is_gap:
            # 3. FETCH PHASE (Educational RAG)
            remedial_material = self.rag.fetch_remedial_material(subtopic, topic)
            log_fetch = AgentThoughtLog(
                id=f"log-{int(datetime.now().timestamp())}-3",
                timestamp=datetime.now().strftime("%H:%M:%S"),
                phase="Fetch",
                trigger_event="Educational RAG Retrieval",
                thought_summary=f"Synthesizing customized remedial knowledge package for '{subtopic}'. Extracted visual code analogies, key invariants, and drill exercise.",
                details={
                    "resource_id": remedial_material.id,
                    "title": remedial_material.title,
                    "key_takeaways_count": len(remedial_material.key_takeaways),
                    "difficulty_fix": remedial_material.difficulty_fix
                },
                mood="thinking"
            )
            logs.append(log_fetch)

            # 4. RESCHEDULE PHASE
            failed_quest = next((q for q in quests if q.subtopic.lower() == subtopic.lower() or q.topic.lower() == topic.lower()), None)
            failed_quest_id = failed_quest.id if failed_quest else None

            updated_quests, updated_calendar, diff_summary = self.scheduler.replan_on_gap_detected(
                subtopic=subtopic,
                topic=topic,
                failed_quest_id=failed_quest_id,
                quests=quests,
                calendar_blocks=calendar,
                profile=profile
            )

            log_reschedule = AgentThoughtLog(
                id=f"log-{int(datetime.now().timestamp())}-4",
                timestamp=datetime.now().strftime("%H:%M:%S"),
                phase="Reschedule",
                trigger_event="Topological Replanner",
                thought_summary=f"Autonomous Timetable Rewrite: Injected 45-min Remedial Quest '{remedial_material.title}'. Postponed {diff_summary.get('downstream_quests_shifted', 1)} downstream dependencies by +1 day.",
                details=diff_summary,
                mood="tactical"
            )
            logs.append(log_reschedule)

            # 5. NOTIFY PHASE
            dialogue_info = self.persona.on_quiz_failure(topic, subtopic, score_pct)
        else:
            # Success path: Level up XP and check DDA
            profile.xp += 150
            profile.gold += 75
            profile.rolling_mastery = min(100.0, profile.rolling_mastery + 4.5)
            if profile.rolling_mastery >= 85.0 and profile.dda_mode == "Adventurer":
                profile.dda_mode = "Master"

            # Check Level Up
            if profile.xp >= profile.next_level_xp:
                profile.level += 1
                profile.xp = profile.xp - profile.next_level_xp
                profile.next_level_xp = int(profile.next_level_xp * 1.5)
                # Update rank if level milestones met
                ranks = ["F", "E", "D", "C", "B", "A", "S"]
                titles = ["F-Rank Novice", "E-Rank Scout", "D-Rank Adept", "C-Rank Vanguard", "B-Rank Master", "A-Rank Champion", "S-Rank Scholar"]
                idx = min(profile.level - 1, len(ranks) - 1)
                profile.rank = ranks[idx]
                profile.title = titles[idx]

            # Mark corresponding quest as completed
            for q in updated_quests:
                if q.subtopic.lower() == subtopic.lower() and q.status in ["in_progress", "pending", "remedial_active"]:
                    q.status = "completed"
                    q.mastery_score = score_pct
                    break

            for b in updated_calendar:
                if b.subtopic and b.subtopic.lower() == subtopic.lower() and b.status in ["upcoming", "replanned"]:
                    b.status = "completed"
                    b.note = f"Aced with {score_pct:.1f}% mastery!"
                    break

            dialogue_info = self.persona.on_quiz_success(
                topic, subtopic, score_pct, dda_boost=(profile.dda_mode == "Master")
            )

            log_notify = AgentThoughtLog(
                id=f"log-{int(datetime.now().timestamp())}-5",
                timestamp=datetime.now().strftime("%H:%M:%S"),
                phase="Notify",
                trigger_event="Guild Master Broadcast",
                thought_summary=f"Dispatched Guild Master commendation to student HUD. Awarded +150 XP, +75 Gold. DDA Mode: {profile.dda_mode}.",
                details={"dialogue": dialogue_info["dialogue"], "mood": dialogue_info["mood"]},
                mood=dialogue_info["mood"]
            )
            logs.append(log_notify)

        if is_gap:
            log_notify = AgentThoughtLog(
                id=f"log-{int(datetime.now().timestamp())}-5",
                timestamp=datetime.now().strftime("%H:%M:%S"),
                phase="Notify",
                trigger_event="Guild Master Alert",
                thought_summary=f"Dispatched tactical intervention dialogue to student HUD. Remedial quest marked as mandatory before proceeding.",
                details={"dialogue": dialogue_info["dialogue"], "mood": dialogue_info["mood"]},
                mood=dialogue_info["mood"]
            )
            logs.append(log_notify)

        return {
            "is_gap": is_gap,
            "dialogue_info": dialogue_info,
            "remedial_material": remedial_material,
            "updated_quests": updated_quests,
            "updated_calendar": updated_calendar,
            "diff_summary": diff_summary,
            "logs": logs
        }
