"""Service layer for university-related operations."""

from __future__ import annotations

from dataclasses import dataclass

import sqlalchemy as sa
from sqlalchemy import and_, func
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.sql import ColumnElement

from app.models import Country, Exam, Program, Requirement, University


@dataclass
class UniversityFilters:
    """Filter parameters supported by the listing API."""

    country_code: str | None = None
    program: str | None = None
    exam: str | None = None
    min_score: float | None = None
    query: str | None = None
    page: int = 1
    limit: int = 20


class UniversityService:
    """Encapsulates database operations for universities."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_universities(self, filters: UniversityFilters) -> tuple[list[University], dict[int, int], int]:
        """Return paginated universities and program counts.

        Args:
            filters: Listing filters and pagination data.

        Returns:
            Tuple of (universities, program counts per university, total count).
        """

        conditions = self._build_conditions(filters)
        count_stmt = sa.select(func.count(University.id))
        if conditions:
            count_stmt = count_stmt.where(*conditions)
        total = self.session.scalar(count_stmt) or 0

        offset = (filters.page - 1) * filters.limit
        stmt = sa.select(University).options(selectinload(University.country))
        if conditions:
            stmt = stmt.where(*conditions)
        stmt = stmt.order_by(University.name).offset(offset).limit(filters.limit)
        universities = list(self.session.scalars(stmt))

        counts: dict[int, int] = {}
        if universities:
            university_ids = [u.id for u in universities]
            count_stmt = (
                sa.select(
                    Requirement.university_id,
                    func.count(sa.distinct(Requirement.program_id)),
                )
                .where(Requirement.university_id.in_(university_ids))
                .group_by(Requirement.university_id)
            )
            counts = {uid: value for uid, value in self.session.execute(count_stmt).all()}

        return universities, counts, total

    def get_university(self, university_id: int) -> University | None:
        """Fetch a single university with related data."""

        stmt = (
            sa.select(University)
            .where(University.id == university_id)
            .options(
                selectinload(University.country),
                selectinload(University.requirements)
                .selectinload(Requirement.program),
                selectinload(University.requirements)
                .selectinload(Requirement.exam),
            )
        )
        return self.session.scalars(stmt).first()

    def _build_conditions(self, filters: UniversityFilters) -> list[ColumnElement[bool]]:
        """Create SQLAlchemy expressions for provided filters."""

        conditions: list[sa.sql.elements.ColumnElement[bool]] = []

        if filters.country_code:
            conditions.append(
                University.country.has(
                    func.lower(Country.code) == filters.country_code.lower()
                )
            )

        if filters.query:
            conditions.append(
                func.lower(University.name).contains(filters.query.lower())
            )

        requirement_filters: list[sa.sql.elements.ColumnElement[bool]] = []
        if filters.min_score is not None:
            requirement_filters.append(Requirement.min_score >= filters.min_score)

        program_id, program_name = self._parse_program_filter(filters.program)
        if program_id is not None:
            requirement_filters.append(Requirement.program_id == program_id)
        elif program_name is not None:
            requirement_filters.append(
                Requirement.program.has(func.lower(Program.name) == program_name)
            )

        if filters.exam:
            requirement_filters.append(
                Requirement.exam.has(func.lower(Exam.name) == filters.exam.lower())
            )

        if requirement_filters:
            conditions.append(University.requirements.any(and_(*requirement_filters)))

        return conditions

    @staticmethod
    def _parse_program_filter(program: str | None) -> tuple[int | None, str | None]:
        """Return normalized program filter values."""

        if not program:
            return None, None

        program_value = program.strip()
        if not program_value:
            return None, None

        try:
            return int(program_value), None
        except ValueError:
            return None, program_value.lower()
