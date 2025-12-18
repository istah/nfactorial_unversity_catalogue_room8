"""Meta endpoints for filters."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.models import Country, Exam, Program
from app.schemas import (
    CountryMetaSchema,
    ExamMetaSchema,
    MetaResponse,
    ProgramMetaSchema,
)

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("", response_model=MetaResponse)
def get_meta(session: Session = Depends(get_db_session)) -> MetaResponse:
    """Return metadata collections for client filters."""

    countries = session.scalars(select(Country).order_by(Country.name)).all()
    programs = session.scalars(select(Program).order_by(Program.name)).all()
    exams = session.scalars(select(Exam).order_by(Exam.name)).all()

    return MetaResponse(
        countries=[CountryMetaSchema.model_validate(country) for country in countries],
        programs=[ProgramMetaSchema.model_validate(program) for program in programs],
        exams=[ExamMetaSchema.model_validate(exam) for exam in exams],
    )
