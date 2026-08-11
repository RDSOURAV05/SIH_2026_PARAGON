from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import copy
import uuid

app = FastAPI(
    title="Smart Kerala Tourism Crowd Management & Redirection Engine",
    description="API for destination tracking, 12-hour forecasting, crowd redirection, crowd simulation, and saved itineraries persistence.",
    version="1.1.0"
)

# --- Data Schemas ---

class Location(BaseModel):
    latitude: float
    longitude: float

class DestinationBase(BaseModel):
    id: str
    name: str
    district: str
    category: str
    carrying_capacity: int
    current_load: int
    status: str  # "normal", "crowded", "overcapacity"
    location: Location

class ForecastEntry(BaseModel):
    hour_offset: int
    timestamp: str
    predicted_load: int
    capacity_ratio: float
    weather: str
    risk_level: str  # "low", "moderate", "high", "critical"

class DestinationDetail(DestinationBase):
    forecast_12h: List[ForecastEntry]

class RecommendRequest(BaseModel):
    destination_id: str
    group_size: int = Field(default=1, ge=1)
    user_preferences: Optional[Dict[str, Any]] = None

class AlternativeDestination(BaseModel):
    id: str
    name: str
    district: str
    category: str
    carrying_capacity: int
    current_load: int
    occupancy_rate: float
    distance_km: float

class RecommendResponse(BaseModel):
    target_destination_id: str
    target_destination_name: str
    projected_load: int
    carrying_capacity: int
    redirect_triggered: bool
    message: str
    alternative_destinations: List[AlternativeDestination]

class CrowdSimulateRequest(BaseModel):
    destination_id: str
    current_load: Optional[int] = Field(default=None, ge=0)
    action: Optional[str] = None  # "add", "reduce", "set"
    count: Optional[int] = Field(default=None, ge=0)

class CrowdSimulateResponse(BaseModel):
    message: str
    destination: DestinationBase

# Itinerary Data Schemas
class ItineraryCreate(BaseModel):
    traveler_name: str
    travel_date: str
    destinations_list: str

class Itinerary(BaseModel):
    id: str
    traveler_name: str
    travel_date: str
    destinations_list: str
    created_at: str

# --- Initial Seeded Data ---

INITIAL_DESTINATIONS: Dict[str, Dict[str, Any]] = {
    "munnar-tea-gardens": {
        "id": "munnar-tea-gardens",
        "name": "Munnar Tea Gardens & Viewpoint",
        "district": "Idukki",
        "category": "Hill Station",
        "carrying_capacity": 500,
        "current_load": 480,
        "status": "crowded",
        "location": {"latitude": 10.0889, "longitude": 77.0595}
    },
    "wayanad-edakkal-caves": {
        "id": "wayanad-edakkal-caves",
        "name": "Edakkal Caves",
        "district": "Wayanad",
        "category": "Heritage & Nature",
        "carrying_capacity": 300,
        "current_load": 320,
        "status": "overcapacity",
        "location": {"latitude": 11.6258, "longitude": 76.2343}
    },
    "fort-kochi-heritage": {
        "id": "fort-kochi-heritage",
        "name": "Fort Kochi Heritage Zone",
        "district": "Ernakulam",
        "category": "Heritage & Beach",
        "carrying_capacity": 1000,
        "current_load": 650,
        "status": "normal",
        "location": {"latitude": 9.9658, "longitude": 76.2421}
    },
    "alleppey-backwaters": {
        "id": "alleppey-backwaters",
        "name": "Alleppey Backwaters Promenade",
        "district": "Alappuzha",
        "category": "Backwaters",
        "carrying_capacity": 800,
        "current_load": 780,
        "status": "crowded",
        "location": {"latitude": 9.4981, "longitude": 76.3388}
    },
    "kovalam-beach": {
        "id": "kovalam-beach",
        "name": "Kovalam Lighthouse Beach",
        "district": "Thiruvananthapuram",
        "category": "Beach",
        "carrying_capacity": 1200,
        "current_load": 500,
        "status": "normal",
        "location": {"latitude": 8.4004, "longitude": 76.9787}
    },
    "vagamon-meadows": {
        "id": "vagamon-meadows",
        "name": "Vagamon Pine Forest & Meadows",
        "district": "Idukki",
        "category": "Hill Station",
        "carrying_capacity": 600,
        "current_load": 150,
        "status": "normal",
        "location": {"latitude": 9.6872, "longitude": 76.9056}
    },
    "ponmudi-hills": {
        "id": "ponmudi-hills",
        "name": "Ponmudi Hill Peak",
        "district": "Thiruvananthapuram",
        "category": "Hill Station",
        "carrying_capacity": 400,
        "current_load": 120,
        "status": "normal",
        "location": {"latitude": 8.7608, "longitude": 77.1147}
    },
    "marari-beach": {
        "id": "marari-beach",
        "name": "Marari Beach Promenade",
        "district": "Alappuzha",
        "category": "Beach",
        "carrying_capacity": 700,
        "current_load": 200,
        "status": "normal",
        "location": {"latitude": 9.6015, "longitude": 76.2996}
    }
}

