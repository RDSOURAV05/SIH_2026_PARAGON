import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from backend.database import Base, engine, SessionLocal, DestinationDb

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    # Make sure we use a clean test database
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Empty existing entries if any
    db.query(DestinationDb).delete()
    
    # Add dummy spots for test cases
    spots = [
        DestinationDb(
            id=1,
            name="Munnar",
            category="hill_station",
            lat=10.0889,
            lon=77.0595,
            carrying_capacity=500,
            current_crowd=550,  # Overcrowded
            eco_sensitivity=0.8,
            infrastructure_score=0.9,
            local_economic_weight=0.5,
            weather_index=1.0,
            description="Crowded hill station"
        ),
        DestinationDb(
            id=2,
            name="Marayoor",
            category="hill_station",
            lat=10.2694,
            lon=77.1614,
            carrying_capacity=500,
            current_crowd=100,  # Empty alternative close by
            eco_sensitivity=0.6,
            infrastructure_score=0.6,
            local_economic_weight=0.8,
            weather_index=1.0,
            description="Quiet hill station alternative"
        )
    ]
    db.add_all(spots)
    db.commit()
    db.close()
    yield
    # Cleanup
    Base.metadata.drop_all(bind=engine)

def test_get_destinations():
    response = client.get("/api/destinations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Munnar"

def test_get_destination_detail():
    response = client.get("/api/destinations/1")
    assert response.status_code == 200
    data = response.json()
    assert "destination" in data
    assert "forecasts" in data
    assert len(data["forecasts"]) == 12

def test_recommendation_congested():
    # Requesting Munnar which has 550/500 crowd
    response = client.post("/api/recommend", json={
        "preferences": ["hill_station"],
        "target_destination_id": 1
    })
    assert response.status_code == 200
    data = response.json()
    assert data["is_congested"] is True
    assert len(data["recommendations"]) > 0
    # The top recommended alternative should be Marayoor
    assert data["recommendations"][0]["destination"]["name"] == "Marayoor"

def test_recommendation_not_congested():
    # Requesting Marayoor which is not congested
    response = client.post("/api/recommend", json={
        "preferences": ["hill_station"],
        "target_destination_id": 2
    })
    assert response.status_code == 200
    data = response.json()
    assert data["is_congested"] is False
    assert len(data["recommendations"]) == 0

def test_simulation_crowd():
    # Decrease Munnar crowd
    response = client.post("/api/simulate/crowd?dest_id=1&crowd=200")
    assert response.status_code == 200
    
    # Check if Munnar is no longer marked congested
    response2 = client.post("/api/recommend", json={
        "preferences": ["hill_station"],
        "target_destination_id": 1
    })
    assert response2.status_code == 200
    assert response2.json()["is_congested"] is False
