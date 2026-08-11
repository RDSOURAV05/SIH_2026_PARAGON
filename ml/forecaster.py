import datetime
from typing import List, Dict, Any

def predict_crowd_levels(
    base_capacity: int,
    current_crowd: int,
    weather_index: float,
    hours_ahead: int = 24
) -> List[Dict[str, Any]]:
    """
    Generate synthetic crowd level projections for the upcoming hours.
    This simulates a time-series regression based on diurnal cycles,
    weekend multiplier, and current weather constraints.
    """
    predictions = []
    now = datetime.datetime.now()
    
    # Peak hourly offsets (bell-curve centered around 14:00/2 PM)
    # Peak hours: 10:00 to 17:00
    for i in range(hours_ahead):
        target_time = now + datetime.timedelta(hours=i)
        hour = target_time.hour
        day_of_week = target_time.weekday() # 5 = Saturday, 6 = Sunday
        
        # Diurnal factor: peak during the day, low at night
        if 8 <= hour <= 18:
            # Simple parabolic curve peaking at 14:00 (value 1.0) and dropping to 0.4 at 8:00 and 18:00
            diurnal_factor = 1.0 - 0.6 * ((hour - 14) / 6) ** 2
        else:
            diurnal_factor = 0.15 # Sleep hours
            
        # Weekend multiplier: 30% busier on weekends
        weekend_multiplier = 1.3 if day_of_week >= 5 else 1.0
        
        # Weather impact: bad weather drops tourist arrivals
        weather_multiplier = max(0.2, weather_index)
        
        # Calculate predicted crowd
        # Random noise component (+-5%)
        import random
        # Seed by forecast step to keep simulation consistent per run
        random.seed(hour + day_of_week)
        noise = random.uniform(0.95, 1.05)
        
        predicted_ratio = diurnal_factor * weekend_multiplier * weather_multiplier * noise
        predicted_count = int(base_capacity * predicted_ratio)
        
        # Clip minimum crowd to a small base count
        predicted_count = max(int(base_capacity * 0.05), predicted_count)
        
        predictions.append({
            "hour": target_time.strftime("%H:00"),
            "timestamp": target_time.isoformat(),
            "predicted_crowd": predicted_count,
            "capacity_ratio": round(predicted_count / base_capacity, 2),
            "status": "Congested" if predicted_count >= base_capacity else (
                "Moderate" if predicted_count >= base_capacity * 0.7 else "Normal"
            )
        })
        
    return predictions
