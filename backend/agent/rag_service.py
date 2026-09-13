"""
Educational RAG Knowledge Retrieval Service:
Fetches structured remedial content, analogies, code walk-throughs, and targeted practice drills for identified knowledge weaknesses.
"""
from typing import List, Optional, Dict, Any
from models.database import RemedialResource
from data.seed_data import REMEDIAL_KNOWLEDGE_BASE

class EducationalRAGService:
    def __init__(self):
        self.knowledge_base: Dict[str, RemedialResource] = {
            item.subtopic.lower(): item for item in REMEDIAL_KNOWLEDGE_BASE
        }

    def fetch_remedial_material(self, subtopic: str, topic: Optional[str] = None) -> RemedialResource:
        key = subtopic.lower().strip()
        if key in self.knowledge_base:
            return self.knowledge_base[key]
        
        # Fuzzy fallback or generated structured remedial object
        for k, v in self.knowledge_base.items():
            if key in k or k in key:
                return v

        # Dynamic fallback generation
        return RemedialResource(
            id=f"rem-{key.replace(' ', '-')}",
            subtopic=subtopic,
            topic=topic or "General Computer Science",
            title=f"Core Foundations & Remediation: {subtopic}",
            summary=f"Tailored educational synthesis for {subtopic}, pinpointing core conceptual invariants and error recovery.",
            key_takeaways=[
                f"Identify the fundamental invariant of {subtopic}.",
                "Trace execution steps methodically with concrete small-scale input examples.",
                "Review edge cases: empty structures, negative values, and cyclic dependencies.",
                "Compare optimal time and space trade-offs before implementation."
            ],
            code_analogy=f"Imagine {subtopic} as an automated factory conveyor: each step must verify its input state before passing items downstream.",
            code_example=f"# Remedial Guide for {subtopic}\n# Master the foundational step-by-step pattern:\ndef solve_{key.replace(' ', '_')}(inputs):\n    # 1. Base validation\n    if not inputs:\n        return None\n    # 2. Invariant processing\n    result = []\n    for item in inputs:\n        # Process item according to {subtopic} rules\n        pass\n    return result",
            practice_drill=f"Write a 5-step trace of {subtopic} on an edge-case test suite with pen and paper before coding.",
            difficulty_fix="Scaled task difficulty to Step-by-Step Interactive Drill."
        )

    def get_all_resources(self) -> List[RemedialResource]:
        return list(self.knowledge_base.values())
