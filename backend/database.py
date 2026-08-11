import os
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kerala_tourism.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# SQLAlchemy Model for Destination
class DestinationDb(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    carrying_capacity = Column(Integer)
    current_crowd = Column(Integer)
    eco_sensitivity = Column(Float)
    infrastructure_score = Column(Float)
    local_economic_weight = Column(Float)
    weather_index = Column(Float, default=1.0)
    description = Column(String)
    image_url = Column(String, nullable=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
