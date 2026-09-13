"""
Campaigns, Quests, and Syllabus Wizard routes.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from store import store
from models.database import Campaign, Quest, CalendarBlock
from datetime import date, timedelta

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])

class SyllabusWizardRequest(BaseModel):
    subject: str
    target_date: str  # YYYY-MM-DD
    daily_available_hours: float
    difficulty_preference: str = "Balanced"
    topics: List[str]

@router.get("")
def get_campaigns():
    return {
        "campaigns": store.campaigns,
        "active_campaign_id": store.profile.active_campaign_id
    }

@router.get("/quests")
def get_quests(campaign_id: Optional[str] = None):
    if campaign_id:
        filtered = [q for q in store.quests if q.campaign_id == campaign_id]
        return filtered
    return store.quests

@router.post("/quest/{quest_id}/complete")
def complete_quest(quest_id: str):
    quest = next((q for q in store.quests if q.id == quest_id), None)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    quest.status = "completed"
    store.profile.xp += quest.xp_reward
    store.profile.gold += quest.gold_reward

    # Update calendar block
    for b in store.calendar:
        if b.quest_id == quest_id:
            b.status = "completed"

    store.log_thought(
        phase="Analyze",
        trigger_event=f"Quest Completed: {quest.title}",
        summary=f"Scholar defeated quest '{quest.title}'. Awarded +{quest.xp_reward} XP, +{quest.gold_reward} Gold.",
        details={"quest_id": quest_id, "xp": quest.xp_reward, "gold": quest.gold_reward},
        mood="celebration"
    )

    return {
        "status": "completed",
        "quest": quest,
        "profile": store.profile
    }

@router.post("/wizard/generate")
def generate_custom_syllabus(payload: SyllabusWizardRequest):
    new_camp_id = f"camp-custom-{len(store.campaigns) + 1}"
    
    # Create Campaign
    new_campaign = Campaign(
        id=new_camp_id,
        title=f"Campaign: {payload.subject} Mastery Odyssey",
        description=f"AI-Generated roadmap targeting completion by {payload.target_date} ({payload.daily_available_hours}h/day).",
        icon="⚔️",
        total_quests=len(payload.topics) * 2,
        completed_quests=0,
        target_date=payload.target_date,
        status="active",
        category=payload.subject
    )
    store.campaigns.insert(0, new_campaign)
    store.profile.active_campaign_id = new_camp_id
    store.profile.daily_available_hours = payload.daily_available_hours
    store.profile.exam_target_date = payload.target_date

    # Generate Quests & Calendar Blocks
    today = date.today()
    new_quests: List[Quest] = []
    new_calendar_blocks: List[CalendarBlock] = []

    for idx, topic in enumerate(payload.topics):
        q_date = (today + timedelta(days=idx)).strftime("%Y-%m-%d")
        
        # Foundational Quest
        q1 = Quest(
            id=f"q-gen-{idx*2 + 1}",
            campaign_id=new_camp_id,
            title=f"Theory & Fundamentals: {topic}",
            topic=topic,
            subtopic=f"{topic} Fundamentals",
            difficulty="Easy" if idx == 0 else "Medium",
            xp_reward=120 + idx * 20,
            gold_reward=60 + idx * 10,
            estimated_minutes=int(payload.daily_available_hours * 30),
            status="in_progress" if idx == 0 else "pending",
            scheduled_date=q_date,
            scheduled_time="17:00"
        )
        new_quests.append(q1)

        b1 = CalendarBlock(
            id=f"cal-gen-{idx*2 + 1}",
            quest_id=q1.id,
            title=f"Study Block: {topic} Fundamentals",
            topic=topic,
            subtopic=f"{topic} Fundamentals",
            date_str=q_date,
            start_time="17:00",
            end_time="18:00",
            duration_min=60,
            status="upcoming"
        )
        new_calendar_blocks.append(b1)

        # Advanced/Drill Quest
        q2 = Quest(
            id=f"q-gen-{idx*2 + 2}",
            campaign_id=new_camp_id,
            title=f"Boss Drill & Problem Solving: {topic}",
            topic=topic,
            subtopic=f"{topic} Advanced Drills",
            difficulty="Medium" if idx == 0 else "Hard",
            xp_reward=180 + idx * 25,
            gold_reward=90 + idx * 15,
            estimated_minutes=int(payload.daily_available_hours * 30),
            status="pending",
            prerequisite_quest_ids=[q1.id],
            scheduled_date=q_date,
            scheduled_time="18:30"
        )
        new_quests.append(q2)

        b2 = CalendarBlock(
            id=f"cal-gen-{idx*2 + 2}",
            quest_id=q2.id,
            title=f"Boss Drill: {topic} Mastery",
            topic=topic,
            subtopic=f"{topic} Advanced Drills",
            date_str=q_date,
            start_time="18:30",
            end_time="19:30",
            duration_min=60,
            status="upcoming"
        )
        new_calendar_blocks.append(b2)

    store.quests = new_quests + store.quests
    store.calendar = new_calendar_blocks + store.calendar

    store.log_thought(
        phase="Reschedule",
        trigger_event="Syllabus Generation",
        summary=f"Synthesized new campaign for '{payload.subject}'. Generated {len(new_quests)} topological quests matching {payload.daily_available_hours}h/day bandwidth.",
        details={"subject": payload.subject, "topics_count": len(payload.topics), "target_date": payload.target_date},
        mood="tactical"
    )

    return {
        "status": "success",
        "campaign": new_campaign,
        "quests_created": len(new_quests),
        "calendar_blocks_created": len(new_calendar_blocks)
    }
