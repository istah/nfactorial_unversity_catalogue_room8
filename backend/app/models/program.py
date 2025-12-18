"""Program model definition."""

from __future__ import annotations

from enum import Enum

from sqlalchemy import Enum as SQLEnum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DegreeLevel(str, Enum):
    """Accepted program degree levels."""

    BACHELOR = "bachelor"
    MASTER = "master"


class Program(Base):
    """Represents a program that universities can offer."""

    __tablename__ = "programs"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    degree_level: Mapped[DegreeLevel] = mapped_column(SQLEnum(DegreeLevel, name="degree_level"), nullable=False)

    requirements: Mapped[list["Requirement"]] = relationship(back_populates="program", cascade="all, delete-orphan")
