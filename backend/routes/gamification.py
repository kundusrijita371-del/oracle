"""
Gamification, Skill Tree, and Rewards Marketplace routes.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from store import store
from models.database import RewardItem, SkillNode

router = APIRouter(prefix="/api/gamification", tags=["gamification"])

class CustomRewardRequest(BaseModel):
    title: str
    description: str
    coin_cost: int
    icon: str = "🎁"
    category: str = "real_world"

@router.get("/profile")
def get_gamification_profile():
    return {
        "profile": store.profile,
        "skill_nodes": store.skill_nodes,
        "rewards": store.rewards
    }

@router.post("/skill/{node_id}/upgrade")
def upgrade_skill_node(node_id: str):
    node = next((s for s in store.skill_nodes if s.id == node_id), None)
    if not node:
        raise HTTPException(status_code=404, detail="Skill node not found")

    if node.level >= node.max_level:
        raise HTTPException(status_code=400, detail="Skill node is already max level")

    if store.profile.xp < node.xp_cost:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient XP! You need {node.xp_cost} XP but currently have {store.profile.xp} XP."
        )

    store.profile.xp -= node.xp_cost
    node.level += 1
    node.unlocked = True
    node.xp_cost = int(node.xp_cost * 1.4)

    store.log_thought(
        phase="Analyze",
        trigger_event=f"Skill Tree Upgrade: {node.name}",
        summary=f"Scholar upgraded '{node.name}' to Level {node.level}/{node.max_level}. Perk active: {node.bonus_perk}",
        details={"node_id": node_id, "new_level": node.level, "perk": node.bonus_perk},
        mood="celebration"
    )

    return {
        "status": "upgraded",
        "node": node,
        "profile": store.profile
    }

@router.post("/rewards/{reward_id}/redeem")
def redeem_reward(reward_id: str):
    item = next((r for r in store.rewards if r.id == reward_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Reward item not found")

    if store.profile.gold < item.coin_cost:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough Gold Coins! Required: {item.coin_cost} 🪙, Available: {store.profile.gold} 🪙"
        )

    store.profile.gold -= item.coin_cost
    item.redeemed_count += 1

    # Special handling for in-game consumables
    if item.id == "rew-shield":
        store.profile.streak_shield_active = True

    store.log_thought(
        phase="Analyze",
        trigger_event=f"Reward Redeemed: {item.title}",
        summary=f"Redeemed reward '{item.title}' for {item.coin_cost} Gold Coins. Enjoy your well-earned victory!",
        details={"reward_id": reward_id, "category": item.category, "gold_remaining": store.profile.gold},
        mood="celebration"
    )

    return {
        "status": "redeemed",
        "item": item,
        "profile": store.profile
    }

@router.post("/rewards/custom")
def add_custom_reward(payload: CustomRewardRequest):
    new_reward = RewardItem(
        id=f"rew-custom-{len(store.rewards) + 1}",
        title=payload.title,
        description=payload.description,
        category=payload.category,
        coin_cost=payload.coin_cost,
        icon=payload.icon,
        is_custom=True,
        redeemed_count=0
    )
    store.rewards.insert(0, new_reward)

    store.log_thought(
        phase="Analyze",
        trigger_event="Custom Reward Created",
        summary=f"Added custom life reward: '{payload.title}' ({payload.coin_cost} Gold Coins).",
        details={"title": payload.title, "cost": payload.coin_cost},
        mood="tactical"
    )

    return {
        "status": "created",
        "reward": new_reward,
        "rewards": store.rewards
    }
