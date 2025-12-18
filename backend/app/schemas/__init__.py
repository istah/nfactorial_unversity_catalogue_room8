"""Pydantic schemas for API responses."""

from .country import CountrySchema
from .program import ProgramDetailSchema
from .requirement import RequirementSchema
from .university import (
    UniversityDetailSchema,
    UniversityListItem,
    UniversityListResponse,
)

__all__ = [
    "CountrySchema",
    "ProgramDetailSchema",
    "RequirementSchema",
    "UniversityListItem",
    "UniversityListResponse",
    "UniversityDetailSchema",
]
