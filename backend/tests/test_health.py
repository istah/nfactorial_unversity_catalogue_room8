"""Smoke tests for health endpoint."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_health_endpoint_returns_ok(client: TestClient) -> None:
    """Ensure the health check endpoint responds with status OK."""

    response = client.get("/api/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert "timestamp" in payload
