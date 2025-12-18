"""Country-related response schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class CountrySchema(BaseModel):
    """Serializable representation of a country."""

    code: str
    name: str

    model_config = ConfigDict(from_attributes=True)
