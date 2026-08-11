# Data Workflow and Pipeline Documentation

This document explains the data architecture, schema structures, and data transformation pipeline for the Kerala Sustainable Tourism Platform.

---

## 1. The Complete Data Flow

```text
Data Sources (GIS, Admin Feeds, Mocks)
    ↓
Raw Destination Data (JSON / CSV format)   ← [Owner: Ashwin]
    ↓
Validation Layer (Pydantic / schemas.py)   ← [Owner: Deon / Ashwin]
    ↓
Database Persistence (SQLite/SQLAlchemy)   ← [Owner: Deon]
    ↓
Real-Time Inputs (Crowd Levels, Weather)   ← [Owner: Ashwin / Juwel]
    ↓
Optimization Engine (Scoring / Rerouting)  ← [Owner: Anna]
    ↓
Backend Router (FastAPI REST Endpoints)     ← [Owner: Juwel]
    ↓
Frontend Consumer (Leaflet.js + Dashboard)  ← [Owner: Sourav]
    ↓
Interactive Map & Personalized Itinerary   ← [User Facing Output]
```

---

## 2. Data Elements & Definitions

### Raw Destination Fields
Each tourist destination is stored with these parameters:
- `id` (int): Unique identifier.
- `name` (str): Destination title (e.g. "Munnar Tea Gardens").
- `category` (str): Primary focus ("hill_station", "backwaters", "beach", "cultural", "wildlife").
- `lat` (float): Latitude coordinate.
- `lon` (float): Longitude coordinate.
- `carrying_capacity` (int): Maximum safe visitor limit per day.
- `current_crowd` (int): Current estimated count of active visitors.
- `eco_sensitivity` (float): Weight from `0.1` (low sensitivity, e.g. urban fort) to `1.0` (critical wilderness area, e.g. Silent Valley).
- `infrastructure_score` (float): Rating (`0.0` to `1.0`) of local utilities, parking slots, and road access.
- `local_economic_weight` (float): Factor (`0.0` to `1.0`) highlighting potential to benefit local artisans, homestays, and micro-vendors.
- `weather_index` (float): Current local weather suitability score (`0.0` for severe storm/landslide danger to `1.0` for clear skies).

### Sample Raw JSON (Data Ingestion)
```json
{
  "id": 1,
  "name": "Munnar Tea Gardens",
  "category": "hill_station",
  "lat": 10.0889,
  "lon": 77.0595,
  "carrying_capacity": 1500,
  "current_crowd": 1600,
  "eco_sensitivity": 0.8,
  "infrastructure_score": 0.9,
  "local_economic_weight": 0.6,
  "weather_index": 0.95
}
```

---

## 3. Data Processing Pipeline & Ownership

### Stage 1: Data Ingest & Validation (Ashwin & Deon)
- **Action**: Raw data is validated using Pydantic Models in `backend/schemas.py`.
- **Rules**:
  - `lat` must fall within Kerala's geographic bounds: `[8.0, 13.0]`.
  - `lon` must fall within Kerala's geographic bounds: `[74.5, 77.8]`.
  - Scores (weather, eco_sensitivity) must reside strictly between `0.0` and `1.0`.

### Stage 2: Database Storage (Deon)
- **Action**: SQLite reads `seed_data.py` on startup and populates the `destinations` table.
- **Rules**: If a destination's `current_crowd` / `carrying_capacity` ratio > `0.9`, an automatic database congestion flag is flipped to `True`.

### Stage 3: Optimization Processing (Anna)
- **Action**: When a user selects a destination or plans a route, `ml/optimizer.py` is invoked.
- **Process**:
  1. The engine checks if the target spot is overcrowded or weather-stressed.
  2. If congested, it filters destinations within a 50km radius.
  3. It ranks alternative spots using the Multi-Objective formula.
  4. Returns the top 3 alternative recommendations with a recommendation description.

### Stage 4: API Serving (Juwel)
- **Action**: FastAPI router exposes GET endpoints:
  - `/api/destinations` - Returns all destinations, colored by crowd status.
  - `/api/recommend` - Accepts user preferences and target destination, outputs optimized alternative if crowded.

### Stage 5: Front-end Render (Sourav)
- **Action**: Leaflet.js fetches JSON from `/api/destinations` and paints markers:
  - **Red**: Congested (Ratio > 1.0) or Weather Alert.
  - **Orange**: Moderate load (Ratio 0.7 - 1.0).
  - **Green**: Low load (Ratio < 0.7).
- Displays redirection alternatives side-by-side with travel incentive cards (e.g., "15% off Thenmala Ecotourism ticket").
