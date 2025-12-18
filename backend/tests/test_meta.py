"""Tests for metadata endpoint used by filter forms."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_meta_endpoint_returns_collections(client: TestClient) -> None:
    """Validate meta endpoint returns countries, programs, and exams."""

    response = client.get("/api/meta")
    assert response.status_code == 200
    payload = response.json()

    assert set(payload.keys()) == {"countries", "programs", "exams"}
    assert len(payload["countries"]) >= 2
    assert len(payload["programs"]) >= 2
    assert len(payload["exams"]) >= 1

    first_country = payload["countries"][0]
    assert {"id", "name", "code"}.issubset(first_country.keys())
