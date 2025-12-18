# AI Agents & Workflow

This project is developed using AI-assisted workflow.
We use Codex CLI together with Context7 MCP for structured generation.

## Active Agents

### 1. Backend Architect Agent

**Role:**

- Design backend architecture
- Define database schema
- Define API contracts

**Tools:**

- Codex CLI
- Context7 MCP

---

### 2. Backend Implementation Agent

**Role:**

- Generate FastAPI structure
- Generate models, schemas, routers
- Follow PEP8 and typing standards

**Rules:**

- Use FastAPI
- Use application factory pattern
- Follow REST conventions

---

### 3. Documentation & QA Agent

**Role:**

- Generate README
- API documentation
- Validate endpoints existence

---

## Context Usage

All agents MUST:

- Refer to Context7 MCP
- Reuse project structure and existing files
- Avoid overwriting unrelated files

---

## Constraints

- No monolithic files
- No magic globals
- Explicit imports
- Clear folder separation

## Backend Status

- **FastAPI Skeleton**: Application factory lives in `backend/app/main.py`, routers registered in `backend/app/routers.py`.
- **Backend Structure**:
  - `app/api/` – request routers (`health.py`, `universities.py`), one file per resource.
  - `app/services/` – database interaction layer (e.g., `university_service.py`) used by routers.
  - `app/schemas/` – Pydantic response models shared across endpoints.
  - `app/models/` – SQLAlchemy ORM entities for Country, University, Program, Exam, Requirement.
  - `migrations/` – Alembic environment plus versioned schema history.
- **Available Endpoints**:
  - `GET /api/health` verifies service uptime.
  - `GET /api/universities` lists universities with filters for country, program, exam, minimum score, and fuzzy name search plus pagination.
  - `GET /api/universities/{id}` returns detailed information with programs and per-exam requirements.
- **Database Layer**: SQLAlchemy 2.0 models located under `backend/app/models/` cover `Country`, `University`, `Program`, `Exam`, and `Requirement` with normalized relations for filtering by geography, program, exam, and minimum score.
- **Configuration**: Centralized settings (`backend/app/core/config.py`) expose `DATABASE_URL`; `.env.example` shows expected keys.
- **Migrations**: Alembic initialized under `backend/migrations`. Use `cd backend && alembic upgrade head` to apply and `alembic revision --autogenerate -m \"...\"` for new schema versions.
