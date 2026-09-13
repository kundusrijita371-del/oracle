"""
Authentication and Profile routes.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from store import store
from models.database import StudentProfile

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    username: str
    character_class: str = "Algorithm Apprentice"

PRESET_HEROES = [
    {
        "id": "hero-1",
        "name": "Alex Rivers",
        "title": "F-Rank Novice",
        "rank": "F",
        "level": 1,
        "character_class": "Algorithm Apprentice",
        "tagline": "Specializing in Graph Traversal & Dynamic Programming"
    },
    {
        "id": "hero-2",
        "name": "Elena Rostova",
        "title": "C-Rank Vanguard",
        "rank": "C",
        "level": 8,
        "character_class": "Systems Architect",
        "tagline": "Master of Distributed Consensus & High-Throughput Pipelines"
    },
    {
        "id": "hero-3",
        "name": "Kai Thorne",
        "title": "A-Rank Champion",
        "rank": "A",
        "level": 18,
        "character_class": "Neural Sorcerer",
        "tagline": "Transformer Calculus & Latent Space Navigator"
    }
]

@router.get("/presets")
def get_preset_heroes():
    return PRESET_HEROES

@router.get("/me")
def get_current_user():
    return {
        "profile": store.profile,
        "active_dialogue": store.active_dialogue
    }

@router.post("/login")
def login_user(payload: LoginRequest):
    store.profile.name = payload.username
    store.profile.character_class = payload.character_class
    store.active_dialogue = store.agent_engine.persona.get_greeting(
        store.profile.name, store.profile.rank, store.profile.streak_days
    )
    store.log_thought(
        phase="Analyze",
        trigger_event="User Login",
        summary=f"Scholar {payload.username} logged into the Guild Hall. Loaded quest telemetry and dynamic schedule.",
        details={"username": payload.username, "rank": store.profile.rank},
        mood="tactical"
    )
    return {
        "status": "success",
        "profile": store.profile,
        "active_dialogue": store.active_dialogue
    }

@router.post("/switch-hero/{hero_id}")
def switch_hero(hero_id: str):
    if hero_id == "hero-2":
        store.profile.name = "Elena Rostova"
        store.profile.title = "C-Rank Vanguard"
        store.profile.rank = "C"
        store.profile.level = 8
        store.profile.xp = 1800
        store.profile.next_level_xp = 3000
        store.profile.gold = 750
        store.profile.streak_days = 12
        store.profile.rolling_mastery = 88.0
        store.profile.dda_mode = "Master"
    elif hero_id == "hero-3":
        store.profile.name = "Kai Thorne"
        store.profile.title = "A-Rank Champion"
        store.profile.rank = "A"
        store.profile.level = 18
        store.profile.xp = 4200
        store.profile.next_level_xp = 6000
        store.profile.gold = 1600
        store.profile.streak_days = 28
        store.profile.rolling_mastery = 96.0
        store.profile.dda_mode = "Nightmare"
    else:
        store.reset_to_default()

    store.active_dialogue = store.agent_engine.persona.get_greeting(
        store.profile.name, store.profile.rank, store.profile.streak_days
    )
    return {
        "status": "switched",
        "profile": store.profile,
        "active_dialogue": store.active_dialogue
    }

class AvatarUpdateRequest(BaseModel):
    hair_style: Optional[str] = None
    hair_color: Optional[str] = None
    outfit_color: Optional[str] = None
    skin_tone: Optional[str] = None
    headphones: Optional[str] = None
    accessory: Optional[str] = None
    expression: Optional[str] = None
    mascot: Optional[str] = None
    background_aura: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    character_class: Optional[str] = None
    daily_available_hours: Optional[float] = None
    exam_target_date: Optional[str] = None

@router.post("/avatar")
def update_avatar(payload: AvatarUpdateRequest):
    current = store.profile.avatar_config or {}
    for k, v in payload.model_dump(exclude_unset=True).items():
        if v is not None:
            current[k] = v
    store.profile.avatar_config = current
    store.log_thought(
        phase="Analyze",
        trigger_event="Avatar Customization Saved",
        summary=f"Scholar customized their 3D cartoon avatar: {current.get('hair_style')}, {current.get('headphones')} headphones, {current.get('mascot')} mascot.",
        details=current,
        mood="celebration"
    )
    return {
        "status": "updated",
        "avatar_config": store.profile.avatar_config,
        "profile": store.profile
    }

@router.post("/profile")
def update_profile_details(payload: ProfileUpdateRequest):
    for k, v in payload.model_dump(exclude_unset=True).items():
        if v is not None:
            setattr(store.profile, k, v)
    return {
        "status": "updated",
        "profile": store.profile
    }

