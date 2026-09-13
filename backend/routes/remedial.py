"""
Remedial Learning Resource Hub routes.
"""
from fastapi import APIRouter
from typing import List, Optional
from store import store
from models.database import RemedialResource

router = APIRouter(prefix="/api/remedial", tags=["remedial"])

@router.get("")
def get_remedial_resources():
    return store.remedial_resources

@router.get("/{subtopic}")
def get_remedial_for_subtopic(subtopic: str):
    return store.agent_engine.rag.fetch_remedial_material(subtopic)
