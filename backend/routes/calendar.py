"""
Calendar and Schedule Management routes.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from store import store
from models.database import CalendarBlock

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

class ConflictRequest(BaseModel):
    conflict_date: str  # YYYY-MM-DD
    hours_blocked: float = 3.0
    reason: str = "Surprise Lab Exam / Work Emergency"

@router.get("")
def get_calendar():
    return {
        "blocks": store.calendar,
        "daily_limit_hours": store.profile.daily_available_hours
    }

@router.post("/block/{block_id}/status")
def update_block_status(block_id: str, status: str):
    block = next((b for b in store.calendar if b.id == block_id), None)
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")

    if status == "missed":
        quests, calendar, diff = store.agent_engine.scheduler.replan_on_missed_session(
            block_id=block_id,
            quests=store.quests,
            calendar_blocks=store.calendar
        )
        store.quests = quests
        store.calendar = calendar
        store.active_dialogue = store.agent_engine.persona.on_session_missed(block.title)
        store.log_thought(
            phase="Reschedule",
            trigger_event=f"Missed Study Block: {block.title}",
            summary=f"Missed session detected on {block.date_str}. Shifted to next available slot and updated downstream timetable.",
            details=diff,
            mood="stern"
        )
        return {
            "status": "replanned",
            "diff": diff,
            "dialogue": store.active_dialogue,
            "calendar": store.calendar
        }
    else:
        block.status = status
        if status == "completed":
            store.profile.xp += 100
            store.profile.gold += 50
            if block.quest_id:
                for q in store.quests:
                    if q.id == block.quest_id:
                        q.status = "completed"
        return {
            "status": "updated",
            "block": block,
            "profile": store.profile
        }

@router.post("/conflict")
def register_calendar_conflict(payload: ConflictRequest):
    calendar, diff = store.agent_engine.scheduler.replan_on_calendar_emergency(
        conflict_date=payload.conflict_date,
        hours_blocked=payload.hours_blocked,
        calendar_blocks=store.calendar
    )
    store.calendar = calendar
    store.active_dialogue = store.agent_engine.persona.on_emergency_conflict(payload.hours_blocked)
    store.log_thought(
        phase="Reschedule",
        trigger_event=f"Emergency Calendar Conflict ({payload.hours_blocked}h)",
        summary=f"Emergency calendar block on {payload.conflict_date} ({payload.reason}). Postponed {diff['displaced_blocks_count']} study blocks forward.",
        details=diff,
        mood="tactical"
    )
    return {
        "status": "success",
        "diff": diff,
        "dialogue": store.active_dialogue,
        "calendar": store.calendar
    }
