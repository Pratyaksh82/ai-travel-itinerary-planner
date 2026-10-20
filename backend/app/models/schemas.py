from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class BudgetTier(str, Enum):
    BUDGET = "Budget"
    MODERATE = "Moderate"
    LUXURY = "Luxury"

class TravelStyle(str, Enum):
    CULTURAL = "Cultural & Historical"
    RELAXED = "Relaxed & Scenic"
    ADVENTURE = "Adventure & Outdoor"
    FOODIE = "Culinary & Foodie"
    ROMANTIC = "Romantic Getaway"
    NIGHTLIFE = "Nightlife & City Exploration"

class CompanionType(str, Enum):
    SOLO = "Solo Traveler"
    COUPLE = "Couple"
    SMALL_GROUP = "Small Group / Friends"
    FAMILY = "Family with Kids"

class Activity(BaseModel):
    id: str
    title: str
    time_slot: str  # "Morning", "Afternoon", "Evening", "Night"
    time_estimate: str  # e.g. "09:00 AM - 12:00 PM"
    description: str
    location: str
    estimated_cost_usd: float
    category: str  # "Sightseeing", "Food", "Culture", "Relaxation", "Adventure"
    booking_tip: Optional[str] = None
    is_completed: bool = False

class MealRecommendation(BaseModel):
    meal_type: str  # "Breakfast", "Lunch", "Dinner"
    restaurant_name: str
    cuisine_type: str
    dish_recommendation: str
    estimated_cost_usd: float
    neighborhood: str

class DayPlan(BaseModel):
    day_number: int
    title: str
    theme: str
    activities: List[Activity]
    meals: List[MealRecommendation]
    transportation_tip: str
    daily_budget_estimated_usd: float

class BudgetCategory(BaseModel):
    category: str
    amount_usd: float
    percentage: float

class BudgetSummary(BaseModel):
    currency: str = "USD"
    total_estimated_usd: float
    cost_per_person_usd: float
    accommodation_usd: float
    food_and_dining_usd: float
    activities_and_attractions_usd: float
    local_transport_usd: float
    buffer_contingency_usd: float
    breakdown: List[BudgetCategory]

class PackingItem(BaseModel):
    category: str  # "Essentials", "Clothing", "Electronics", "Health & Comfort"
    item: str
    importance: str  # "Must Have", "Recommended", "Optional"

class Itinerary(BaseModel):
    id: str
    title: str
    destination: str
    country: str
    hero_image_url: str
    duration_days: int
    budget_tier: BudgetTier
    travel_style: TravelStyle
    companion_type: CompanionType
    group_size: int
    overview_summary: str
    best_time_to_visit: str
    local_currency_advice: str
    safety_and_etiquette: List[str]
    days: List[DayPlan]
    budget_summary: BudgetSummary
    packing_checklist: List[PackingItem]
    created_at: str

class TripGenerateRequest(BaseModel):
    destination: str = Field(..., description="Target destination city or region")
    duration_days: int = Field(3, ge=1, le=14, description="Trip duration in days (1-14)")
    budget_tier: BudgetTier = Field(BudgetTier.MODERATE, description="Budget category")
    travel_style: TravelStyle = Field(TravelStyle.CULTURAL, description="Dominant travel theme")
    companion_type: CompanionType = Field(CompanionType.SOLO, description="Travel group type")
    group_size: int = Field(1, ge=1, le=20, description="Total number of travelers")
    special_requests: Optional[str] = Field(None, description="Custom interests, dietary requirements, pace preferences")

class TripSaveRequest(BaseModel):
    itinerary: Itinerary
    user_id: Optional[str] = "demo-user"

class ScenarioPreset(BaseModel):
    id: str
    title: str
    subtitle: str
    target_persona: str
    description: str
    request: TripGenerateRequest
