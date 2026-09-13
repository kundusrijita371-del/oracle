"""
Judge Demo Deck Simulation Triggers and Agent Activity Audit Log.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from store import store
from models.database import AgentThoughtLog
from datetime import datetime, date

router = APIRouter(prefix="/api/simulation", tags=["simulation"])

@router.get("/logs")
def get_agent_logs():
    return store.thought_logs

@router.post("/trigger-quiz-failure")
def simulate_quiz_failure(subtopic: str = "Dijkstras Algorithm", topic: str = "Graphs"):
    """
    Simulates a student failing the Dijkstra's Algorithm assessment (<60%).
    Triggers full 5-stage agent loop.
    """
    res = store.agent_engine.run_feedback_loop_on_quiz(
        topic=topic,
        subtopic=subtopic,
        score_pct=33.3,
        profile=store.profile,
        quests=store.quests,
        calendar=store.calendar
    )
    store.quests = res["updated_quests"]
    store.calendar = res["updated_calendar"]
    store.active_dialogue = res["dialogue_info"]

    for log in reversed(res["logs"]):
        store.thought_logs.insert(0, log)

    return {
        "event": "SIMULATED_QUIZ_FAILURE",
        "score_pct": 33.3,
        "is_gap": True,
        "dialogue": res["dialogue_info"],
        "remedial_material": res["remedial_material"],
        "diff_summary": res["diff_summary"],
        "logs": res["logs"],
        "profile": store.profile,
        "calendar": store.calendar,
        "quests": store.quests
    }

@router.post("/trigger-missed-session")
def simulate_missed_session():
    """
    Finds the active upcoming study block and marks it missed, triggering autonomous timetable shift.
    """
    active_block = next((b for b in store.calendar if b.status in ["upcoming", "replanned"]), None)
    if not active_block:
        active_block = store.calendar[0]

    quests, calendar, diff = store.agent_engine.scheduler.replan_on_missed_session(
        block_id=active_block.id,
        quests=store.quests,
        calendar_blocks=store.calendar
    )
    store.quests = quests
    store.calendar = calendar
    store.active_dialogue = store.agent_engine.persona.on_session_missed(active_block.title)
    
    log = store.log_thought(
        phase="Reschedule",
        trigger_event=f"[Judge Simulation] Missed Session: {active_block.title}",
        summary=f"Simulated missed block '{active_block.title}'. Dynamically rescheduled to tomorrow without violating daily capacity.",
        details=diff,
        mood="stern"
    )

    return {
        "event": "SIMULATED_MISSED_SESSION",
        "diff": diff,
        "dialogue": store.active_dialogue,
        "log": log,
        "calendar": store.calendar
    }

@router.post("/trigger-emergency-conflict")
def simulate_emergency_conflict():
    today_str = date.today().strftime("%Y-%m-%d")
    calendar, diff = store.agent_engine.scheduler.replan_on_calendar_emergency(
        conflict_date=today_str,
        hours_blocked=4.0,
        calendar_blocks=store.calendar
    )
    store.calendar = calendar
    store.active_dialogue = store.agent_engine.persona.on_emergency_conflict(4.0)
    
    log = store.log_thought(
        phase="Reschedule",
        trigger_event="[Judge Simulation] 4-Hour Emergency Conflict",
        summary=f"Injected sudden 4h calendar emergency on {today_str}. Relocated {diff['displaced_blocks_count']} study blocks to preserve exam target date.",
        details=diff,
        mood="tactical"
    )

    return {
        "event": "SIMULATED_EMERGENCY_CONFLICT",
        "diff": diff,
        "dialogue": store.active_dialogue,
        "log": log,
        "calendar": store.calendar
    }

@router.post("/trigger-ace-streak")
def simulate_ace_streak():
    res = store.agent_engine.run_feedback_loop_on_quiz(
        topic="Graphs",
        subtopic="Dijkstras Algorithm",
        score_pct=100.0,
        profile=store.profile,
        quests=store.quests,
        calendar=store.calendar
    )
    store.quests = res["updated_quests"]
    store.calendar = res["updated_calendar"]
    store.active_dialogue = res["dialogue_info"]

    for log in reversed(res["logs"]):
        store.thought_logs.insert(0, log)

    return {
        "event": "SIMULATED_ACE_STREAK",
        "score_pct": 100.0,
        "dialogue": res["dialogue_info"],
        "profile": store.profile,
        "calendar": store.calendar,
        "quests": store.quests
    }

@router.post("/reset")
def reset_simulation():
    store.reset_to_default()
    store.log_thought(
        phase="Analyze",
        trigger_event="State Reset",
        summary="Restored default clean state for live demonstration.",
        details={},
        mood="thinking"
    )
    return {
        "status": "reset",
        "profile": store.profile,
        "campaigns": store.campaigns,
        "quests": store.quests,
        "calendar": store.calendar
    }
