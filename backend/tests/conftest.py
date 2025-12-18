"""Pytest fixtures for backend smoke tests."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))

from app import create_app
from app.core.database import Base, get_db_session
from app.models import Country, DegreeLevel, Exam, Program, Requirement, University


@pytest.fixture(scope="session")
def engine() -> Engine:
    """Provide an in-memory SQLite engine shared across tests."""

    return create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )


@pytest.fixture(scope="session")
def session_factory(engine: Engine) -> sessionmaker:
    """Create database schema and seed deterministic data."""

    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

    with factory() as session:
        seed_test_data(session)
        session.commit()

    yield factory

    Base.metadata.drop_all(engine)


@pytest.fixture(scope="session")
def app_fixture(session_factory: sessionmaker):
    """Application instance wired to the in-memory database."""

    app = create_app()

    def override_get_db() -> Session:
        with session_factory() as session:
            yield session

    app.dependency_overrides[get_db_session] = override_get_db
    yield app
    app.dependency_overrides.clear()


@pytest.fixture()
def client(app_fixture):
    """Test client bound to the application factory."""

    with TestClient(app_fixture) as test_client:
        yield test_client


def seed_test_data(session: Session) -> None:
    """Insert deterministic dataset used by smoke tests."""

    kz = Country(name="Kazakhstan", code="KZ")
    tr = Country(name="Turkey", code="TR")
    session.add_all([kz, tr])
    session.flush()

    ielts = Exam(name="IELTS")
    sat = Exam(name="SAT")
    session.add_all([ielts, sat])
    session.flush()

    cs_bachelor = Program(name="Computer Science", degree_level=DegreeLevel.BACHELOR)
    data_master = Program(name="Data Science", degree_level=DegreeLevel.MASTER)
    session.add_all([cs_bachelor, data_master])
    session.flush()

    nu = University(
        name="Nazarbayev University",
        city="Astana",
        description="Flagship research university in Kazakhstan",
        country=kz,
    )
    itu = University(
        name="Istanbul Technical University",
        city="Istanbul",
        description="Historic engineering-focused university",
        country=tr,
    )
    session.add_all([nu, itu])
    session.flush()

    requirements = [
        Requirement(
            university_id=nu.id,
            program_id=cs_bachelor.id,
            exam_id=ielts.id,
            min_score=6.5,
        ),
        Requirement(
            university_id=nu.id,
            program_id=cs_bachelor.id,
            exam_id=sat.id,
            min_score=1350,
        ),
        Requirement(
            university_id=nu.id,
            program_id=data_master.id,
            exam_id=ielts.id,
            min_score=7.0,
        ),
        Requirement(
            university_id=itu.id,
            program_id=cs_bachelor.id,
            exam_id=ielts.id,
            min_score=6.5,
        ),
        Requirement(
            university_id=itu.id,
            program_id=data_master.id,
            exam_id=ielts.id,
            min_score=7.0,
        ),
    ]
    session.add_all(requirements)
