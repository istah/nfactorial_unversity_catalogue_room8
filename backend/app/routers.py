"""Router registration helpers."""

from __future__ import annotations

import logging
from fastapi import FastAPI

from .api import health, meta, universities

logger = logging.getLogger(__name__)

try:
    from .api import chat

    CHAT_IMPORT_ERROR = None
except Exception as exc:  # pragma: no cover - best effort logging
    chat = None  # type: ignore[assignment]
    CHAT_IMPORT_ERROR = exc


def register_routers(app: FastAPI) -> None:
    """Register all application routers."""

    app.include_router(health.router, prefix="/api")
    app.include_router(meta.router, prefix="/api")
    app.include_router(universities.router, prefix="/api")
    if chat is not None:
        app.include_router(chat.router, prefix="/api")
    else:
        logger.warning("Chat router disabled: %s", CHAT_IMPORT_ERROR)
