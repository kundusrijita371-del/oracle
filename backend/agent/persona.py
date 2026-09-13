"""
Guild Master Persona: Dialogue and quest dispatch generator with emotional resonance.
"""
from typing import Dict, Any, Optional

class GuildMasterPersona:
    def __init__(self, name: str = "Master Vaelen", title: str = "Grand Arch-Scholar of the Algorithm Citadel"):
        self.name = name
        self.title = title

    def get_greeting(self, student_name: str, rank: str, streak: int) -> Dict[str, str]:
        if streak >= 3:
            return {
                "mood": "celebration",
                "dialogue": f"Greetings, {student_name}! A formidable {streak}-day quest streak burns in your heart! The Citadel recognizes your unwavering discipline. Let us conquer today's study blocks!",
                "audio_cue": "triumphant"
            }
        return {
            "mood": "tactical",
            "dialogue": f"Welcome back to the Guild Hall, {student_name} ({rank}-Rank). Our scouts have laid out today's campaign objectives. Prepare your mind and summon your focus!",
            "audio_cue": "welcome"
        }

    def on_quiz_failure(self, topic: str, subtopic: str, score_pct: float) -> Dict[str, str]:
        return {
            "mood": "alert",
            "dialogue": f"Adventurer, halt! You took heavy damage on the {subtopic} trial ({score_pct:.1f}% accuracy). Proceeding to advanced downstream campaigns right now would lead to catastrophic failure. I am intervening immediately to pause downstream quests and deploy an emergency Remedial Training Quest!",
            "action_notice": f"Autonomous Protocol: Injected Remedial Quest for '{subtopic}', shifted downstream deadlines by +1 day."
        }

    def on_quiz_success(self, topic: str, subtopic: str, score_pct: float, dda_boost: bool = False) -> Dict[str, str]:
        if dda_boost:
            return {
                "mood": "celebration",
                "dialogue": f"Magnificent mastery! You obliterated the {subtopic} trial with a flawless {score_pct:.1f}%! I am escalating our Dynamic Difficulty Adjustment (DDA) to 'Master Tier' and granting bonus bounty gold!",
                "action_notice": f"DDA Scaled: Task challenge increased, +50 Gold bounty awarded."
            }
        return {
            "mood": "celebration",
            "dialogue": f"Splendid work! {score_pct:.1f}% score recorded on {subtopic}. Prerequisite cleared! You have unlocked the next stage of the Campaign.",
            "action_notice": f"Prerequisite Verified: Quest marked complete, XP and Gold credited."
        }

    def on_session_missed(self, block_title: str) -> Dict[str, str]:
        return {
            "mood": "stern",
            "dialogue": f"Attention, Scholar! A scheduled study block '{block_title}' was missed. In the Guild, we do not let missed hours compound into failure. I am dynamically recalculating the timetable to absorb this block without overloading your cognitive capacity.",
            "action_notice": f"Replanned: Shifted '{block_title}' to tomorrow's optimal focus window; adjusted downstream milestones."
        }

    def on_emergency_conflict(self, hours_blocked: float) -> Dict[str, str]:
        return {
            "mood": "tactical",
            "dialogue": f"A temporal disruption detected! An emergency {hours_blocked}h calendar block has been registered. Fear not — I have rearranged your upcoming timetable to safeguard your target exam deadline.",
            "action_notice": f"Conflict Resolved: Redistributed study load across next 3 days."
        }
