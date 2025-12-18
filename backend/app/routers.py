"""Router registration helpers."""

from fastapi import FastAPI

from .api import health


def register_routers(app: FastAPI) -> None:
    """Register all application routers."""

    app.include_router(health.router, prefix="/api")
