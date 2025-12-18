"""Application factory access for the backend package."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from fastapi import FastAPI


def create_app() -> "FastAPI":
    """Proxy to the actual application factory."""

    from .main import create_app as _create_app

    return _create_app()


__all__ = ["create_app"]
