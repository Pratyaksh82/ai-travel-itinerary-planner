from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional, Dict, Any
from app.models.schemas import (
    TripGenerateRequest,
    TripSaveRequest,
    Itinerary,
    ScenarioPreset,
    BudgetTier,
    TravelStyle,
    CompanionType
)
from app.services.llm_engine import llm_service
from app.services.database import db_service

router = APIRouter()

PRESET_SCENARIOS: List[ScenarioPreset] = [
    ScenarioPreset(
        id="scenario-1-solo-weekend",
        title="Solo Traveler - Weekend Cultural Immersion",
        subtitle="Kyoto, Japan • 3 Days • Budget Tier",
        target_persona="Solo Traveler",
        description="A solo adventurer seeking time-optimized shrine trails, authentic matcha cafes, and evening alley walks with minimal transit friction.",
        request=TripGenerateRequest(
            destination="Kyoto",
            duration_days=3,
            budget_tier=BudgetTier.BUDGET,
            travel_style=TravelStyle.CULTURAL,
            companion_type=CompanionType.SOLO,
            group_size=1,
            special_requests="Focus on early morning temple hikes, local ramen spots, and scenic photography."
        )
    ),
    ScenarioPreset(
        id="scenario-2-couple-romantic",
        title="Couple Planning - Romantic Aegean Getaway",
        subtitle="Santorini, Greece • 4 Days • Luxury Tier",
        target_persona="Couple",
        description="A romantic vacation balancing cliffside Caldera hikes, Aegean wine tasting, private sunset dining, and relaxed luxury pacing.",
        request=TripGenerateRequest(
            destination="Santorini",
            duration_days=4,
            budget_tier=BudgetTier.LUXURY,
            travel_style=TravelStyle.ROMANTIC,
            companion_type=CompanionType.COUPLE,
            group_size=2,
            special_requests="Scenic sunset terrace dining, quiet coastal spots, wine tasting, and relaxed pacing."
        )
    ),
    ScenarioPreset(
        id="scenario-3-group-adventure",
        title="Small Group - Foodie & Modern City Exploration",
        subtitle="Tokyo, Japan • 5 Days • Moderate Tier",
        target_persona="Small Group / Friends",
        description="A dynamic trip for 4 friends balancing street food tours, retro arcades, teamLab digital art, and lively Izakaya districts.",
        request=TripGenerateRequest(
            destination="Tokyo",
            duration_days=5,
            budget_tier=BudgetTier.MODERATE,
            travel_style=TravelStyle.FOODIE,
            companion_type=CompanionType.SMALL_GROUP,
            group_size=4,
            special_requests="Mix of high-tech digital attractions, street food markets, and shared evening izakayas."
        )
    )
]

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check and readiness probe."""
    return {
        "status": "healthy",
        "service": "AI Travel Itinerary Planner API",
        "version": "1.0.0",
        "features": {
            "llm_engine": "active",
            "sqlite_store": "active",
            "curated_knowledge": "active"
        }
    }

@router.get("/scenarios", response_model=List[ScenarioPreset])
async def get_scenarios():
    """Returns pre-configured scenarios matching course evaluation requirements."""
    return PRESET_SCENARIOS

@router.post("/generate", response_model=Itinerary)
async def generate_itinerary(request: TripGenerateRequest):
    """
    Synthesizes a personalized, day-by-day itinerary tailored to
    destination, budget tier, travel style, and group dynamics.
    """
    try:
        itinerary = await llm_service.generate_itinerary(request)
        # Automatically cache/save into database
        db_service.save_itinerary(itinerary, user_id="demo-user")
        return itinerary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")

@router.post("/trips", response_model=Dict[str, Any])
async def save_trip(payload: TripSaveRequest):
    """Saves an itinerary to the persistent store."""
    success = db_service.save_itinerary(payload.itinerary, user_id=payload.user_id or "demo-user")
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save itinerary")
    return {"status": "saved", "id": payload.itinerary.id}

@router.get("/trips", response_model=List[Dict[str, Any]])
async def list_trips(user_id: Optional[str] = None):
    """Retrieves all saved trip itineraries."""
    return db_service.list_itineraries(user_id)

@router.get("/trips/{trip_id}", response_model=Itinerary)
async def get_trip(trip_id: str):
    """Retrieves full details of a specific itinerary."""
    itinerary = db_service.get_itinerary(trip_id)
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary

@router.delete("/trips/{trip_id}")
async def delete_trip(trip_id: str):
    """Deletes an itinerary from the store."""
    deleted = db_service.delete_itinerary(trip_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return {"status": "deleted", "id": trip_id}

@router.patch("/trips/{trip_id}/activities/{activity_id}")
async def toggle_activity(trip_id: str, activity_id: str, completed: bool = Body(..., embed=True)):
    """Toggles completion state of an activity for interactive tracking."""
    updated = db_service.toggle_activity(trip_id, activity_id, completed)
    if not updated:
        raise HTTPException(status_code=404, detail="Itinerary or activity not found")
    return updated

@router.get("/export/{trip_id}/json")
async def export_trip_json(trip_id: str):
    """Exports raw JSON format for portability or offline viewing."""
    itinerary = db_service.get_itinerary(trip_id)
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary.model_dump()
