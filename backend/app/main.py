"""
FastAPI application factory and entrypoint.

=== RUN INSTRUCTIONS ===

1. Install dependencies:
   cd backend
   pip install -r requirements.txt

2. Set up environment:
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY

3. Run the server:
   uvicorn app.main:app --reload

4. Test the chat endpoint:
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Find me computer science universities in USA"}'

5. Available endpoints:
   - GET  /api/health - Health check
   - POST /api/chat   - Chat with admissions assistant

"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import Settings, get_settings
from .routers import register_routers


def create_app() -> FastAPI:
    """Create and configure a FastAPI application instance."""
    settings: Settings = get_settings()
    app = FastAPI(title=settings.app_name, version=settings.app_version)

    # Add CORS middleware for frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_routers(app)

    return app


app = create_app()
