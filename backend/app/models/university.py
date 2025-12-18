"""University model definition."""

from __future__ import annotations

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class University(Base):
    """Represents a university participating in the catalog."""

    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text())
    country_id: Mapped[int] = mapped_column(ForeignKey("countries.id", ondelete="CASCADE"), nullable=False)

    country: Mapped["Country"] = relationship(back_populates="universities")
    requirements: Mapped[list["Requirement"]] = relationship(back_populates="university", cascade="all, delete-orphan")
