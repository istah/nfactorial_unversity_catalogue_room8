"""Country model definition."""

from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Country(Base):
    """Represents a country that hosts partner universities."""

    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(8), unique=True, nullable=False)

    universities: Mapped[list["University"]] = relationship(
        back_populates="country",
        cascade="all, delete-orphan",
    )
