"""Exam model definition."""

from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Exam(Base):
    """Represents a standardized exam used for admissions requirements."""

    __tablename__ = "exams"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    requirements: Mapped[list["Requirement"]] = relationship(back_populates="exam", cascade="all, delete-orphan")
