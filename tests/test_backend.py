import pytest

def test_get_destinations_lists_all_seeded_points(client):
    """Verifies GET /api/destinations lists all seeded points with correct schema."""
    response = client.get("/api/destinations")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 8

    destination_ids = [dest["id"] for dest in data]
    expected_ids = [
        "munnar-tea-gardens",
        "wayanad-edakkal-caves",
        "fort-kochi-heritage",
        "alleppey-backwaters",
        "kovalam-beach",
        "vagamon-meadows",
        "ponmudi-hills",
        "marari-beach"
    ]
    for expected_id in expected_ids:
        assert expected_id in destination_ids

    sample = data[0]
    required_keys = {"id", "name", "district", "category", "carrying_capacity", "current_load", "status", "location"}
    assert required_keys.issubset(sample.keys())
    assert "latitude" in sample["location"]
    assert "longitude" in sample["location"]


def test_get_destination_by_id_returns_12h_forecast(client):
    """Verifies GET /api/destinations/{id} returns detailed info and 12-hour forecasts."""
    dest_id = "munnar-tea-gardens"
    response = client.get(f"/api/destinations/{dest_id}")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == dest_id
    assert data["name"] == "Munnar Tea Gardens & Viewpoint"
    assert "forecast_12h" in data

    forecast = data["forecast_12h"]
    assert len(forecast) == 12

    for idx, entry in enumerate(forecast):
        assert entry["hour_offset"] == idx + 1
        assert "timestamp" in entry
        assert isinstance(entry["predicted_load"], int)
        assert isinstance(entry["capacity_ratio"], float)
        assert entry["weather"] in ["Sunny", "Partly Cloudy", "Light Rain", "Cloudy"]
        assert entry["risk_level"] in ["low", "moderate", "high", "critical"]

    invalid_response = client.get("/api/destinations/invalid-id-xyz")
    assert invalid_response.status_code == 404
    assert "not found" in invalid_response.json()["detail"].lower()


def test_post_recommend_triggers_redirection_alternatives(client):
    """
    Verifies POST /api/recommend triggers redirection alternatives
    when requested group + current load exceeds target carrying capacity limit.
    """
    payload = {
        "destination_id": "munnar-tea-gardens",
        "group_size": 50
    }
    response = client.post("/api/recommend", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["target_destination_id"] == "munnar-tea-gardens"
    assert data["projected_load"] == 530
    assert data["carrying_capacity"] == 500
    assert data["redirect_triggered"] is True

    alternatives = data["alternative_destinations"]
    assert len(alternatives) > 0

    for alt in alternatives:
        assert alt["id"] != "munnar-tea-gardens"
        assert alt["occupancy_rate"] < 0.8

    normal_payload = {
        "destination_id": "kovalam-beach",
        "group_size": 10
    }
    normal_response = client.post("/api/recommend", json=normal_payload)
    assert normal_response.status_code == 200

    normal_data = normal_response.json()
    assert normal_data["redirect_triggered"] is False
    assert len(normal_data["alternative_destinations"]) == 0


def test_post_simulate_crowd_alters_destination_load_state(client):
    """Verifies POST /api/simulate/crowd alters destination crowd state and recalculates status."""
    dest_id = "fort-kochi-heritage"

    sim_payload = {
        "destination_id": dest_id,
        "current_load": 1200
    }
    sim_response = client.post("/api/simulate/crowd", json=sim_payload)
    assert sim_response.status_code == 200

    sim_data = sim_response.json()
    assert sim_data["destination"]["current_load"] == 1200
    assert sim_data["destination"]["status"] == "overcapacity"

    action_payload = {
        "destination_id": dest_id,
        "action": "reduce",
        "count": 700
    }
    action_response = client.post("/api/simulate/crowd", json=action_payload)
    assert action_response.status_code == 200

    action_data = action_response.json()
    assert action_data["destination"]["current_load"] == 500
    assert action_data["destination"]["status"] == "normal"


def test_save_and_get_itinerary(client):
    """Verifies POST /api/itineraries saves traveler itinerary and GET /api/itineraries retrieves it."""
    # 1. Create a dummy itinerary
    payload = {
        "traveler_name": "Juwel",
        "travel_date": "2026-12-25",
        "destinations_list": "Munnar Tea Gardens, Marayoor Sandalwood Forests"
    }
    # 2. Save it via POST API
    response = client.post("/api/itineraries", json=payload)
    assert response.status_code == 200
    save_data = response.json()
    assert save_data["traveler_name"] == "Juwel"
    assert "id" in save_data

    # 3. Retrieve all saved itineraries via GET API
    response2 = client.get("/api/itineraries")
    assert response2.status_code == 200
    list_data = response2.json()
    assert len(list_data) > 0
    assert list_data[0]["traveler_name"] == "Juwel"
