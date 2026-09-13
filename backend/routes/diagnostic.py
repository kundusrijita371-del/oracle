"""
Diagnostic Quiz Engine and Knowledge Gap Detection routes.
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from store import store
from models.database import QuizQuestion, QuizSubmission

router = APIRouter(prefix="/api/diagnostic", tags=["diagnostic"])

@router.get("/questions")
def get_quiz_questions(topic: Optional[str] = None, subtopic: Optional[str] = None):
    questions = store.quiz_questions
    if topic:
        questions = [q for q in questions if q.topic.lower() == topic.lower()]
    if subtopic:
        questions = [q for q in questions if q.subtopic.lower() == subtopic.lower()]
    return questions

@router.post("/submit")
def submit_quiz(payload: QuizSubmission):
    # Find matching questions
    matching_questions = [
        q for q in store.quiz_questions
        if q.subtopic.lower() == payload.subtopic.lower() or (not payload.subtopic and q.topic.lower() == payload.topic.lower())
    ]
    if not matching_questions:
        matching_questions = store.quiz_questions[:3]

    total = len(matching_questions)
    correct_count = 0
    question_results = []

    for q in matching_questions:
        user_choice = payload.answers.get(q.id, -1)
        is_correct = (user_choice == q.correct_idx)
        if is_correct:
            correct_count += 1
        question_results.append({
            "question_id": q.id,
            "question": q.question,
            "user_choice": user_choice,
            "correct_choice": q.correct_idx,
            "is_correct": is_correct,
            "explanation": q.explanation
        })

    score_pct = (correct_count / total * 100.0) if total > 0 else 0.0

    # Trigger the full Autonomous Agent Feedback Loop!
    loop_result = store.agent_engine.run_feedback_loop_on_quiz(
        topic=payload.topic,
        subtopic=payload.subtopic,
        score_pct=score_pct,
        profile=store.profile,
        quests=store.quests,
        calendar=store.calendar
    )

    store.quests = loop_result["updated_quests"]
    store.calendar = loop_result["updated_calendar"]
    store.active_dialogue = loop_result["dialogue_info"]

    # Prepend logs to thought stream
    for log in reversed(loop_result["logs"]):
        store.thought_logs.insert(0, log)

    return {
        "score_pct": score_pct,
        "correct_count": correct_count,
        "total_questions": total,
        "is_gap_detected": loop_result["is_gap"],
        "question_results": question_results,
        "dialogue": loop_result["dialogue_info"],
        "remedial_material": loop_result["remedial_material"],
        "diff_summary": loop_result["diff_summary"],
        "profile": store.profile,
        "logs": loop_result["logs"]
    }