# In-memory database stores
destinations_db: Dict[str, Dict[str, Any]] = copy.deepcopy(INITIAL_DESTINATIONS)
itineraries_db: List[Dict[str, Any]] = []

def reset_db():
    """Reset in-memory database to initial seeded state (useful for tests)."""
    global destinations_db, itineraries_db
    destinations_db = copy.deepcopy(INITIAL_DESTINATIONS)
    itineraries_db = []

def compute_status(current_load: int, capacity: int) -> str:
    if current_load > capacity:
        return "overcapacity"
    elif current_load >= 0.8 * capacity:
        return "crowded"
    else:
        return "normal"

def generate_12h_forecast(dest: Dict[str, Any]) -> List[ForecastEntry]:
    forecasts = []
    base_load = dest["current_load"]
    capacity = dest["carrying_capacity"]
    now = datetime.now()

    hourly_factors = [1.02, 1.05, 1.10, 1.15, 1.18, 1.12, 1.04, 0.95, 0.88, 0.80, 0.75, 0.70]
    weather_cycle = ["Sunny", "Partly Cloudy", "Partly Cloudy", "Light Rain", "Cloudy", "Sunny"]

    for i in range(12):
        factor = hourly_factors[i]
        predicted = int(base_load * factor)
        ratio = round(predicted / capacity, 2)

        if ratio > 1.0:
            risk = "critical"
        elif ratio >= 0.8:
            risk = "high"
        elif ratio >= 0.6:
            risk = "moderate"
        else:
            risk = "low"

        timestamp = (now + timedelta(hours=i+1)).strftime("%Y-%m-%dT%H:00:00Z")
        weather = weather_cycle[i % len(weather_cycle)]

        forecasts.append(ForecastEntry(
            hour_offset=i + 1,
            timestamp=timestamp,
            predicted_load=predicted,
            capacity_ratio=ratio,
            weather=weather,
            risk_level=risk
        ))

    return forecasts

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {
        "title": "Smart Kerala Tourism Crowd Management API",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/api/destinations", response_model=List[DestinationBase])
def get_destinations():
    """Lists all seeded destination points in Kerala."""
    results = []
    for d in destinations_db.values():
        d["status"] = compute_status(d["current_load"], d["carrying_capacity"])
        results.append(DestinationBase(**d))
    return results

@app.get("/api/destinations/{id}", response_model=DestinationDetail)
def get_destination_by_id(id: str):
    """Returns details and 12-hour crowd forecast for a specific destination."""
    if id not in destinations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with id '{id}' not found."
        )

    d = destinations_db[id]
    d["status"] = compute_status(d["current_load"], d["carrying_capacity"])
    forecast = generate_12h_forecast(d)

    return DestinationDetail(
        **d,
        forecast_12h=forecast
    )

