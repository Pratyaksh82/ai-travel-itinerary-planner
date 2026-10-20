# API Specification & Endpoint Documentation
## AI Personalized Travel Itinerary Planner

Base URL: `http://localhost:8000/api`

### Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check & subsystem availability probe |
| `GET` | `/scenarios` | Returns the 3 pre-configured course benchmark scenarios |
| `POST` | `/generate` | Synthesizes a new customized day-by-day travel itinerary |
| `POST` | `/trips` | Saves an itinerary to the persistent database |
| `GET` | `/trips` | Lists all saved itineraries with metadata |
| `GET` | `/trips/{trip_id}` | Retrieves full day-by-day itinerary details by ID |
| `DELETE` | `/trips/{trip_id}` | Deletes a saved itinerary |
| `PATCH` | `/trips/{trip_id}/activities/{activity_id}` | Toggles activity completion status |
| `GET` | `/export/{trip_id}/json` | Exports the full itinerary as structured JSON |

---

### Request & Response Examples

#### 1. Generate Itinerary (`POST /api/generate`)
**Request Body**:
```json
{
  "destination": "Kyoto",
  "duration_days": 3,
  "budget_tier": "Budget",
  "travel_style": "Cultural & Historical",
  "companion_type": "Solo Traveler",
  "group_size": 1,
  "special_requests": "Focus on early morning temple hikes and matcha cafes"
}
```

**Response (200 OK)**:
```json
{
  "id": "trip-8d9e2a1b",
  "title": "3-Day Cultural & Historical in Kyoto",
  "destination": "Kyoto",
  "country": "Japan",
  "hero_image_url": "https://images.unsplash.com/...",
  "duration_days": 3,
  "budget_tier": "Budget",
  "travel_style": "Cultural & Historical",
  "companion_type": "Solo Traveler",
  "group_size": 1,
  "days": [
    {
      "day_number": 1,
      "title": "Day 1: Heritage, Architecture & Local Art",
      "theme": "Heritage, Architecture & Local Art (Day 1)",
      "activities": [
        {
          "id": "act-1-1",
          "title": "Fushimi Inari Taisha Hike",
          "time_slot": "Morning",
          "time_estimate": "09:00 AM - 12:30 PM",
          "description": "Hike through 10,000 iconic vermilion torii gates winding up sacred Mount Inari.",
          "location": "Fushimi Ward",
          "estimated_cost_usd": 0.0,
          "category": "Culture",
          "booking_tip": "Arrive before 7:30 AM to experience peaceful morning mist without crowds.",
          "is_completed": false
        }
      ],
      "meals": [
        {
          "meal_type": "Breakfast",
          "restaurant_name": "Inoda Coffee Main Shop",
          "cuisine_type": "Kissaten / Western-Japanese",
          "dish_recommendation": "Arabian Pearl drip blend with Kyoto scrambled egg toast",
          "estimated_cost_usd": 12.0,
          "neighborhood": "Sanjo"
        }
      ],
      "transportation_tip": "Utilize the local metro/bus network or regional transit cards.",
      "daily_budget_estimated_usd": 125.0
    }
  ],
  "budget_summary": {
    "currency": "USD",
    "total_estimated_usd": 420.50,
    "cost_per_person_usd": 420.50,
    "accommodation_usd": 156.75,
    "food_and_dining_usd": 148.50,
    "activities_and_attractions_usd": 45.0,
    "local_transport_usd": 66.0,
    "buffer_contingency_usd": 41.62,
    "breakdown": [
      { "category": "Accommodation", "amount_usd": 156.75, "percentage": 37.3 },
      { "category": "Food & Dining", "amount_usd": 148.50, "percentage": 35.3 }
    ]
  },
  "packing_checklist": [
    { "category": "Essentials", "item": "Passport and travel insurance cards", "importance": "Must Have" }
  ],
  "safety_and_etiquette": [
    "Respect sacred grounds: speak softly in Buddhist temples and Shinto shrines."
  ]
}
```
