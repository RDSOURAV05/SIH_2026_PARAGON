from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db, DestinationDb
from backend.schemas import Destination, RecommendationRequest, RecommendationResponse, AlternativeRecommendation
from ml.optimizer import find_alternatives
from ml.forecaster import predict_crowd_levels

router = APIRouter(prefix="/api")

@router.get("/destinations", response_model=List[Destination])
def get_destinations(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all destinations with optional category filter.
    """
    query = db.query(DestinationDb)
    if category:
        query = query.filter(DestinationDb.category == category)
    return query.all()

@router.get("/destinations/{dest_id}")
def get_destination_detail(dest_id: int, db: Session = Depends(get_db)):
    """
    Get details of a specific destination, including a 12-hour crowd forecast.
    """
    dest = db.query(DestinationDb).filter(DestinationDb.id == dest_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
        
    # Generate 12-hour crowd predictions
    forecasts = predict_crowd_levels(
        base_capacity=dest.carrying_capacity,
        current_crowd=dest.current_crowd,
        weather_index=dest.weather_index,
        hours_ahead=12
    )
    
    return {
        "destination": dest,
        "forecasts": forecasts
    }

@router.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest, db: Session = Depends(get_db)):
    """
    Generate personalized recommendations and handle redirections if target is crowded.
    """
    all_dests = db.query(DestinationDb).all()
    
    # Case 1: User requested a specific target destination
    if req.target_destination_id:
        target = db.query(DestinationDb).filter(DestinationDb.id == req.target_destination_id).first()
        if not target:
            raise HTTPException(status_code=404, detail="Target destination not found")
            
        ratio = target.current_crowd / max(1, target.carrying_capacity)
        is_congested = ratio >= 1.0 or target.weather_index <= 0.3
        
        alert_message = None
        alternatives = []
        
        if is_congested:
            if target.weather_index <= 0.3:
                alert_message = f"Warning: {target.name} has severe weather warnings. Travel is unsafe."
            else:
                alert_message = f"Notice: {target.name} is currently overcrowded (Capacity: {target.carrying_capacity}, Tourists: {target.current_crowd})."
            
            # Find alternatives within 120km
            alts_data = find_alternatives(target, all_dests)
            for alt in alts_data:
                alternatives.append(AlternativeRecommendation(
                    destination=alt["destination"],
                    score=alt["score"],
                    distance_km=alt["distance_km"],
                    incentive_text=alt["incentive_text"],
                    redirection_reason=alt["redirection_reason"]
                ))
                
        return RecommendationResponse(
            is_congested=is_congested,
            congestion_ratio=round(ratio, 2),
            alert_message=alert_message,
            recommendations=alternatives
        )
        
    # Case 2: User requested general recommendations based on preferences
    # Return top destinations matching preferences that are not crowded
    matching = []
    for d in all_dests:
        if d.category in req.preferences and d.current_crowd < d.carrying_capacity and d.weather_index > 0.3:
            matching.append(d)
            
    # Sort matching by safety, economics, capacity margin
    matching.sort(key=lambda x: (1.0 - (x.current_crowd / x.carrying_capacity)) + x.local_economic_weight, reverse=True)
    
    recs = []
    # If no target, we present general matching recommendations
    for d in matching[:3]:
        recs.append(AlternativeRecommendation(
            destination=d,
            score=1.0,
            distance_km=0.0,
            incentive_text="Standard travel itinerary route.",
            redirection_reason=f"Recommended based on your interest in {d.category.replace('_', ' ')}."
        ))
        
    return RecommendationResponse(
        is_congested=False,
        congestion_ratio=0.0,
        alert_message=None,
        recommendations=recs
    )

@router.post("/simulate/crowd")
def simulate_crowd(dest_id: int, crowd: int, db: Session = Depends(get_db)):
    """
    Simulate crowd changes at a destination to showcase live redirection updates.
    """
    dest = db.query(DestinationDb).filter(DestinationDb.id == dest_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
        
    dest.current_crowd = crowd
    db.commit()
    db.refresh(dest)
    
    return {"message": f"Successfully updated crowd level for {dest.name} to {dest.current_crowd}."}

@router.post("/simulate/weather")
def simulate_weather(dest_id: int, index: float, db: Session = Depends(get_db)):
    """
    Simulate weather changes at a destination (0.0 to 1.0).
    """
    if not (0.0 <= index <= 1.0):
        raise HTTPException(status_code=400, detail="Weather index must be between 0.0 and 1.0")
        
    dest = db.query(DestinationDb).filter(DestinationDb.id == dest_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
        
    dest.weather_index = index
    db.commit()
    db.refresh(dest)
    
    return {"message": f"Successfully updated weather index for {dest.name} to {dest.weather_index}."}
