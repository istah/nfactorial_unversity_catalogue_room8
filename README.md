# University Catalog Room 8

AI-assisted FastAPI backend scaffold for managing a university catalog. This repository follows the multi-agent workflow outlined in `AGENTS.md` and stores the backend service under `backend/`.

## Structure

- `AGENTS.md` – describes the AI agents, roles, and constraints for contributions.
- `backend/` – FastAPI application using an application factory pattern. See `backend/README.md` for usage instructions and API docs.

## Development Notes

All contributions should follow the agent guidelines, use explicit imports, and maintain modular files for future database and documentation work. Additional services (database, migrations, etc.) will be layered on as the project evolves.

## Current API Surface

- `GET /api/health` – operational readiness probe.
- `GET /api/universities` – paginated listing with filters for country, program, exam, minimum score, and name search.
- `GET /api/universities/{university_id}` – detailed university payload including programs and exam requirements.
- `GET /api/meta` – metadata for filters (countries, programs, exams).

## Demo Data

Use the seed script to load realistic demo content into the database:

```bash
python backend/app/seed.py
```

The script is idempotent; rerun whenever you need to refresh the sample data.
