# Backend Service

Initial FastAPI scaffold for the University Catalog system. The project follows an application factory pattern and keeps components modular for future growth (SQLAlchemy, Alembic, etc.).

## Features

- FastAPI app factory (`app/main.py`) with centralized router registration
- Config management via Pydantic settings (`app/core/config.py`)
- Health check endpoint as baseline integration test (`app/api/health.py`)
- `.env` support for environment-specific values
- SQLAlchemy models with Alembic migrations (`app/models`, `migrations/`)

## Getting Started

1. Create and activate a virtual environment.
2. Install dependencies:

   ```bash
   pip install -r backend/requirements.txt
   ```

3. Copy environment template and adjust values:

   ```bash
   cp backend/.env.example backend/.env
   ```

4. Launch the development server:

   ```bash
   uvicorn app.main:app --reload --factory --app-dir backend/app
   ```

The API becomes available on `http://127.0.0.1:8000`. Add new routers in `app/api/` and register them through `app/routers.py`.

## Database & Migrations

1. Update `backend/.env` with your Postgres `DATABASE_URL`.
2. Apply migrations:

   ```bash
   cd backend
   alembic upgrade head
   ```

3. Create new migrations when models change:

   ```bash
   alembic revision --autogenerate -m "describe change"
   ```

## API Endpoints

- `GET /api/universities` – Supports filters (`country`, `program`, `exam`, `min_score`, `q`) and pagination (`page`, `limit`). Returns country metadata and the number of programs per university.
- `GET /api/universities/{university_id}` – Returns full university profile, including programs, degree levels, and per-exam minimum scores.
