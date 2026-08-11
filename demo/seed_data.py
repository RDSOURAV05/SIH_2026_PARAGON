import sys
import os

# Append project root to sys.path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import Base, engine, SessionLocal, DestinationDb

def seed_database():
    # Drop and recreate tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    destinations = [
        DestinationDb(
            name="Munnar Tea Gardens",
            category="hill_station",
            lat=10.0889,
            lon=77.0595,
            carrying_capacity=1000,
            current_crowd=1150,  # Overcrowded
            eco_sensitivity=0.8,
            infrastructure_score=0.9,
            local_economic_weight=0.5,
            weather_index=0.95,
            description="Famous for lush green tea estates and scenic valleys. Currently experiencing heavy visitor volumes.",
            image_url="munnar"
        ),
        DestinationDb(
            name="Marayoor Sandalwood Forests",
            category="hill_station",
            lat=10.2694,
            lon=77.1614,
            carrying_capacity=500,
            current_crowd=120,   # Alternative
            eco_sensitivity=0.6,
            infrastructure_score=0.5,
            local_economic_weight=0.9,  # High local benefit
            weather_index=1.0,
            description="Lesser-known sandalwood forests and prehistoric dolmens. A pristine, uncrowded escape near Munnar.",
            image_url="marayoor"
        ),
        DestinationDb(
            name="Ramakkalmedu Viewpoint",
            category="hill_station",
            lat=9.7997,
            lon=77.2394,
            carrying_capacity=600,
            current_crowd=150,   # Alternative
            eco_sensitivity=0.5,
            infrastructure_score=0.6,
            local_economic_weight=0.8,  # High local benefit
            weather_index=0.9,
            description="High-altitude windy point with views of the Tamil Nadu plains. Excellent uncrowded viewpoint.",
            image_url="ramakkalmedu"
        ),
        DestinationDb(
            name="Alleppey Backwater Houseboats",
            category="backwaters",
            lat=9.4981,
            lon=76.3388,
            carrying_capacity=800,
            current_crowd=920,   # Overcrowded
            eco_sensitivity=0.9,  # Fragile lake ecosystem
            infrastructure_score=0.85,
            local_economic_weight=0.6,
            weather_index=0.8,   # Slight rain warning
            description="World-renowned houseboats floating along Vembanad Lake. Highly congested during peak hours.",
            image_url="alleppey"
        ),
        DestinationDb(
            name="Kumarakom Bird Sanctuary",
            category="backwaters",
            lat=9.5843,
            lon=76.4239,
            carrying_capacity=400,
            current_crowd=110,   # Alternative
            eco_sensitivity=0.95, # Protected wetland
            infrastructure_score=0.7,
            local_economic_weight=0.75,
            weather_index=0.85,
            description="A tranquil bird sanctuary spread over 14 acres. A beautiful eco-alternative to Alleppey houseboats.",
            image_url="kumarakom"
        ),
        DestinationDb(
            name="Kovalam Lighthouse Beach",
            category="beach",
            lat=8.4020,
            lon=76.9784,
            carrying_capacity=1500,
            current_crowd=1650,  # Overcrowded
            eco_sensitivity=0.4,
            infrastructure_score=0.95,
            local_economic_weight=0.4,
            weather_index=1.0,
            description="Crescent-shaped beach with a prominent red-and-white lighthouse. Very popular and congested.",
            image_url="kovalam"
        ),
        DestinationDb(
            name="Varkala Cliff Beach",
            category="beach",
            lat=8.7302,
            lon=76.7124,
            carrying_capacity=1200,
            current_crowd=700,   # Moderate load
            eco_sensitivity=0.5,
            infrastructure_score=0.8,
            local_economic_weight=0.7,
            weather_index=0.95,
            description="Unique coastal cliffs bordering the Arabian Sea. A quieter, scenic alternative to Kovalam.",
            image_url="varkala"
        ),
        DestinationDb(
            name="Poovar Island Estuary",
            category="beach",
            lat=8.3184,
            lon=77.0754,
            carrying_capacity=500,
            current_crowd=150,   # Alternative
            eco_sensitivity=0.75,
            infrastructure_score=0.6,
            local_economic_weight=0.8,
            weather_index=0.9,
            description="Beautiful island estuary where river, lake, and sea meet. Pristine and highly scenic escape.",
            image_url="poovar"
        ),
        DestinationDb(
            name="Thenmala Eco-Tourism Park",
            category="wildlife",
            lat=9.0305,
            lon=77.0617,
            carrying_capacity=400,
            current_crowd=80,    # Low crowd
            eco_sensitivity=0.7,
            infrastructure_score=0.65,
            local_economic_weight=0.85,
            weather_index=0.9,
            description="India's first planned ecotourism destination, offering canopy walkways, boating, and clean forests.",
            image_url="thenmala"
        ),
        DestinationDb(
            name="Silent Valley National Park",
            category="wildlife",
            lat=11.1300,
            lon=76.4294,
            carrying_capacity=150,
            current_crowd=30,    # Strictly controlled
            eco_sensitivity=1.0,  # Extremely high sensitivity
            infrastructure_score=0.4,
            local_economic_weight=0.6,
            weather_index=0.85,
            description="Home to the endangered lion-tailed macaque. Strictly limited daily passes to protect biodiversity.",
            image_url="silent_valley"
        )
    ]

    db.add_all(destinations)
    db.commit()
    db.close()
    print("Database successfully seeded with 10 Kerala destinations!")

if __name__ == "__main__":
    seed_database()
