"""Seed script for populating the database with demo data."""

from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import Dict, Tuple

import sqlalchemy as sa
from sqlalchemy.orm import Session

BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from app.core.database import Base, SessionLocal, engine
from app.models import (
    Country,
    DegreeLevel,
    Exam,
    Program,
    Requirement,
    University,
)

logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")
LOGGER = logging.getLogger(__name__)

COUNTRIES = [
    {"name": "Kazakhstan", "code": "KZ"},
    {"name": "Turkey", "code": "TR"},
    {"name": "Romania", "code": "RO"},
    {"name": "Germany", "code": "DE"},
]

EXAMS = ["IELTS", "SAT", "ENT"]

PROGRAMS = [
    {"name": "Computer Science", "degree_level": "bachelor"},
    {"name": "Data Science", "degree_level": "master"},
    {"name": "Business Administration", "degree_level": "bachelor"},
    {"name": "Mechanical Engineering", "degree_level": "bachelor"},
    {"name": "International Relations", "degree_level": "bachelor"},
    {"name": "Finance", "degree_level": "master"},
    {"name": "Architecture", "degree_level": "bachelor"},
]

UNIVERSITIES = [
    {
        "name": "Nazarbayev University",
        "city": "Astana",
        "description": "Research university with strong STEM focus.",
        "country_code": "KZ",
        "programs": [
            {"name": "Computer Science", "degree_level": "bachelor", "requirements": {"IELTS": 6.5, "SAT": 1350}},
            {"name": "Mechanical Engineering", "degree_level": "bachelor", "requirements": {"IELTS": 6.0, "SAT": 1280}},
            {"name": "Data Science", "degree_level": "master", "requirements": {"IELTS": 7.0}},
        ],
    },
    {
        "name": "Al-Farabi Kazakh National University",
        "city": "Almaty",
        "description": "Classical university with wide range of faculties.",
        "country_code": "KZ",
        "programs": [
            {"name": "Business Administration", "degree_level": "bachelor", "requirements": {"IELTS": 6.0, "ENT": 110}},
            {"name": "International Relations", "degree_level": "bachelor", "requirements": {"IELTS": 6.0, "ENT": 105}},
        ],
    },
    {
        "name": "KIMEP University",
        "city": "Almaty",
        "description": "Internationally focused business school in Kazakhstan.",
        "country_code": "KZ",
        "programs": [
            {"name": "Finance", "degree_level": "master", "requirements": {"IELTS": 6.5, "ENT": 115}},
            {"name": "Business Administration", "degree_level": "bachelor", "requirements": {"IELTS": 6.5, "ENT": 115}},
        ],
    },
    {
        "name": "Istanbul Technical University",
        "city": "Istanbul",
        "description": "Leading engineering school in Turkey.",
        "country_code": "TR",
        "programs": [
            {"name": "Mechanical Engineering", "degree_level": "bachelor", "requirements": {"IELTS": 6.5, "SAT": 1300}},
            {"name": "Architecture", "degree_level": "bachelor", "requirements": {"IELTS": 6.5, "SAT": 1250}},
            {"name": "Data Science", "degree_level": "master", "requirements": {"IELTS": 7.0}},
        ],
    },
    {
        "name": "Middle East Technical University",
        "city": "Ankara",
        "description": "STEM-oriented public research university.",
        "country_code": "TR",
        "programs": [
            {"name": "Computer Science", "degree_level": "bachelor", "requirements": {"IELTS": 6.5, "SAT": 1380}},
            {"name": "International Relations", "degree_level": "bachelor", "requirements": {"IELTS": 6.5}},
        ],
    },
    {
        "name": "Bogazici University",
        "city": "Istanbul",
        "description": "Selective public university overlooking the Bosphorus.",
        "country_code": "TR",
        "programs": [
            {"name": "Business Administration", "degree_level": "bachelor", "requirements": {"IELTS": 6.5, "SAT": 1320}},
            {"name": "Finance", "degree_level": "master", "requirements": {"IELTS": 7.0}},
        ],
    },
    {
        "name": "University of Bucharest",
        "city": "Bucharest",
        "description": "Comprehensive Romanian university.",
        "country_code": "RO",
        "programs": [
            {"name": "International Relations", "degree_level": "bachelor", "requirements": {"IELTS": 6.0}},
            {"name": "Data Science", "degree_level": "master", "requirements": {"IELTS": 6.5}},
        ],
    },
    {
        "name": "Politehnica University of Bucharest",
        "city": "Bucharest",
        "description": "Largest technical university in Romania.",
        "country_code": "RO",
        "programs": [
            {"name": "Mechanical Engineering", "degree_level": "bachelor", "requirements": {"IELTS": 6.0, "SAT": 1250}},
            {"name": "Computer Science", "degree_level": "bachelor", "requirements": {"IELTS": 6.0, "SAT": 1300}},
        ],
    },
    {
        "name": "Babeș-Bolyai University",
        "city": "Cluj-Napoca",
        "description": "Multicultural university with wide offerings.",
        "country_code": "RO",
        "programs": [
            {"name": "Business Administration", "degree_level": "bachelor", "requirements": {"IELTS": 6.0}},
            {"name": "Computer Science", "degree_level": "bachelor", "requirements": {"IELTS": 6.0}},
        ],
    },
    {
        "name": "Technical University of Munich",
        "city": "Munich",
        "description": "Germany's premier technical university.",
        "country_code": "DE",
        "programs": [
            {"name": "Mechanical Engineering", "degree_level": "bachelor", "requirements": {"IELTS": 6.5, "SAT": 1400}},
            {"name": "Data Science", "degree_level": "master", "requirements": {"IELTS": 7.0}},
        ],
    },
    {
        "name": "Humboldt University of Berlin",
        "city": "Berlin",
        "description": "Historic Berlin university covering humanities and sciences.",
        "country_code": "DE",
        "programs": [
            {"name": "International Relations", "degree_level": "bachelor", "requirements": {"IELTS": 6.5}},
            {"name": "Business Administration", "degree_level": "bachelor", "requirements": {"IELTS": 6.5}},
        ],
    },
    {
        "name": "Ludwig Maximilian University of Munich",
        "city": "Munich",
        "description": "Research-intensive university with global reach.",
        "country_code": "DE",
        "programs": [
            {"name": "Finance", "degree_level": "master", "requirements": {"IELTS": 7.0}},
            {"name": "Computer Science", "degree_level": "bachelor", "requirements": {"IELTS": 6.5, "SAT": 1360}},
        ],
    },
]


