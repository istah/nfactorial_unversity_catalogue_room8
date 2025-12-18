"""Configuration objects for the FastAPI application."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    app_name: str = "University Catalog API"
    app_version: str = "0.1.0"
    debug: bool = False
    database_url: str = "postgresql+psycopg://user:password@localhost:5432/university_catalog"

    model_config = SettingsConfigDict(env_file="backend/.env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""

    return Settings()
