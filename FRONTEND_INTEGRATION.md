# Frontend Integration with Backend API

## Overview

Frontend (Next.js) is fully integrated with Backend (FastAPI) according to AGENTS.md specifications.

## Quick Start

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8000`

### Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment:**
```bash
# .env.local already configured for local development
cat frontend/.env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. **Start frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

4. **Ensure backend is running:**
```bash
cd backend
python -m uvicorn app.main:app --reload
# Backend runs on http://localhost:8000
```

## API Integration Details

### Endpoints Used

#### 1. GET /api/meta
**Purpose**: Load filter options (countries, programs, exams)

**Used by**: `UniversityFilters` component

**Response Structure**:
```json
{
  "countries": [
    {"id": "1", "name": "USA", "code": "US"},
    {"id": "2", "name": "UK", "code": "GB"}
  ],
  "programs": [
    {"id": "1", "name": "Computer Science"},
    {"id": "2", "name": "Engineering"}
  ],
  "exams": [
    {"id": "1", "name": "SAT"},
    {"id": "2", "name": "ACT"}
  ]
}
```

#### 2. GET /api/universities
**Purpose**: List universities with filters and pagination

**Used by**: `app/universities/page.tsx`

**Query Parameters**:
- `country_id` (optional): Filter by country
- `program_id` (optional): Filter by program
- `exam_id` (optional): Filter by exam
- `min_score` (optional): Filter by minimum score
- `search` (optional): Fuzzy search by name
- `page` (default: 1): Page number
- `page_size` (default: 20): Items per page

**Response Structure**:
```json
{
  "items": [
    {
      "id": "1",
      "name": "Stanford University",
      "country_id": "1",
      "country": {"id": "1", "name": "USA", "code": "US"},
      "description": "...",
      "programs": [
        {"id": "1", "name": "Computer Science"}
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

#### 3. GET /api/universities/{id}
**Purpose**: Get detailed information about a university

**Used by**: `app/universities/[id]/page.tsx`

**Response Structure**:
```json
{
  "id": "1",
  "name": "Stanford University",
  "country_id": "1",
  "country": {"id": "1", "name": "USA", "code": "US"},
  "description": "...",
  "programs": [
    {"id": "1", "name": "Computer Science"},
    {"id": "2", "name": "Engineering"}
  ],
  "requirements": [
    {
      "id": "1",
      "exam_id": "1",
      "exam": {"id": "1", "name": "SAT"},
      "min_score": 1470,
      "max_score": 1570
    }
  ]
}
```

#### 4. GET /api/health
**Purpose**: Health check

**Used by**: `services/api.ts` (optional)

**Response Structure**:
```json
{
  "status": "ok"
}
```

## Frontend Architecture

### Services Layer (`frontend/services/api.ts`)

Centralized API client with methods:
- `getUniversities(filters)` – Fetch universities list
- `getUniversity(id)` – Fetch university details
- `getMeta()` – Fetch filter metadata
- `health()` – Health check

### Types Layer (`frontend/types/university.ts`)

TypeScript interfaces matching backend schemas:
- `University` – Basic university info
- `UniversityDetail` – Full university with requirements
- `UniversityListResponse` – Paginated response
- `Country`, `Program`, `Exam`, `Requirement` – Metadata types
- `MetaResponse` – Combined metadata
- `UniversityFilters` – Filter parameters

### Components

#### UniversityFilters (`components/university/UniversityFilters.tsx`)
- Fetches metadata on mount
- Provides filter UI
- Calls parent callback with selected filters

#### UniversityCard (`components/university/UniversityCard.tsx`)
- Displays university summary
- Links to detail page
- Shows programs list

### Pages

#### Universities List (`app/universities/page.tsx`)
- Fetches universities with filters
- Displays paginated grid
- Handles loading/error states

#### University Detail (`app/universities/[id]/page.tsx`)
- Fetches university details
- Shows programs and requirements
- Displays exam requirements with scores

## Error Handling

All API calls include:
- Try-catch blocks
- User-friendly error messages
- Retry functionality
- Loading states

Example:
```typescript
try {
  const data = await universityService.getUniversities(filters);
  setUniversities(data.items);
} catch (error) {
  setError('Ошибка загрузки университетов');
}
```

## Environment Variables

**File**: `frontend/.env.local`

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production, update to your backend URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Testing Integration

### 1. Check Backend Health
```bash
curl http://localhost:8000/api/health
```

### 2. Check Meta Endpoint
```bash
curl http://localhost:8000/api/meta
```

### 3. Check Universities List
```bash
curl "http://localhost:8000/api/universities?page=1&page_size=10"
```

### 4. Check University Detail
```bash
curl http://localhost:8000/api/universities/1
```

### 5. Test Frontend
- Open http://localhost:3000
- Navigate to Universities page
- Test filters
- Click on university to see details

## Troubleshooting

### CORS Errors
**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Ensure backend has CORS enabled for frontend origin:
```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 404 Errors
**Problem**: `GET http://localhost:8000/api/universities 404`

**Solution**: 
- Check backend is running
- Verify endpoint exists in backend
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Timeout Errors
**Problem**: `Failed to fetch: timeout`

**Solution**:
- Check backend is responding
- Verify database connection
- Check network connectivity

## Data Flow

```
User Action
    ↓
Frontend Component
    ↓
services/api.ts (fetch)
    ↓
Backend API Endpoint
    ↓
Backend Service Layer
    ↓
Database
    ↓
Response (JSON)
    ↓
Frontend State Update
    ↓
UI Render
```

## Performance Considerations

- Pagination: Default 20 items per page
- Filters: Applied server-side for efficiency
- Caching: Consider adding React Query for client-side caching
- Loading states: Prevent multiple requests during loading

## Future Enhancements

- [ ] Add React Query for caching
- [ ] Implement infinite scroll
- [ ] Add favorites/bookmarks
- [ ] Implement comparison feature
- [ ] Add AI chat integration
- [ ] Add user authentication

## Related Files

- Backend API: `backend/app/api/universities.py`
- Backend Models: `backend/app/models/`
- Backend Schemas: `backend/app/schemas/`
- Frontend Services: `frontend/services/api.ts`
- Frontend Types: `frontend/types/university.ts`
- AGENTS.md: Project specification

## Support

For issues or questions:
1. Check AGENTS.md for API specification
2. Review backend logs
3. Check browser console for errors
4. Verify environment variables
