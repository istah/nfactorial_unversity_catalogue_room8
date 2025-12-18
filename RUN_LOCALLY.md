# Running the Project Locally

Complete guide to run both frontend and backend locally.

## Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL (or SQLite for development)
- Git

## Quick Start (5 minutes)

### Terminal 1: Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
alembic upgrade head

# Seed demo data
python app/seed.py

# Run backend
python -m uvicorn app.main:app --reload
```

Backend will be available at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### Terminal 2: Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## Detailed Setup

### Backend Setup

#### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

Activate it:
- **macOS/Linux**: `source venv/bin/activate`
- **Windows**: `venv\Scripts\activate`

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Configure Database

**Option A: SQLite (Development)**

Default configuration uses SQLite. No additional setup needed.

**Option B: PostgreSQL (Production)**

Create `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost/university_db
```

Then create database:

```bash
createdb university_db
```

#### 4. Apply Migrations

```bash
alembic upgrade head
```

#### 5. Seed Demo Data

```bash
python app/seed.py
```

This populates:
- Countries
- Universities
- Programs
- Exams
- Requirements

#### 6. Run Backend

```bash
python -m uvicorn app.main:app --reload
```

**Output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

**Test it**:
```bash
curl http://localhost:8000/api/health
# {"status": "ok"}
```

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Configure Environment

File `frontend/.env.local` is already configured:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production, update to your backend URL.

#### 3. Run Frontend

```bash
npm run dev
```

**Output**:
```
> frontend@0.1.0 dev
> next dev

  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Environments: .env.local
```

#### 4. Open in Browser

Navigate to: **http://localhost:3000**

---

## Verify Integration

### 1. Check Backend Health

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{"status": "ok"}
```

### 2. Check Meta Endpoint

```bash
curl http://localhost:8000/api/meta
```

Expected response:
```json
{
  "countries": [...],
  "programs": [...],
  "exams": [...]
}
```

### 3. Check Universities List

```bash
curl "http://localhost:8000/api/universities?page=1&page_size=10"
```

Expected response:
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "page_size": 10
}
```

### 4. Test Frontend

1. Open http://localhost:3000
2. Navigate to "Университеты" (Universities)
3. Verify universities load
4. Test filters
5. Click on a university to see details

---

## Common Issues

### Backend Issues

#### Port 8000 Already in Use

```bash
# Use different port
python -m uvicorn app.main:app --reload --port 8001
```

Then update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

#### Database Connection Error

```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) could not connect to server
```

**Solution**:
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Use SQLite instead (default)

#### Migration Error

```
alembic.util.exc.CommandError: Can't locate revision identified by 'abc123'
```

**Solution**:
```bash
# Reset migrations
alembic downgrade base
alembic upgrade head
```

### Frontend Issues

#### Port 3000 Already in Use

```bash
npm run dev -- -p 3001
```

Then open http://localhost:3001

#### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Error

Check:
1. Backend is running on http://localhost:8000
2. `NEXT_PUBLIC_API_URL` in `.env.local` is correct
3. CORS is enabled on backend
4. No firewall blocking port 8000

---

## Development Workflow

### Making Changes

#### Backend Changes

1. Edit files in `backend/app/`
2. Backend auto-reloads (uvicorn --reload)
3. Test with curl or frontend

#### Frontend Changes

1. Edit files in `frontend/`
2. Frontend auto-reloads (next dev)
3. Changes appear immediately in browser

### Database Changes

#### Add New Model

1. Create model in `backend/app/models/`
2. Create migration:
   ```bash
   alembic revision --autogenerate -m "Add new model"
   ```
3. Apply migration:
   ```bash
   alembic upgrade head
   ```

#### Update Schema

1. Modify model
2. Create migration:
   ```bash
   alembic revision --autogenerate -m "Update schema"
   ```
3. Apply migration:
   ```bash
   alembic upgrade head
   ```

---

## Useful Commands

### Backend

```bash
# Run with specific port
python -m uvicorn app.main:app --reload --port 8001

# Run without auto-reload
python -m uvicorn app.main:app

# View API docs
# Open http://localhost:8000/docs

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Seed data
python app/seed.py
```

### Frontend

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Check TypeScript
npm run type-check

# Format code
npm run format
```

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=sqlite:///./test.db
# or
DATABASE_URL=postgresql://user:password@localhost/university_db

# Optional
DEBUG=True
LOG_LEVEL=INFO
```

### Frontend (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

### E2E Tests

```bash
cd frontend
npm run test:e2e
```

---

## Debugging

### Backend Debugging

Add breakpoints in VS Code:

1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["app.main:app", "--reload"],
      "jinja": true,
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

2. Press F5 to start debugging

### Frontend Debugging

1. Open DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in code
4. Reload page

Or use VS Code debugger:

1. Install "Debugger for Chrome" extension
2. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

---

## Production Deployment

### Backend Deployment

1. Set `DEBUG=False`
2. Use production database (PostgreSQL)
3. Set `DATABASE_URL` environment variable
4. Run migrations: `alembic upgrade head`
5. Deploy to Heroku, Railway, or your server

### Frontend Deployment

1. Build: `npm run build`
2. Update `NEXT_PUBLIC_API_URL` to production backend
3. Deploy to Vercel, Netlify, or your server

---

## Troubleshooting Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Database migrations applied
- [ ] Demo data seeded
- [ ] `NEXT_PUBLIC_API_URL` correct
- [ ] CORS enabled on backend
- [ ] No port conflicts
- [ ] Virtual environment activated (backend)
- [ ] Dependencies installed (both)
- [ ] `.env` files configured

---

## Support

For issues:

1. Check AGENTS.md for API specification
2. Review backend logs
3. Check browser console (frontend)
4. Verify environment variables
5. Check network requests in DevTools

---

## Next Steps

1. ✅ Run backend locally
2. ✅ Run frontend locally
3. ✅ Test integration
4. ✅ Make changes
5. ✅ Deploy to production

Happy coding! 🚀
