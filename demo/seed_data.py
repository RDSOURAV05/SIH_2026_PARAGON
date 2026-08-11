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
            name="Munnar Tea Gardens", category="hill_station",
            lat=10.0889, lon=77.0595, carrying_capacity=1200, current_crowd=720,
            eco_sensitivity=0.8, infrastructure_score=0.9, local_economic_weight=0.5, weather_index=0.95,
            description="Lush green tea estates, misty mountain valleys, and Eravikulam National Park.", image_url="munnar"
        ),
        DestinationDb(
            name="Wayanad Spice Hills", category="hill_station",
            lat=11.6854, lon=76.1320, carrying_capacity=900, current_crowd=540,
            eco_sensitivity=0.7, infrastructure_score=0.8, local_economic_weight=0.7, weather_index=0.9,
            description="Mystic caves, waterfalls, cardamom spice plantations, and scenic Chembra Peak.", image_url="wayanad"
        ),
        DestinationDb(
            name="Thekkady Wildlife Sanctuary", category="wildlife",
            lat=9.6031, lon=77.1614, carrying_capacity=1000, current_crowd=620,
            eco_sensitivity=0.9, infrastructure_score=0.85, local_economic_weight=0.8, weather_index=0.9,
            description="Periyar Lake wildlife sanctuary safaris, elephant preserves, and boating routes.", image_url="thekkady"
        ),
        DestinationDb(
            name="Vagamon Pine Meadows", category="hill_station",
            lat=9.6874, lon=76.9048, carrying_capacity=800, current_crowd=290,
            eco_sensitivity=0.6, infrastructure_score=0.7, local_economic_weight=0.8, weather_index=0.95,
            description="Vibrant green rolling meadows, quiet pine forests, and refreshing cool breezes.", image_url="vagamon"
        ),
        DestinationDb(
            name="Ponmudi Winding Valleys", category="hill_station",
            lat=8.7602, lon=77.1167, carrying_capacity=600, current_crowd=140,
            eco_sensitivity=0.7, infrastructure_score=0.6, local_economic_weight=0.85, weather_index=0.9,
            description="Mist-covered hill valleys featuring 22 scenic hairpin curves and trekking trails.", image_url="ponmudi"
        ),
        DestinationDb(
            name="Idukki Arch Dam", category="nature",
            lat=9.8493, lon=76.9749, carrying_capacity=800, current_crowd=310,
            eco_sensitivity=0.75, infrastructure_score=0.8, local_economic_weight=0.7, weather_index=0.9,
            description="Massive double-curvature arch dam built between Kuravan and Kurathi hills.", image_url="idukki"
        ),
        DestinationDb(
            name="Nelliampathy Orchards", category="hill_station",
            lat=10.5332, lon=76.6938, carrying_capacity=600, current_crowd=180,
            eco_sensitivity=0.65, infrastructure_score=0.6, local_economic_weight=0.8, weather_index=0.95,
            description="Dense orange orchards, organic biofarms, and dramatic mountain viewpoints.", image_url="nelliampathy"
        ),
        DestinationDb(
            name="Silent Valley National Park", category="wildlife",
            lat=11.1306, lon=76.4287, carrying_capacity=500, current_crowd=110,
            eco_sensitivity=1.0, infrastructure_score=0.4, local_economic_weight=0.6, weather_index=0.85,
            description="Pristine evergreen tropical rainforest home to rare lion-tailed macaques.", image_url="silent_valley"
        ),
        DestinationDb(
            name="Malampuzha Dam Gardens", category="nature",
            lat=10.8251, lon=76.6823, carrying_capacity=1000, current_crowd=480,
            eco_sensitivity=0.5, infrastructure_score=0.85, local_economic_weight=0.7, weather_index=0.9,
            description="Beautiful rose gardens, rock garden, amusement park, and fresh dam reservoir views.", image_url="malampuzha"
        ),
        DestinationDb(
            name="Alleppey Backwaters", category="backwaters",
            lat=9.4981, lon=76.3388, carrying_capacity=1200, current_crowd=850,
            eco_sensitivity=0.9, infrastructure_score=0.85, local_economic_weight=0.6, weather_index=0.8,
            description="Traditional houseboat cruises sailing along Vembanad Lake and Kuttanad paddy fields.", image_url="alappuzha"
        ),
        DestinationDb(
            name="Kumarakom Lake Resorts", category="backwaters",
            lat=9.5935, lon=76.4262, carrying_capacity=800, current_crowd=280,
            eco_sensitivity=0.85, infrastructure_score=0.75, local_economic_weight=0.75, weather_index=0.85,
            description="Protected wetland ecosystems, bird sanctuary, and serene lakeside resorts.", image_url="kumarakom"
        ),
        DestinationDb(
            name="Kollam Gateway Canals", category="backwaters",
            lat=8.8932, lon=76.6141, carrying_capacity=900, current_crowd=320,
            eco_sensitivity=0.8, infrastructure_score=0.7, local_economic_weight=0.8, weather_index=0.85,
            description="Historic trade port gateway to backwaters and scenic Ashtamudi Lake.", image_url="kollam"
        ),
        DestinationDb(
            name="Munroe Island Villages", category="backwaters",
            lat=8.9912, lon=76.6163, carrying_capacity=600, current_crowd=190,
            eco_sensitivity=0.75, infrastructure_score=0.6, local_economic_weight=0.8, weather_index=0.9,
            description="Scenic networks of small village canals and organic coir-weaving communities.", image_url="munroe_island"
        ),
        DestinationDb(
            name="Kavvayi Backwaters", category="backwaters",
            lat=12.0722, lon=75.1843, carrying_capacity=500, current_crowd=120,
            eco_sensitivity=0.7, infrastructure_score=0.5, local_economic_weight=0.8, weather_index=0.9,
            description="Tranquil, uncrowded backwaters of North Kerala spread across small delta islands.", image_url="kavvayi"
        ),
        DestinationDb(
            name="Ashtamudi Lake Shores", category="backwaters",
            lat=8.9482, lon=76.5823, carrying_capacity=700, current_crowd=210,
            eco_sensitivity=0.75, infrastructure_score=0.65, local_economic_weight=0.75, weather_index=0.85,
            description="Eight-branched scenic palm-fringed shores, floating resort rooms, and boating.", image_url="ashtamudi"
        ),
        DestinationDb(
            name="Kovalam Lighthouse Beach", category="beach",
            lat=8.4021, lon=76.9785, carrying_capacity=1500, current_crowd=920,
            eco_sensitivity=0.4, infrastructure_score=0.95, local_economic_weight=0.4, weather_index=1.0,
            description="Famous crescent beach with a prominent red-and-white striped lighthouse.", image_url="kovalam"
        ),
        DestinationDb(
            name="Varkala Cliff Beach", category="beach",
            lat=8.7303, lon=76.7077, carrying_capacity=1200, current_crowd=540,
            eco_sensitivity=0.5, infrastructure_score=0.8, local_economic_weight=0.7, weather_index=0.95,
            description="Unique red sandstone cliffs bordering the sea, natural mineral springs.", image_url="varkala"
        ),
        DestinationDb(
            name="Fort Kochi Heritage", category="beach",
            lat=9.9658, lon=76.2421, carrying_capacity=1500, current_crowd=780,
            eco_sensitivity=0.5, infrastructure_score=0.9, local_economic_weight=0.5, weather_index=0.9,
            description="Historic Portuguese, Dutch and British colonial quarters and Chinese fishing nets.", image_url="fort_kochi"
        ),
        DestinationDb(
            name="Marari Fishing Beach", category="beach",
            lat=9.6015, lon=76.2974, carrying_capacity=800, current_crowd=290,
            eco_sensitivity=0.55, infrastructure_score=0.6, local_economic_weight=0.8, weather_index=0.9,
            description="Golden sands and clean waters bordering a relaxed local fishing community.", image_url="marari"
        ),
        DestinationDb(
            name="Poovar Estuary Banks", category="beach",
            lat=8.3182, lon=77.0754, carrying_capacity=600, current_crowd=180,
            eco_sensitivity=0.75, infrastructure_score=0.6, local_economic_weight=0.8, weather_index=0.9,
            description="Stunning river estuary where a river, lake, and sea meet near golden sand banks.", image_url="poovar"
        ),
        DestinationDb(
            name="Bekal Beach Fort", category="beach",
            lat=12.3892, lon=75.0315, carrying_capacity=1000, current_crowd=420,
            eco_sensitivity=0.5, infrastructure_score=0.8, local_economic_weight=0.75, weather_index=0.9,
            description="Giant keyhole-shaped coastal fort built overlooking the broad sand beach.", image_url="bekal"
        ),
        DestinationDb(
            name="Kannur Theyyam Coast", category="beach",
            lat=11.8745, lon=75.3704, carrying_capacity=800, current_crowd=290,
            eco_sensitivity=0.5, infrastructure_score=0.7, local_economic_weight=0.8, weather_index=0.9,
            description="Northern cultural coast famous for Theyyam ritual performances and quiet beaches.", image_url="kannur"
        ),
        DestinationDb(
            name="Kozhikode Calicut Beach", category="beach",
            lat=11.2588, lon=75.7804, carrying_capacity=1200, current_crowd=680,
            eco_sensitivity=0.5, infrastructure_score=0.8, local_economic_weight=0.8, weather_index=0.9,
            description="Historic spice-trading coast featuring local culinary landmarks and shipping piers.", image_url="kozhikode"
        ),
        DestinationDb(
            name="Kizhunna Secluded Shores", category="beach",
            lat=11.8152, lon=75.4338, carrying_capacity=500, current_crowd=90,
            eco_sensitivity=0.5, infrastructure_score=0.6, local_economic_weight=0.8, weather_index=0.9,
            description="Uncrowded, secluded twin beaches with soft sand, rock cliffs, and gentle surf.", image_url="kizhunna"
        ),
        DestinationDb(
            name="Shanghumugham Beach", category="beach",
            lat=8.4802, lon=76.9131, carrying_capacity=800, current_crowd=340,
            eco_sensitivity=0.5, infrastructure_score=0.8, local_economic_weight=0.6, weather_index=0.9,
            description="Vast sandy beach close to the capital city, featuring the massive Jalakanyaka sculpture.", image_url="shanghumugham"
        ),
        DestinationDb(
            name="Thiruvananthapuram City", category="cultural",
            lat=8.5241, lon=76.9366, carrying_capacity=1500, current_crowd=820,
            eco_sensitivity=0.45, infrastructure_score=0.95, local_economic_weight=0.5, weather_index=0.9,
            description="Capital heritage city featuring Padmanabhaswamy Temple and Napier Museum.", image_url="trivandrum"
        ),
        DestinationDb(
            name="Thrissur Cultural Center", category="cultural",
            lat=10.5276, lon=76.2144, carrying_capacity=1500, current_crowd=710,
            eco_sensitivity=0.45, infrastructure_score=0.9, local_economic_weight=0.7, weather_index=0.9,
            description="Cultural capital of Kerala, home to traditional arts, festivals, and temples.", image_url="thrissur"
        ),
        DestinationDb(
            name="Guruvayur Temple Town", category="cultural",
            lat=10.5946, lon=76.0381, carrying_capacity=2000, current_crowd=1150,
            eco_sensitivity=0.4, infrastructure_score=0.9, local_economic_weight=0.9, weather_index=0.9,
            description="Renowned spiritual pilgrimage temple dedicated to Lord Guruvayurappan.", image_url="guruvayur"
        ),
        DestinationDb(
            name="Padmanabhapuram Palace", category="cultural",
            lat=8.2504, lon=77.3274, carrying_capacity=700, current_crowd=220,
            eco_sensitivity=0.4, infrastructure_score=0.8, local_economic_weight=0.8, weather_index=0.9,
            description="Historic 16th-century wooden palace showcasing exquisite craftsmanship.", image_url="padmanabhapuram"
        ),
        DestinationDb(
            name="Jatayu Earth Center", category="cultural",
            lat=8.8874, lon=76.8674, carrying_capacity=1200, current_crowd=540,
            eco_sensitivity=0.5, infrastructure_score=0.85, local_economic_weight=0.85, weather_index=0.9,
            description="World's largest bird sculpture, mythology park, adventure cable cars, and views.", image_url="jatayu"
        )
    ]

    db.add_all(destinations)
    db.commit()
    db.close()
    print(f"Database successfully seeded with {len(destinations)} Kerala destinations!")

if __name__ == "__main__":
    seed_database()
