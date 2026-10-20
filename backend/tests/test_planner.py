import sys
import os
from pathlib import Path
import pytest

# Ensure backend root is on Python path
BACKEND_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_ROOT))

from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import BudgetTier, TravelStyle, CompanionType

client = TestClient(app)

def test_health_endpoint():
    """Verify system health and subsystem availability."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "llm_engine" in data["features"]

def test_scenarios_listing():
    """Verify that all 3 mandatory course scenarios are returned with valid presets."""
    response = client.get("/api/scenarios")
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) == 3
    ids = [s["id"] for s in scenarios]
    assert "scenario-1-solo-weekend" in ids
    assert "scenario-2-couple-romantic" in ids
    assert "scenario-3-group-adventure" in ids

def test_scenario_1_solo_traveler():
    """Verify Scenario 1: Solo Traveler Weekend in Kyoto."""
    payload = {
        "destination": "Kyoto",
        "duration_days": 3,
        "budget_tier": "Budget",
        "travel_style": "Cultural & Historical",
        "companion_type": "Solo Traveler",
        "group_size": 1,
        "special_requests": "Temple walking routes and authentic matcha"
    }
    response = client.post("/api/generate", json=payload)
    assert response.status_code == 200
    itinerary = response.json()
    assert itinerary["destination"] == "Kyoto"
    assert itinerary["duration_days"] == 3
    assert len(itinerary["days"]) == 3
    assert itinerary["group_size"] == 1
    assert itinerary["budget_summary"]["total_estimated_usd"] > 0
    assert len(itinerary["packing_checklist"]) > 0

def test_scenario_2_couple_romantic():
    """Verify Scenario 2: Couple Planning Luxury Romantic Vacation in Santorini."""
    payload = {
        "destination": "Santorini",
        "duration_days": 4,
        "budget_tier": "Luxury",
        "travel_style": "Romantic Getaway",
        "companion_type": "Couple",
        "group_size": 2,
        "special_requests": "Caldera sunset dinner and scenic hikes"
    }
    response = client.post("/api/generate", json=payload)
    assert response.status_code == 200
    itinerary = response.json()
    assert itinerary["destination"] == "Santorini"
    assert itinerary["duration_days"] == 4
    assert len(itinerary["days"]) == 4
    assert itinerary["group_size"] == 2
    # Luxury budget for couple should reflect premium pricing
    assert itinerary["budget_summary"]["cost_per_person_usd"] > 500

def test_scenario_3_group_foodie():
    """Verify Scenario 3: Small Group Coordinating Multi-Day Foodie Trip in Tokyo."""
    payload = {
        "destination": "Tokyo",
        "duration_days": 5,
        "budget_tier": "Moderate",
        "travel_style": "Culinary & Foodie",
        "companion_type": "Small Group / Friends",
        "group_size": 4,
        "special_requests": "Street food markets and evening izakayas"
    }
    response = client.post("/api/generate", json=payload)
    assert response.status_code == 200
    itinerary = response.json()
    assert itinerary["destination"] == "Tokyo"
    assert itinerary["duration_days"] == 5
    assert len(itinerary["days"]) == 5
    assert itinerary["group_size"] == 4

def test_itinerary_persistence_and_interactive_toggle():
    """Verify saving, retrieving, activity toggle, and deletion."""
    # 1. Generate an itinerary
    payload = {
        "destination": "Paris",
        "duration_days": 2,
        "budget_tier": "Moderate",
        "travel_style": "Cultural & Historical",
        "companion_type": "Solo Traveler",
        "group_size": 1
    }
    gen_resp = client.post("/api/generate", json=payload)
    assert gen_resp.status_code == 200
    itinerary = gen_resp.json()
    trip_id = itinerary["id"]
    first_activity_id = itinerary["days"][0]["activities"][0]["id"]

    # 2. Retrieve by ID
    get_resp = client.get(f"/api/trips/{trip_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == trip_id

    # 3. Toggle activity completion
    patch_resp = client.patch(f"/api/trips/{trip_id}/activities/{first_activity_id}", json={"completed": True})
    assert patch_resp.status_code == 200
    updated_act = patch_resp.json()["days"][0]["activities"][0]
    assert updated_act["is_completed"] is True

    # 4. Export JSON
    export_resp = client.get(f"/api/export/{trip_id}/json")
    assert export_resp.status_code == 200
    assert export_resp.json()["id"] == trip_id

    # 5. List trips
    list_resp = client.get("/api/trips")
    assert list_resp.status_code == 200
    trips = list_resp.json()
    assert any(t["id"] == trip_id for t in trips)

    # 6. Delete trip
    del_resp = client.delete(f"/api/trips/{trip_id}")
    assert del_resp.status_code == 200

if __name__ == "__main__":
    pytest.main(["-v", __file__])
