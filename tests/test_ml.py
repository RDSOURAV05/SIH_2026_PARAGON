import pytest
from ml.optimizer import haversine_distance, calculate_redirection_score, get_incentive, find_alternatives
from ml.forecaster import predict_crowd_levels
from backend.database import DestinationDb

def test_haversine_distance():
    # Distance between Munnar and Marayoor is approximately 40 km
    dist = haversine_distance(10.0889, 77.0595, 10.2736, 77.1472)
    assert 30.0 < dist < 50.0

def test_incentives():
    mock_dest = DestinationDb(
        id=1, name="Test Destination", category="hill_station",
        lat=10.0, lon=77.0, carrying_capacity=100, current_crowd=20,
        eco_sensitivity=0.2, local_economic_weight=0.9, weather_index=0.95
    )
    incentive = get_incentive(mock_dest)
    assert "20% discount" in incentive

def test_find_alternatives():
    target = DestinationDb(
        id=1, name="Overcrowded Spot", category="hill_station",
        lat=10.0889, lon=77.0595, carrying_capacity=100, current_crowd=120,
        eco_sensitivity=0.8, local_economic_weight=0.5, weather_index=0.9
    )
    candidate1 = DestinationDb(
        id=2, name="Quiet Spot", category="hill_station",
        lat=10.1500, lon=77.1000, carrying_capacity=150, current_crowd=30,
        eco_sensitivity=0.3, local_economic_weight=0.85, weather_index=0.95
    )
    alts = find_alternatives(target, [target, candidate1], max_radius_km=100.0)
    assert len(alts) == 1
    assert alts[0]["destination"].name == "Quiet Spot"
    assert alts[0]["score"] > 0.0

def test_crowd_forecaster():
    predictions = predict_crowd_levels(base_capacity=100, current_crowd=50, weather_index=0.9, hours_ahead=24)
    assert len(predictions) == 24
    assert "hour" in predictions[0]
    assert "status" in predictions[0]
