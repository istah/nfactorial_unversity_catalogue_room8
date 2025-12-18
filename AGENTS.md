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

**Additional Responsibilities:**

- Generate structured QA reports and project documentation
- Save all reports in `qa-reports` folder in the project repository
- Maintain versioned history of QA reports
- Use MCP Playwright to validate runtime behavior before generating reports
- Update Notion (Shared → QA Reports) with latest QA findings
- Ensure documentation is consistent with backend structure and implemented endpoints

**Tools:**

- MCP Playwright
- Notion Agent

**Rules:**

- Do not make changes in code. Work only in `qa-reports` folder.

## QA & Documentation Workflow

1. Analyze project using MCP Playwright and Cursor
2. Compare implementation against QA_GUIDE.md and expected behavior
3. Generate a structured QA report
4. Save report in local folder `qa-reports/`
5. Update Notion page (Shared → QA Reports) with the new report
6. Track previous reports to maintain history and versioning
7. Document project structure, endpoints, and data models for reference

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
  - `GET /api/meta` exposes countries, programs, and exams for populating filters.
- **Database Layer**: SQLAlchemy 2.0 models located under `backend/app/models/` cover `Country`, `University`, `Program`, `Exam`, and `Requirement` with normalized relations for filtering by geography, program, exam, and minimum score.
- **Configuration**: Centralized settings (`backend/app/core/config.py`) expose `DATABASE_URL`; `.env.example` shows expected keys.
- **Migrations**: Alembic initialized under `backend/migrations`. Use `cd backend && alembic upgrade head` to apply and `alembic revision --autogenerate -m \"...\"` for new schema versions.
- **Demo Data**: Run `python backend/app/seed.py` to populate countries, universities, programs, and exam requirements. Script is idempotent for repeated local runs.

---

## Frontend Integration Status

### Frontend Architecture
- **Framework**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Location**: `frontend/` directory
- **API Integration**: Fully integrated with backend endpoints from AGENTS.md

### Frontend Structure
- `app/` – Next.js pages (universities list, detail, home, chat)
- `components/` – React components (UI, University, Chat)
- `services/` – API service layer (`api.ts` for universities)
- `types/` – TypeScript types matching backend schemas
- `lib/` – Utilities and mock data

### API ↔ Frontend Mapping

| Backend Endpoint | Frontend Usage | Component/Page |
|------------------|----------------|----------------|
| `GET /api/health` | Health check on app load | `services/api.ts` |
| `GET /api/meta` | Load filter options (countries, programs, exams) | `components/university/UniversityFilters.tsx` |
| `GET /api/universities` | List universities with filters | `app/universities/page.tsx` |
| `GET /api/universities/{id}` | Display university details | `app/universities/[id]/page.tsx` |

### Frontend Data Types (TypeScript)

**Mapped from Backend Schemas:**
- `University` – Basic university info with country, programs
- `UniversityDetail` – Full university with requirements
- `UniversityListResponse` – Paginated list response
- `Country`, `Program`, `Exam`, `Requirement` – Filter metadata
- `MetaResponse` – Combined metadata response

### Frontend Features Implemented

✅ **Universities List Page** (`/universities`)
- Fetches from `GET /api/universities` with filters
- Displays paginated results
- Real-time filtering by country, program, exam, min_score, search
- Loading and error states

✅ **University Detail Page** (`/universities/[id]`)
- Fetches from `GET /api/universities/{id}`
- Shows programs and requirements
- Displays exam requirements with min/max scores

✅ **Filter Component** (`UniversityFilters`)
- Fetches from `GET /api/meta` on mount
- Populates dropdowns with countries, programs, exams
- Supports numeric input for min_score filter

✅ **Error Handling**
- Try-catch blocks in all API calls
- User-friendly error messages
- Retry functionality

✅ **Loading States**
- Spinner during data fetch
- Disabled buttons during loading
- Empty state messages

### Environment Configuration

**File**: `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Frontend Development

**Start frontend dev server:**
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

**Backend must be running:**
```bash
cd backend
python -m uvicorn app.main:app --reload
# Backend runs on http://localhost:8000
```

### Data Usage Notes

**Fields Currently Used:**
- `University.id`, `name`, `country_id`, `country.name`, `description`
- `University.programs[]` – displayed as list
- `University.requirements[]` – shown with exam name and scores
- `Program.name` – displayed in filters and university detail
- `Country.name` – displayed in filters and university cards
- `Exam.name` – displayed in filters and requirements

**Reserved for Future:**
- `University.image` – placeholder for university images
- `Requirement.max_score` – optional, used when available
- Additional metadata fields in `MetaResponse`

### Integration Notes

- Frontend uses `NEXT_PUBLIC_API_URL` environment variable for API base URL
- All API calls include proper error handling and user feedback
- TypeScript types ensure type safety across frontend-backend boundary
- Mock data removed; all data comes from backend API
- Pagination supported via `page` and `page_size` query parameters