@app.post("/api/recommend", response_model=RecommendResponse)
def get_recommendation(payload: RecommendRequest):
    """
    Evaluates requested destination capacity. If group size + current load exceeds limit,
    triggers redirection alternatives to nearby lower-density spots.
    """
    dest_id = payload.destination_id
    if dest_id not in destinations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with id '{dest_id}' not found."
        )

    target = destinations_db[dest_id]
    projected_load = target["current_load"] + payload.group_size
    capacity = target["carrying_capacity"]

    if projected_load > capacity:
        redirect_triggered = True
        message = (
            f"ALERT: Target destination '{target['name']}' projected load ({projected_load}) "
            f"exceeds carrying capacity limit ({capacity}). Alternative low-density spots recommended."
        )

        alternatives = []
        for alt_id, alt in destinations_db.items():
            if alt_id == dest_id:
                continue

            alt_occupancy = alt["current_load"] / alt["carrying_capacity"]
            if alt_occupancy < 0.8:
                dist = 25.0 if alt["district"] == target["district"] else 65.0
                alternatives.append(AlternativeDestination(
                    id=alt["id"],
                    name=alt["name"],
                    district=alt["district"],
                    category=alt["category"],
                    carrying_capacity=alt["carrying_capacity"],
                    current_load=alt["current_load"],
                    occupancy_rate=round(alt_occupancy, 2),
                    distance_km=dist
                ))

        alternatives.sort(key=lambda x: x.occupancy_rate)

    else:
        redirect_triggered = False
        message = (
            f"Target destination '{target['name']}' has sufficient capacity "
            f"({projected_load}/{capacity}). Visit confirmed."
        )
        alternatives = []

    return RecommendResponse(
        target_destination_id=target["id"],
        target_destination_name=target["name"],
        projected_load=projected_load,
        carrying_capacity=capacity,
        redirect_triggered=redirect_triggered,
        message=message,
        alternative_destinations=alternatives
    )

@app.post("/api/simulate/crowd", response_model=CrowdSimulateResponse)
def simulate_crowd(payload: CrowdSimulateRequest):
    """
    Alters destination load state for live crowd simulation, sensors, and stress testing.
    """
    dest_id = payload.destination_id
    if dest_id not in destinations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with id '{dest_id}' not found."
        )

    target = destinations_db[dest_id]

    if payload.current_load is not None:
        target["current_load"] = payload.current_load
    elif payload.action and payload.count is not None:
        if payload.action == "add":
            target["current_load"] += payload.count
        elif payload.action == "reduce":
            target["current_load"] = max(0, target["current_load"] - payload.count)
        elif payload.action == "set":
            target["current_load"] = payload.count
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid action '{payload.action}'. Allowed actions: 'add', 'reduce', 'set'."
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must provide either 'current_load' or 'action' with 'count'."
        )

    target["status"] = compute_status(target["current_load"], target["carrying_capacity"])

    return CrowdSimulateResponse(
        message=f"Destination '{target['name']}' load state updated to {target['current_load']} (Status: {target['status']}).",
        destination=DestinationBase(**target)
    )

# --- Itinerary Persistence Endpoints ---

@app.post("/api/itineraries", response_model=Itinerary, status_code=status.HTTP_200_OK)
def create_itinerary(payload: ItineraryCreate):
    """Saves a traveler's itinerary to database storage."""
    new_itinerary = {
        "id": f"itin-{uuid.uuid4().hex[:8]}",
        "traveler_name": payload.traveler_name,
        "travel_date": payload.travel_date,
        "destinations_list": payload.destinations_list,
        "created_at": datetime.now().isoformat()
    }
    itineraries_db.append(new_itinerary)
    return Itinerary(**new_itinerary)

@app.get("/api/itineraries", response_model=List[Itinerary])
def get_itineraries():
    """Retrieves all saved traveler itineraries."""
    return [Itinerary(**itin) for itin in itineraries_db]
