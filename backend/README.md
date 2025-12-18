# Backend Service

Initial FastAPI scaffold for the University Catalog system. The project follows an application factory pattern and keeps components modular for future growth (SQLAlchemy, Alembic, etc.).

## Features

- FastAPI app factory (`app/main.py`) with centralized router registration
- Config management via Pydantic settings (`app/core/config.py`)
- Health check endpoint as baseline integration test (`app/api/health.py`)
- `.env` support for environment-specific values

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
