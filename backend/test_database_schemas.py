import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database import Base, engine, SessionLocal, DestinationDb, ItineraryDb
from backend.schemas import (
    Destination,
    DestinationCreate,
    Itinerary,
    ItineraryCreate,
    RecommendationRequest,
    AlternativeRecommendation,
    RecommendationResponse,
)


def run_tests():
    print("--- 1. Testing Database Table Creation ---")
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully!")

    print("\n--- 2. Testing Database CRUD Operations ---")
    db = SessionLocal()
    try:
        # Create a sample destination
        sample_dest = DestinationDb(
            name="Munnar Tea Gardens",
            category="hill_station",
            lat=10.0889,
            lon=77.0595,
            carrying_capacity=5000,
            current_crowd=4200,
            eco_sensitivity=0.85,
            infrastructure_score=0.78,
            local_economic_weight=0.90,
            weather_index=0.92,
            description="Lush green tea plantations and mist-covered hills in Idukki.",
            image_url="munnar_tea_gardens.jpg"
        )
        db.add(sample_dest)
        db.commit()
        db.refresh(sample_dest)

        print(f"Inserted Destination ID: {sample_dest.id}, Name: {sample_dest.name}")
        assert sample_dest.id is not None
        assert sample_dest.name == "Munnar Tea Gardens"

        # Query destination
        fetched = db.query(DestinationDb).filter(DestinationDb.id == sample_dest.id).first()
        assert fetched is not None
        assert fetched.category == "hill_station"
        print(f"Queried Destination successfully: {fetched.name}")

    finally:
        db.close()

    print("\n--- 3. Testing Pydantic Schema Validation ---")
    pydantic_dest = Destination.model_validate(sample_dest)
    print(f"Pydantic Destination model validated: ID={pydantic_dest.id}, Name='{pydantic_dest.name}'")
    assert pydantic_dest.id == sample_dest.id

    # Test RecommendationRequest
    req = RecommendationRequest(
        preferences=["hill_station", "waterfalls"],
        target_destination_id=sample_dest.id,
        lat=9.9312,
        lon=76.2673
    )
    print(f"RecommendationRequest created: preferences={req.preferences}")
    assert len(req.preferences) == 2

    # Test AlternativeRecommendation & RecommendationResponse
    alt_rec = AlternativeRecommendation(
        destination=pydantic_dest,
        score=0.88,
        distance_km=125.4,
        incentive_text="20% discount on Kolukkumalai Jeep Safari",
        redirection_reason="High crowd level at main site; Kolukkumalai offers less congestion."
    )

    rec_resp = RecommendationResponse(
        is_congested=True,
        congestion_ratio=0.84,
        alert_message="Overcrowded",
        recommendations=[alt_rec]
    )

    print(f"RecommendationResponse validated: recommendations count={len(rec_resp.recommendations)}")
    assert len(rec_resp.recommendations) == 1

    print("\n--- ALL SCHEMAS AND DATABASE TESTS PASSED! ---")


if __name__ == "__main__":
    run_tests()
