"""
LangChain agent setup with university search tools.

This module defines tools for searching, retrieving, and comparing universities,
using the existing backend services and database for data access.
"""

import json
from typing import Optional

from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain.tools import tool
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models import Country, Exam, Program
from app.services.university_service import UniversityFilters, UniversityService


def _get_session() -> Session:
    """Create a new database session."""
    return SessionLocal()


def _serialize_university_list(universities, program_counts: dict) -> list[dict]:
    """Convert University ORM objects to serializable dicts for list view."""
    return [
        {
            "id": u.id,
            "name": u.name,
            "city": u.city,
            "country": u.country.name if u.country else None,
            "country_code": u.country.code if u.country else None,
            "programs_count": program_counts.get(u.id, 0),
        }
        for u in universities
    ]


def _serialize_university_detail(university) -> dict:
    """Convert University ORM object to serializable dict with full details."""
    programs = {}
    for req in university.requirements:
        if req.program and req.exam:
            prog_id = req.program.id
            if prog_id not in programs:
                programs[prog_id] = {
                    "name": req.program.name,
                    "degree_level": req.program.degree_level.value if req.program.degree_level else None,
                    "requirements": []
                }
            programs[prog_id]["requirements"].append({
                "exam": req.exam.name,
                "min_score": req.min_score
            })

    return {
        "id": university.id,
        "name": university.name,
        "city": university.city,
        "description": university.description,
        "country": university.country.name if university.country else None,
        "country_code": university.country.code if university.country else None,
        "programs": list(programs.values())
    }


@tool
def get_available_filters() -> str:
    """
    Get all available filter options: countries, programs, and exams.

    Use this tool to discover what options are available in the database
    before searching, or to help users understand what they can filter by.

    Returns:
        JSON string with lists of available countries, programs, and exams.
    """
    session = _get_session()
    try:
        countries = session.scalars(select(Country).order_by(Country.name)).all()
        programs = session.scalars(select(Program).order_by(Program.name)).all()
        exams = session.scalars(select(Exam).order_by(Exam.name)).all()

        return json.dumps({
            "countries": [
                {"code": c.code, "name": c.name}
                for c in countries
            ],
            "programs": [
                {"id": p.id, "name": p.name, "degree_level": p.degree_level.value if p.degree_level else None}
                for p in programs
            ],
            "exams": [
                {"id": e.id, "name": e.name}
                for e in exams
            ]
        }, indent=2)

    finally:
        session.close()


@tool
def search_universities(
    country: Optional[str] = None,
    program: Optional[str] = None,
    exam: Optional[str] = None,
    min_score: Optional[float] = None,
    query: Optional[str] = None
) -> str:
    """
    Search universities in the database with optional filters.

    Args:
        country: Filter by country code (e.g., "US", "UK", "DE"). Use get_available_filters to see valid codes.
        program: Filter by program name (e.g., "Computer Science", "Medicine")
        exam: Filter by exam name (e.g., "SAT", "IELTS", "TOEFL")
        min_score: Filter by minimum required exam score
        query: Search university name (case-insensitive substring match)

    Returns:
        JSON string with matching universities or suggestions if none found.
    """
    session = _get_session()
    try:
        service = UniversityService(session)
        filters = UniversityFilters(
            country_code=country,
            program=program,
            exam=exam,
            min_score=min_score,
            query=query,
            page=1,
            limit=20
        )
        universities, program_counts, total = service.list_universities(filters)

        if not universities:
            return json.dumps({
                "found": 0,
                "message": "No universities match your criteria.",
                "tip": "Use get_available_filters to see valid country codes, programs, and exams."
            }, indent=2)

        results = _serialize_university_list(universities, program_counts)
        return json.dumps({
            "found": total,
            "showing": len(results),
            "universities": results
        }, indent=2)

    finally:
        session.close()


@tool
def get_university(university_id: int) -> str:
    """
    Get detailed information about a specific university by its ID.

    Args:
        university_id: The numeric ID of the university

    Returns:
        JSON string with full university details including programs and exam requirements.
    """
    session = _get_session()
    try:
        service = UniversityService(session)
        university = service.get_university(university_id)

        if not university:
            return json.dumps({
                "error": f"University with ID {university_id} not found.",
                "tip": "Use search_universities to find valid university IDs."
            }, indent=2)

        return json.dumps(_serialize_university_detail(university), indent=2)

    finally:
        session.close()


@tool
def compare_universities(university_ids: list[int]) -> str:
    """
    Compare multiple universities side by side.

    Args:
        university_ids: List of university IDs to compare (e.g., [1, 2, 3])

    Returns:
        JSON string with comparison of universities including programs and requirements.
    """
    if len(university_ids) < 2:
        return json.dumps({"error": "Please provide at least 2 university IDs to compare."})

    if len(university_ids) > 5:
        return json.dumps({"error": "Please compare at most 5 universities at a time."})

    session = _get_session()
    try:
        service = UniversityService(session)
        found = []
        not_found = []

        for uid in university_ids:
            university = service.get_university(uid)
            if university:
                found.append(_serialize_university_detail(university))
            else:
                not_found.append(uid)

        if not found:
            return json.dumps({
                "error": "None of the provided IDs were found.",
                "tip": "Use search_universities to find valid university IDs."
            }, indent=2)

        comparison = {
            "universities_compared": len(found),
            "comparison": found
        }

        if not_found:
            comparison["not_found_ids"] = not_found

        return json.dumps(comparison, indent=2)

    finally:
        session.close()


# All available tools
TOOLS = [get_available_filters, search_universities, get_university, compare_universities]


SYSTEM_PROMPT = """You are a helpful university admissions assistant. Your job is to help students find and compare universities based on their preferences and qualifications.

You have access to these tools:

1. **get_available_filters** - Get lists of all available countries, programs, and exams in the database. Use this first if unsure what options exist.

2. **search_universities** - Search with filters:
   - country: Country code (e.g., "US", "UK", "DE")
   - program: Program name (e.g., "Computer Science", "Medicine")
   - exam: Exam name (e.g., "SAT", "IELTS", "TOEFL")
   - min_score: Minimum exam score requirement
   - query: Search by university name

3. **get_university** - Get full details by numeric ID (includes programs and exam requirements)

4. **compare_universities** - Compare 2-5 universities side by side

IMPORTANT RULES:
- ALWAYS use tools to look up information. Never guess or make up data.
- If user asks what countries/programs/exams are available, use get_available_filters.
- Use search_universities to find matching universities and their IDs.
- Use get_university with the numeric ID to get detailed requirements.
- If no results found, use get_available_filters to suggest valid options.
- Be concise but helpful. Format results clearly for easy reading.
- When comparing, highlight key differences (location, programs, requirements)."""


def create_university_agent(openai_api_key: str, model: str = "gpt-4o-mini"):
    """
    Create a LangChain agent with university tools.

    Args:
        openai_api_key: OpenAI API key for the LLM
        model: Model name to use (default: gpt-4o-mini)

    Returns:
        Agent ready to handle user queries
    """
    import os
    os.environ["OPENAI_API_KEY"] = openai_api_key

    llm = init_chat_model(model, temperature=0)

    agent = create_agent(
        model=llm,
        tools=TOOLS,
        system_prompt=SYSTEM_PROMPT,
    )

    return agent
