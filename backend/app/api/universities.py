"""Universities API endpoints."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.schemas import (
    CountrySchema,
    ProgramDetailSchema,
    RequirementSchema,
    UniversityDetailSchema,
    UniversityListItem,
    UniversityListResponse,
)
from app.services.university_service import UniversityFilters, UniversityService

router = APIRouter(prefix="/universities", tags=["universities"])


@router.get("", response_model=UniversityListResponse)
def list_universities(
    country: str | None = Query(
        default=None,
        min_length=2,
        max_length=8,
        description="Country code (ISO alpha-2/3)",
    ),
    program: str | None = Query(
        default=None,
        description="Program name or numeric ID",
    ),
    exam: str | None = Query(default=None, description="Exam name"),
    min_score: float | None = Query(
        default=None,
        ge=0.0,
        description="Minimal accepted exam score",
    ),
    q: str | None = Query(
        default=None,
        min_length=1,
        description="Case-insensitive substring search on university name",
    ),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    session: Session = Depends(get_db_session),
) -> UniversityListResponse:
    """Return paginated universities with optional filters."""

    service = UniversityService(session)
    filters = UniversityFilters(
        country_code=country,
        program=program,
        exam=exam,
        min_score=min_score,
        query=q,
        page=page,
        limit=limit,
    )
    universities, program_counts, total = service.list_universities(filters)

    items = [
        UniversityListItem(
            id=university.id,
            name=university.name,
            city=university.city,
            country=CountrySchema(code=university.country.code, name=university.country.name),
            programs_count=program_counts.get(university.id, 0),
        )
        for university in universities
    ]

    return UniversityListResponse(items=items, page=page, limit=limit, total=total)


@router.get("/{university_id}", response_model=UniversityDetailSchema)
def get_university(
    university_id: int,
    session: Session = Depends(get_db_session),
) -> UniversityDetailSchema:
    """Return detailed university payload or 404 if not found."""

    service = UniversityService(session)
    university = service.get_university(university_id)
    if university is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="University not found")

    program_map: dict[int, dict[str, Any]] = {}
    for requirement in university.requirements:
        program = requirement.program
        exam = requirement.exam
        if program is None or exam is None:
            continue

        program_entry = program_map.setdefault(
            program.id,
            {
                "id": program.id,
                "name": program.name,
                "degree_level": str(program.degree_level.value),
                "requirements": [],
            },
        )
        program_entry["requirements"].append(
            RequirementSchema(exam=exam.name, min_score=requirement.min_score)
        )

    programs = [
        ProgramDetailSchema(**data)
        for data in sorted(program_map.values(), key=lambda item: item["name"].lower())
    ]

    return UniversityDetailSchema(
        id=university.id,
        name=university.name,
        city=university.city,
        description=university.description,
        country=CountrySchema(
            code=university.country.code,
            name=university.country.name,
        ),
        programs=programs,
    )
