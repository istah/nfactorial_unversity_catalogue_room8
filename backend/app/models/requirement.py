"""Requirement model definition."""

from __future__ import annotations

from sqlalchemy import Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Requirement(Base):
    """Represents minimum exam score requirements per university program."""

    __tablename__ = "requirements"
    __table_args__ = (UniqueConstraint("university_id", "program_id", "exam_id", name="uq_requirement_assignment"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    university_id: Mapped[int] = mapped_column(ForeignKey("universities.id", ondelete="CASCADE"), nullable=False)
    program_id: Mapped[int] = mapped_column(ForeignKey("programs.id", ondelete="CASCADE"), nullable=False)
    exam_id: Mapped[int] = mapped_column(ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    min_score: Mapped[float] = mapped_column(Float, nullable=False)

    university: Mapped["University"] = relationship(back_populates="requirements")
    program: Mapped["Program"] = relationship(back_populates="requirements")
    exam: Mapped["Exam"] = relationship(back_populates="requirements")
