"""Pydantic schemas for API responses."""

from .country import CountrySchema
from .meta import (
    CountryMetaSchema,
    ExamMetaSchema,
    MetaResponse,
    ProgramMetaSchema,
)
from .program import ProgramDetailSchema
from .requirement import RequirementSchema
from .university import (
    UniversityDetailSchema,
    UniversityListItem,
    UniversityListResponse,
)

__all__ = [
    "CountrySchema",
    "CountryMetaSchema",
    "ProgramDetailSchema",
    "ProgramMetaSchema",
    "RequirementSchema",
    "ExamMetaSchema",
    "MetaResponse",
    "UniversityListItem",
    "UniversityListResponse",
    "UniversityDetailSchema",
]
