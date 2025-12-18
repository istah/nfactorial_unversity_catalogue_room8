"""Router registration helpers."""

from fastapi import FastAPI

from .api import health, universities


def register_routers(app: FastAPI) -> None:
    """Register all application routers."""

    app.include_router(health.router, prefix="/api")
    app.include_router(universities.router, prefix="/api")
