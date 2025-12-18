# Quick Start Guide

Get the project running in 10 minutes.

## Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL or SQLite

## Step 1: Backend (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
alembic upgrade head

# Seed demo data
python app/seed.py

# Run backend
python -m uvicorn app.main:app --reload
```

✅ Backend running on http://localhost:8000

## Step 2: Frontend (5 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

✅ Frontend running on http://localhost:3000

## Step 3: Test Integration

1. Open http://localhost:3000 in browser
2. Click "Университеты" (Universities)
3. Verify universities load
4. Test filters
5. Click on a university to see details

✅ Integration working!

---

## Verify Endpoints

### Backend Health
```bash
curl http://localhost:8000/api/health
```

### Meta (Filters)
```bash
curl http://localhost:8000/api/meta
```

### Universities List
```bash
curl "http://localhost:8000/api/universities?page=1&page_size=10"
```

### University Detail
```bash
curl http://localhost:8000/api/universities/1
```

---

## Common Issues

### Port Already in Use

**Backend**:
```bash
python -m uvicorn app.main:app --reload --port 8001
```

**Frontend**:
```bash
npm run dev -- -p 3001
```

### Database Error

Use SQLite (default) or configure PostgreSQL in `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost/university_db
```

### API Connection Error

Check:
1. Backend is running
2. `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is correct
3. No firewall blocking port 8000

---

## Next Steps

- Read `FRONTEND_INTEGRATION.md` for detailed integration info
- Read `RUN_LOCALLY.md` for complete setup guide
- Check `AGENTS.md` for API specification
- Review `qa-reports/` for QA report

---

## Useful Commands

### Backend
```bash
# Run with different port
python -m uvicorn app.main:app --reload --port 8001

# View API docs
# Open http://localhost:8000/docs

# Create migration
alembic revision --autogenerate -m "Description"

# Seed data
python app/seed.py
```

### Frontend
```bash
# Build for production
npm run build

# Check TypeScript
npm run type-check

# Format code
npm run format
```

---

## Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── migrations/      # Database migrations
│
├── frontend/            # Next.js frontend
│   ├── app/            # Pages
│   ├── components/     # React components
│   ├── services/       # API client
│   └── types/          # TypeScript types
│
├── AGENTS.md           # Project specification
├── FRONTEND_INTEGRATION.md
├── RUN_LOCALLY.md
└── INTEGRATION_SUMMARY.md
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/meta` | GET | Filter metadata |
| `/api/universities` | GET | List universities |
| `/api/universities/{id}` | GET | University details |

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./test.db
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python version (3.10+) |
| Frontend won't start | Check Node version (18+) |
| Port in use | Use different port with --port flag |
| Database error | Use SQLite or configure PostgreSQL |
| API connection error | Check backend is running and URL is correct |

---

## Support

- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000
- **Documentation**: See AGENTS.md, FRONTEND_INTEGRATION.md, RUN_LOCALLY.md

---

**Ready to go!** 🚀

Start with Step 1 above and you'll have the project running in 10 minutes.
