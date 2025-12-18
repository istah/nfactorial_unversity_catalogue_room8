"""Metadata response schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class CountryMetaSchema(BaseModel):
    """Minimal country metadata for filters."""

    id: int
    name: str
    code: str

    model_config = ConfigDict(from_attributes=True)


class ProgramMetaSchema(BaseModel):
    """Program metadata with degree level."""

    id: int
    name: str
    degree_level: str

    model_config = ConfigDict(from_attributes=True)


class ExamMetaSchema(BaseModel):
    """Exam metadata."""

    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class MetaResponse(BaseModel):
    """Container for metadata used on filter forms."""

    countries: list[CountryMetaSchema]
    programs: list[ProgramMetaSchema]
    exams: list[ExamMetaSchema]
