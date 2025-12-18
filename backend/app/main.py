"""FastAPI application factory and entrypoint."""

from fastapi import FastAPI

from .core.config import Settings, get_settings
from .routers import register_routers


def create_app() -> FastAPI:
    """Create and configure a FastAPI application instance."""
    settings: Settings = get_settings()
    app = FastAPI(title=settings.app_name, version=settings.app_version)

    register_routers(app)

    return app


app = create_app()
