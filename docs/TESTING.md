# Smart Kerala Tourism - QA & Verification Guide

This document provides complete instructions for running automated unit and integration tests, along with manual verification workflows for hackathon judges and evaluators.

---

## 1. Automated Unit & Integration Tests Overview

The backend verification suite is located in `tests/test_backend.py`. It uses `pytest` and FastAPI `TestClient` to validate API contracts, crowd redirection algorithms, dynamic status calculation, load simulation, and database persistence.

### Test Coverage Checklist

| Test Function | Target Endpoint(s) | Description & Key Assertions |
| :--- | :--- | :--- |
| `test_get_destinations_lists_all_seeded_points` | `GET /api/destinations` | Verifies all 8+ seeded Kerala tourist destinations are listed with schema attributes (`id`, `carrying_capacity`, `current_load`, `status`, `location`). |
| `test_get_destination_by_id_returns_12h_forecast` | `GET /api/destinations/{id}` | Verifies single destination detail retrieval, 12-hour hourly crowd forecast generation (12 objects, risk levels, weather), and HTTP 404 handling. |
| `test_post_recommend_triggers_redirection_alternatives` | `POST /api/recommend` | Verifies capacity evaluation logic: when `group_size + current_load > carrying_capacity`, `redirect_triggered` becomes `True` and lists lower-density alternative destinations. Also verifies normal flow when within capacity. |
| `test_post_simulate_crowd_alters_destination_load_state` | `POST /api/simulate/crowd` | Verifies in-memory crowd state mutation (setting exact load, adding/reducing headcount), status recalculation ("normal" vs "overcapacity"), and state persistence. |
| `test_save_and_get_itinerary` | `POST /api/itineraries`<br>`GET /api/itineraries` | **[Database Persistence Verified]**: Verifies saving a traveler itinerary via POST API and retrieving saved itineraries via GET API, ensuring persistent storage integrity. |

---

## 2. Prerequisites & Environment Setup

Ensure Python 3.10+ is installed on your system.

### Install Dependencies

From the project root directory (`sih_kerala_tourism` / `sih_2026`), run:

```bash
pip install pytest fastapi httpx uvicorn
```

---

## 3. Running Automated Tests

Run the full pytest suite from project root:

```bash
pytest tests/
```

Or for verbose execution:

```bash
pytest -v tests/test_backend.py
```

### Expected Output

```text
============================= test session starts =============================
platform win32 -- Python 3.13.x, pytest-9.x.x
rootdir: C:\Users\...\sih_2026
collected 5 items

tests/test_backend.py::test_get_destinations_lists_all_seeded_points PASSED [ 20%]
tests/test_backend.py::test_get_destination_by_id_returns_12h_forecast PASSED [ 40%]
tests/test_backend.py::test_post_recommend_triggers_redirection_alternatives PASSED [ 60%]
tests/test_backend.py::test_post_simulate_crowd_alters_destination_load_state PASSED [ 80%]
tests/test_backend.py::test_save_and_get_itinerary PASSED                   [100%]

============================== 5 passed in 0.12s ==============================
```

---

## 4. Manual Verification Steps for Judges

For live evaluation and interactive testing:

### Step 1: Start the Backend Server

Launch the FastAPI application locally:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

### Step 2: Open Swagger Interactive Documentation

Navigate to `http://localhost:8000/docs` in your browser. All API endpoints can be executed directly from this UI.

---

### Step 3: Manual Verification Scenarios

#### Scenario A: List All Tourist Destinations
- **Endpoint**: `GET /api/destinations`
- **cURL Command**:
  ```bash
  curl -X GET "http://localhost:8000/api/destinations"
  ```
- **Expected Result**: HTTP 200 containing JSON array of Kerala tourist spots.

#### Scenario B: Check 12-Hour Crowd Forecast for Munnar
- **Endpoint**: `GET /api/destinations/munnar-tea-gardens`
- **cURL Command**:
  ```bash
  curl -X GET "http://localhost:8000/api/destinations/munnar-tea-gardens"
  ```
- **Expected Result**: HTTP 200 response with destination parameters and a 12-element `forecast_12h` array.

#### Scenario C: Test Smart Redirection Engine (Overcapacity Trigger)
- **Endpoint**: `POST /api/recommend`
- **Request Body**:
  ```json
  {
    "destination_id": "munnar-tea-gardens",
    "group_size": 50
  }
  ```
- **cURL Command**:
  ```bash
  curl -X POST "http://localhost:8000/api/recommend" \
       -H "Content-Type: application/json" \
       -d "{\"destination_id\": \"munnar-tea-gardens\", \"group_size\": 50}"
  ```
- **Expected Result**: `redirect_triggered` will be `true`, returning alternative low-density spots.

#### Scenario D: Live Crowd Simulation & State Mutation
- **Endpoint**: `POST /api/simulate/crowd`
- **Request Body**:
  ```json
  {
    "destination_id": "fort-kochi-heritage",
    "current_load": 1500
  }
  ```
- **cURL Command**:
  ```bash
  curl -X POST "http://localhost:8000/api/simulate/crowd" \
       -H "Content-Type: application/json" \
       -d "{\"destination_id\": \"fort-kochi-heritage\", \"current_load\": 1500}"
  ```
- **Expected Result**: Fort Kochi state updates to `overcapacity` (load 1500 vs capacity 1000).

#### Scenario E: Saved Itinerary Database Persistence
- **Endpoints**: `POST /api/itineraries` and `GET /api/itineraries`
- **Create Itinerary cURL Command**:
  ```bash
  curl -X POST "http://localhost:8000/api/itineraries" \
       -H "Content-Type: application/json" \
       -d "{\"traveler_name\": \"Juwel\", \"travel_date\": \"2026-12-25\", \"destinations_list\": \"Munnar Tea Gardens, Marayoor Sandalwood Forests\"}"
  ```
- **Retrieve Itineraries cURL Command**:
  ```bash
  curl -X GET "http://localhost:8000/api/itineraries"
  ```
- **Expected Result**: Saved itinerary object returned with auto-generated ID, verifiable via GET request.
