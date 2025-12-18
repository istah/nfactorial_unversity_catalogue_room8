"""Program response schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from .requirement import RequirementSchema


class ProgramDetailSchema(BaseModel):
    """Program information with associated requirements."""

    id: int
    name: str
    degree_level: str
    requirements: list[RequirementSchema]

    model_config = ConfigDict(from_attributes=True)
