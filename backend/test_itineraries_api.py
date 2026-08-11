import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_itinerary_endpoints():
    print("--- Testing POST /api/itineraries ---")
    payload = {
        "traveler_name": "Deon",
        "travel_date": "2026-09-15",
        "destinations_list": "Munnar Tea Gardens, Alappuzha Backwaters, Fort Kochi"
    }
    response = client.post("/api/itineraries", json=payload)
    print("POST /api/itineraries Response Status:", response.status_code)
    print("POST Response JSON:", response.json())
    assert response.status_code == 201 or response.status_code == 200
    data = response.json()
    assert data["traveler_name"] == "Deon"
    assert "id" in data
    assert "created_at" in data

    print("\n--- Testing GET /api/itineraries ---")
    get_resp = client.get("/api/itineraries")
    print("GET /api/itineraries Response Status:", get_resp.status_code)
    print("GET Response JSON:", get_resp.json())
    assert get_resp.status_code == 200
    itineraries = get_resp.json()
    assert len(itineraries) >= 1
    assert itineraries[0]["traveler_name"] == "Deon"

    print("\n--- ALL API ENDPOINT TESTS PASSED! ---")


if __name__ == "__main__":
    test_itinerary_endpoints()
