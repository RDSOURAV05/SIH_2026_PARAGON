from pydantic import BaseModel, Field
from typing import List, Optional

# Destination schemas
class DestinationBase(BaseModel):
    name: str
    category: str
    lat: float = Field(..., ge=8.0, le=13.0)
    lon: float = Field(..., ge=74.5, le=77.8)
    carrying_capacity: int
    current_crowd: int
    eco_sensitivity: float = Field(..., ge=0.0, le=1.0)
    infrastructure_score: float = Field(..., ge=0.0, le=1.0)
    local_economic_weight: float = Field(..., ge=0.0, le=1.0)
    weather_index: float = Field(1.0, ge=0.0, le=1.0)
    description: str
    image_url: Optional[str] = None

class DestinationCreate(DestinationBase):
    pass

class Destination(DestinationBase):
    id: int

    class Config:
        from_attributes = True

# Recommendation schemas
class RecommendationRequest(BaseModel):
    preferences: List[str]  # e.g., ["hill_station", "waterfalls", "beach"]
    target_destination_id: Optional[int] = None
    lat: Optional[float] = None
    lon: Optional[float] = None

class AlternativeRecommendation(BaseModel):
    destination: Destination
    score: float
    distance_km: float
    incentive_text: str
    redirection_reason: str

class RecommendationResponse(BaseModel):
    is_congested: bool
    congestion_ratio: float
    alert_message: Optional[str] = None
    recommendations: List[AlternativeRecommendation]


# Itinerary validation schemas
import datetime

class ItineraryCreate(BaseModel):
    traveler_name: str
    travel_date: str
    destinations_list: str

class Itinerary(ItineraryCreate):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

