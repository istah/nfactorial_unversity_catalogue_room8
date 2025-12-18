# University Catalog Room 8

AI-assisted FastAPI backend scaffold for managing a university catalog. This repository follows the multi-agent workflow outlined in `AGENTS.md` and stores the backend service under `backend/`.

## Structure

- `AGENTS.md` – describes the AI agents, roles, and constraints for contributions.
- `backend/` – FastAPI application using an application factory pattern. See `backend/README.md` for usage instructions and API docs.
 - `run_dev.sh` – helper script that starts backend (Uvicorn) and frontend (Next.js) concurrently with one command.

## Development Notes

All contributions should follow the agent guidelines, use explicit imports, and maintain modular files for future database and documentation work. Additional services (database, migrations, etc.) will be layered on as the project evolves.

## Current API Surface

- `GET /api/health` – operational readiness probe.
- `GET /api/universities` – paginated listing with filters for country, program, exam, minimum score, and name search.
- `GET /api/universities/{university_id}` – detailed university payload including programs and exam requirements.
- `GET /api/meta` – metadata for filters (countries, programs, exams).
- `POST /api/chat` – AI-powered chat endpoint for university admissions assistance.

## AI Chat Assistant

The project includes an AI-powered chat assistant built with LangGraph and OpenAI. It helps students find and compare universities based on their preferences.

### Chat Endpoint

```bash
POST /api/chat
Content-Type: application/json

{
  "message": "What universities are in Germany?",
  "chat_history": []
}
```

### Available AI Tools

1. **get_available_filters** – Lists all countries, programs, and exams in the database
2. **search_universities** – Search with filters (country, program, exam, score, query)
3. **get_university** – Get detailed info by university ID
4. **compare_universities** – Compare 2-5 universities side by side

### Configuration

Set the following in `backend/.env`:
```
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-4o-mini  # optional, defaults to gpt-4o-mini
```

## Demo Data

Use the seed script to load realistic demo content into the database:

```bash
python backend/app/seed.py
```

The script is idempotent; rerun whenever you need to refresh the sample data.

## Local Development Runner

To start both services together, use the helper script from the repo root:

```bash
./run_dev.sh
```

It activates the virtual environment, boots the FastAPI backend (assigning a free port automatically), installs frontend dependencies if needed, and runs `npm run dev`. Override ports via `BACKEND_PORT` / `FRONTEND_PORT` environment variables if desired.

## Tests

Smoke tests live in `backend/tests/` and ensure `/api/health`, `/api/universities`, `/api/meta`, and key filters behave as expected. Run them locally with:

```bash
PYTHONPATH=backend pytest backend/tests
```
