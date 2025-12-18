"""University response schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from .country import CountrySchema
from .program import ProgramDetailSchema


class UniversityListItem(BaseModel):
    """Short representation for list responses."""

    id: int
    name: str
    city: str
    country: CountrySchema
    programs_count: int

    model_config = ConfigDict(from_attributes=True)


class UniversityListResponse(BaseModel):
    """Paginated list of universities."""

    items: list[UniversityListItem]
    page: int
    limit: int
    total: int


class UniversityDetailSchema(BaseModel):
    """Detailed university representation with requirements."""

    id: int
    name: str
    city: str
    description: str | None
    country: CountrySchema
    programs: list[ProgramDetailSchema]

    model_config = ConfigDict(from_attributes=True)
