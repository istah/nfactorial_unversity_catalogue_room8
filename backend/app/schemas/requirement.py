"""Requirement response schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class RequirementSchema(BaseModel):
    """Exam requirement with minimal score."""

    exam: str
    min_score: float

    model_config = ConfigDict(from_attributes=True)
