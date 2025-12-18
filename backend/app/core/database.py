"""Database configuration and session management."""

from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings


class Base(DeclarativeBase):
    """Declarative base class for all SQLAlchemy models."""


settings = get_settings()
engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    future=True,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    expire_on_commit=False,
    autoflush=False,
)


def get_db_session() -> Generator[Session, None, None]:
    """Yield a database session and ensure it is closed afterwards."""

    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
