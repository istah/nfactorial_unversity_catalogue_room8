# Backend Service

## Project Overview

The backend powers the University Catalog experience with a FastAPI application that exposes metadata, university listings, and detailed requirements. The codebase embraces modular components (routers, services, schemas, models) so additional resources can be added incrementally without creating monoliths.

## Architecture

- **FastAPI application factory** (`app/main.py`) wires routers defined under `app/api/`.
- **SQLAlchemy 2.0 ORM models** (`app/models/`) capture normalized relations for countries, universities, programs, exams, and requirements.
- **Service layer** (`app/services/`) encapsulates query logic to keep routers slim and reusable.
- **Pydantic v2 schemas** (`app/schemas/`) provide typed response contracts.
- **Alembic migrations** (`migrations/`) manage schema evolution; configuration lives in `backend/alembic.ini`.
- **Settings & database bootstrap** (`app/core/`) load environment variables and establish database sessions.

## Running Locally

1. Create a virtual environment and install dependencies:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```

2. Configure environment variables:

   ```bash
   cp backend/.env.example backend/.env
   # edit DATABASE_URL, etc. as needed
   ```

3. Apply migrations (replace the URL if you are not using the `.env` default):

   ```bash
   cd backend
   alembic upgrade head
   ```

4. Launch the development server:

   ```bash
   uvicorn app.main:app --reload --factory --app-dir backend/app
   ```

   The API will be available at `http://127.0.0.1:8000`.

## Seeding Demo Data

Populate a database with repeatable demo content using the idempotent seed script:

```bash
python backend/app/seed.py
```

Re-running the command updates existing rows without duplicating data, which is ideal for local demos or automated smoke tests.

## Running Tests

Install pytest (if not already installed), then run:

```bash
PYTHONPATH=backend pytest backend/tests
```

The tests spin up an in-memory SQLite database, seed minimal reference data, and exercise the health, universities, and meta endpoints.

## API Endpoints

- `GET /api/health` – Simple uptime probe.
- `GET /api/universities` – Supports filters (`country`, `program`, `exam`, `min_score`, `q`) and pagination (`page`, `limit`). Returns country metadata and the number of programs per university.
- `GET /api/universities/{university_id}` – Returns full university profile, including programs, degree levels, and per-exam minimum scores.
- `GET /api/meta` – Provides countries, programs, and exams for populating filter dropdowns on the frontend.
- `POST /api/chat` – AI-powered chat endpoint using LangGraph agent with university search tools.

## AI Chat Endpoint

The `/api/chat` endpoint provides an AI assistant for university admissions queries.

### Request

```json
{
  "message": "What universities offer Computer Science in Germany?",
  "chat_history": []
}
```

### Response

```json
{
  "response": "Here are universities in Germany offering Computer Science...",
  "tool_calls": null
}
```

### Agent Tools

The AI agent has access to these tools:
- `get_available_filters` – Get all countries, programs, and exams
- `search_universities` – Search with filters
- `get_university` – Get details by ID
- `compare_universities` – Compare 2-5 universities

### Configuration

Requires `OPENAI_API_KEY` in `.env`. Optionally set `OPENAI_MODEL` (default: `gpt-4o-mini`).
