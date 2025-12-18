"""Tests covering universities API endpoints."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_universities_listing_returns_items(client: TestClient) -> None:
    """Ensure list endpoint responds with paginated payload."""

    response = client.get("/api/universities")
    assert response.status_code == 200
    payload = response.json()

    assert payload["total"] >= 2
    assert len(payload["items"]) >= 2
    first = payload["items"][0]
    assert {"id", "name", "city", "country", "programs_count"}.issubset(first)


def test_university_detail_returns_programs(client: TestClient) -> None:
    """Fetch detail for the first university and validate nested data."""

    listing = client.get("/api/universities").json()
    university_id = listing["items"][0]["id"]
    response = client.get(f"/api/universities/{university_id}")
    assert response.status_code == 200

    payload = response.json()
    assert payload["id"] == university_id
    assert payload["country"]["code"] in {"KZ", "TR"}
    assert len(payload["programs"]) >= 1
    first_program = payload["programs"][0]
    assert {"id", "name", "degree_level", "requirements"}.issubset(first_program)
    assert len(first_program["requirements"]) >= 1


def test_universities_filter_by_country(client: TestClient) -> None:
    """Verify filtering by country code narrows the results."""

    response = client.get("/api/universities", params={"country": "KZ"})
    assert response.status_code == 200
    payload = response.json()

    assert payload["total"] >= 1
    assert all(item["country"]["code"] == "KZ" for item in payload["items"])
