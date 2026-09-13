"""
Dependency-Aware Dynamic Scheduler & Timetable Replanner.
Manages topological prerequisite graph, handles missed sessions, injects remedial quests, and shifts deadlines.
"""
from typing import List, Dict, Tuple, Optional
from datetime import datetime, date, timedelta
from models.database import Quest, CalendarBlock, StudentProfile

class DynamicScheduler:
    def __init__(self):
        pass

    def replan_on_gap_detected(
        self,
        subtopic: str,
        topic: str,
        failed_quest_id: Optional[str],
        quests: List[Quest],
        calendar_blocks: List[CalendarBlock],
        profile: StudentProfile
    ) -> Tuple[List[Quest], List[CalendarBlock], Dict[str, Any]]:
        """
        1. Create/inject a high-priority Remedial Quest.
        2. Insert a Remedial Calendar Block for today / tomorrow.
        3. Pause/postpone all quests that depend on this topic or failed quest.
        4. Shift downstream calendar blocks by 1-2 days.
        """
        today = date.today()
        today_str = today.strftime("%Y-%m-%d")
        tomorrow_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")

        # 1. Create Remedial Quest
        remedial_quest_id = f"rem-q-{subtopic.lower().replace(' ', '-')[:12]}"
        remedial_quest = Quest(
            id=remedial_quest_id,
            campaign_id=profile.active_campaign_id,
            title=f"⚡ Remedial Training: Master {subtopic} Core Invariants",
            topic=topic,
            subtopic=subtopic,
            difficulty="Easy",
            xp_reward=150,
            gold_reward=80,
            estimated_minutes=45,
            status="remedial_active",
            prerequisite_quest_ids=[],
            scheduled_date=today_str,
            scheduled_time="19:30",
            is_remedial=True,
            remedial_reason=f"Failed diagnostic assessment on {subtopic} (<60% score). Downstream topics blocked."
        )

        # 2. Check if remedial quest already exists
        updated_quests = [q for q in quests if q.id != remedial_quest_id]
        updated_quests.insert(0, remedial_quest)

        # 3. Find downstream dependent quests and shift them
        shifted_quest_titles = []
        for q in updated_quests:
            if q.id == remedial_quest_id:
                continue
            # If it was the failed quest or depends on it
            if (failed_quest_id and (q.id == failed_quest_id or failed_quest_id in q.prerequisite_quest_ids)) or (q.topic == topic and q.status in ["pending", "in_progress"]):
                if q.id == failed_quest_id:
                    q.status = "paused"
                    q.remedial_reason = f"Paused pending completion of {remedial_quest.title}"
                try:
                    curr_date = datetime.strptime(q.scheduled_date, "%Y-%m-%d").date()
                    if curr_date <= today:
                        new_date = today + timedelta(days=1)
                        q.scheduled_date = new_date.strftime("%Y-%m-%d")
                        shifted_quest_titles.append(f"{q.title} -> {q.scheduled_date}")
                    else:
                        new_date = curr_date + timedelta(days=1)
                        q.scheduled_date = new_date.strftime("%Y-%m-%d")
                        shifted_quest_titles.append(f"{q.title} -> {q.scheduled_date}")
                except Exception:
                    pass

        # 4. Update Calendar Blocks
        remedial_block = CalendarBlock(
            id=f"cal-rem-{int(datetime.now().timestamp())}",
            quest_id=remedial_quest_id,
            title=f"⚡ REMEDIAL QUEST: {subtopic} Foundations",
            topic=topic,
            subtopic=subtopic,
            date_str=today_str,
            start_time="19:30",
            end_time="20:15",
            duration_min=45,
            status="replanned",
            is_remedial=True,
            note="Urgent remedial drill deployed by AI Guild Master to patch conceptual gap."
        )

        updated_calendar = [b for b in calendar_blocks if not (b.quest_id == remedial_quest_id)]
        
        # Shift upcoming calendar blocks forward
        for block in updated_calendar:
            if block.status in ["upcoming", "replanned"]:
                try:
                    b_date = datetime.strptime(block.date_str, "%Y-%m-%d").date()
                    if b_date <= today and block.id != remedial_block.id:
                        block.original_date = block.date_str
                        block.date_str = tomorrow_str
                        block.status = "replanned"
                        block.note = "Shifted +1 day to accommodate urgent remedial session."
                    elif b_date > today:
                        block.original_date = block.date_str
                        block.date_str = (b_date + timedelta(days=1)).strftime("%Y-%m-%d")
                        block.status = "replanned"
                except Exception:
                    pass

        # Insert remedial block at top priority
        updated_calendar.append(remedial_block)

        # Sort calendar by date and time
        updated_calendar.sort(key=lambda b: (b.date_str, b.start_time))

        diff_summary = {
            "remedial_quest_injected": remedial_quest.title,
            "remedial_time": f"{remedial_block.date_str} @ {remedial_block.start_time}",
            "downstream_quests_shifted": len(shifted_quest_titles),
            "shifted_details": shifted_quest_titles[:3],
            "reason": f"Diagnostic score on {subtopic} was below 60% mastery threshold."
        }

        return updated_quests, updated_calendar, diff_summary

    def replan_on_missed_session(
        self,
        block_id: str,
        quests: List[Quest],
        calendar_blocks: List[CalendarBlock]
    ) -> Tuple[List[Quest], List[CalendarBlock], Dict[str, Any]]:
        today = date.today()
        tomorrow_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        
        target_block = None
        for b in calendar_blocks:
            if b.id == block_id:
                target_block = b
                b.status = "missed"
                b.note = "Marked missed. AI Guild Master autonomously rescheduling."
                break

        if not target_block:
            return quests, calendar_blocks, {"error": "Block not found"}

        # Create replanned block for tomorrow
        replanned_block = CalendarBlock(
            id=f"cal-resched-{int(datetime.now().timestamp())}",
            quest_id=target_block.quest_id,
            title=f"🔄 Replanned: {target_block.title.replace('Scheduled: ', '')}",
            topic=target_block.topic,
            subtopic=target_block.subtopic,
            date_str=tomorrow_str,
            start_time="18:00",
            end_time="19:00",
            duration_min=target_block.duration_min,
            status="replanned",
            note=f"Rescheduled from missed session on {target_block.date_str}."
        )

        calendar_blocks.append(replanned_block)

        # Shift other pending blocks if needed
        for b in calendar_blocks:
            if b.id != target_block.id and b.id != replanned_block.id and b.status == "upcoming":
                try:
                    b_date = datetime.strptime(b.date_str, "%Y-%m-%d").date()
                    if b_date <= today:
                        b.date_str = (today + timedelta(days=2)).strftime("%Y-%m-%d")
                        b.status = "replanned"
                except Exception:
                    pass

        calendar_blocks.sort(key=lambda b: (b.date_str, b.start_time))

        diff_summary = {
            "missed_block": target_block.title,
            "rescheduled_date": replanned_block.date_str,
            "rescheduled_time": replanned_block.start_time,
            "reason": "Student was absent during scheduled study block."
        }
        return quests, calendar_blocks, diff_summary

    def replan_on_calendar_emergency(
        self,
        conflict_date: str,
        hours_blocked: float,
        calendar_blocks: List[CalendarBlock]
    ) -> Tuple[List[CalendarBlock], Dict[str, Any]]:
        c_date = datetime.strptime(conflict_date, "%Y-%m-%d").date()
        affected = []

        for b in calendar_blocks:
            if b.date_str == conflict_date and b.status in ["upcoming", "replanned"]:
                b.original_date = b.date_str
                # Shift to next day
                new_date = c_date + timedelta(days=1)
                b.date_str = new_date.strftime("%Y-%m-%d")
                b.status = "replanned"
                b.note = f"Displaced by {hours_blocked}h emergency calendar conflict."
                affected.append(b.title)

        calendar_blocks.sort(key=lambda b: (b.date_str, b.start_time))

        diff_summary = {
            "conflict_date": conflict_date,
            "hours_blocked": hours_blocked,
            "displaced_blocks_count": len(affected),
            "displaced_titles": affected
        }
        return calendar_blocks, diff_summary