def seed() -> None:
    """Populate database with demo data."""

    Base.metadata.create_all(engine)
    with SessionLocal() as session:
        with session.begin():
            country_map = _seed_countries(session)
            exam_map = _seed_exams(session)
            program_map = _seed_programs(session)
            _seed_universities(session, country_map, program_map, exam_map)

    LOGGER.info("Seeding completed successfully.")


def _seed_countries(session: Session) -> dict[str, Country]:
    mapping: dict[str, Country] = {}
    for data in COUNTRIES:
        code = data["code"].upper()
        country = session.scalar(sa.select(Country).where(Country.code == code))
        if country:
            country.name = data["name"]
        else:
            country = Country(code=code, name=data["name"])
            session.add(country)
            session.flush()
        mapping[code] = country
    return mapping


def _seed_exams(session: Session) -> dict[str, Exam]:
    mapping: dict[str, Exam] = {}
    for name in EXAMS:
        exam = session.scalar(
            sa.select(Exam).where(sa.func.lower(Exam.name) == name.lower())
        )
        if exam is None:
            exam = Exam(name=name)
            session.add(exam)
            session.flush()
        mapping[name.lower()] = exam
    return mapping


def _seed_programs(session: Session) -> dict[Tuple[str, str], Program]:
    mapping: dict[Tuple[str, str], Program] = {}
    for data in PROGRAMS:
        level = DegreeLevel(data["degree_level"])
        stmt = sa.select(Program).where(
            sa.func.lower(Program.name) == data["name"].lower(),
            Program.degree_level == level,
        )
        program = session.scalar(stmt)
        if program is None:
            program = Program(name=data["name"], degree_level=level)
            session.add(program)
            session.flush()
        key = (data["name"].lower(), level.value)
        mapping[key] = program
    return mapping


def _seed_universities(
    session: Session,
    countries: dict[str, Country],
    programs: dict[Tuple[str, str], Program],
    exams: dict[str, Exam],
) -> None:
    for data in UNIVERSITIES:
        country = countries[data["country_code"].upper()]
        stmt = sa.select(University).where(
            sa.func.lower(University.name) == data["name"].lower()
        )
        university = session.scalar(stmt)
        if university is None:
            university = University(
                name=data["name"],
                city=data["city"],
                description=data["description"],
                country=country,
            )
            session.add(university)
            session.flush()
        else:
            university.city = data["city"]
            university.description = data["description"]
            university.country = country

        for program_info in data["programs"]:
            program_key = (
                program_info["name"].lower(),
                program_info["degree_level"],
            )
            program = programs[program_key]
            _ensure_requirements(
                session,
                university,
                program,
                program_info["requirements"],
                exams,
            )


def _ensure_requirements(
    session: Session,
    university: University,
    program: Program,
    requirements: Dict[str, float],
    exams: Dict[str, Exam],
) -> None:
    for exam_name, score in requirements.items():
        exam = exams[exam_name.lower()]
        stmt = sa.select(Requirement).where(
            Requirement.university_id == university.id,
            Requirement.program_id == program.id,
            Requirement.exam_id == exam.id,
        )
        requirement = session.scalar(stmt)
        if requirement is None:
            requirement = Requirement(
                university_id=university.id,
                program_id=program.id,
                exam_id=exam.id,
                min_score=float(score),
            )
            session.add(requirement)
        else:
            requirement.min_score = float(score)


if __name__ == "__main__":
    seed()
