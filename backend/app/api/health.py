"""Health check endpoint for the API."""

from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, status

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", status_code=status.HTTP_200_OK, summary="Application health check")
def health_check() -> dict[str, str]:
    """Return a simple payload confirming the API is running."""

    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}
