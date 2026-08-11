import math
from typing import List, Dict, Any, Tuple
from backend.database import DestinationDb

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on Earth in kilometers.
    """
    R = 6371.0  # Earth's radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def calculate_redirection_score(
    candidate: DestinationDb,
    target: DestinationDb,
    distance: float,
    max_radius_km: float = 100.0
) -> Tuple[float, str]:
    """
    Calculate a multi-objective score for redirecting from an overcrowded target to a candidate.
    Returns: (score, reasoning_string)
    """
    # 1. Preferences & Category matching:
    # If they belong to the same category, it's a great match.
    category_match = 1.0 if candidate.category == target.category else 0.5
    
    # 2. Crowd Load Factor (0.0 to 1.0, higher is better/less crowded)
    crowd_ratio = candidate.current_crowd / max(1, candidate.carrying_capacity)
    # Penalize heavily if the alternative is also near or over capacity
    if crowd_ratio >= 0.9:
        crowd_score = 0.0
    else:
        crowd_score = 1.0 - crowd_ratio

    # 3. Ecological Sensitivity Factor (0.0 to 1.0, higher is better/less sensitive)
    # We want to avoid pushing crowds to highly sensitive areas (eco_sensitivity near 1.0)
    eco_score = 1.0 - candidate.eco_sensitivity

    # 4. Weather & Safety Index (0.0 to 1.0, higher is better)
    weather_score = candidate.weather_index

    # 5. Local Economic Empowerment (0.0 to 1.0, higher is better)
    # We want to reward destinations that support local artisans/homestays
    econ_score = candidate.local_economic_weight

    # 6. Distance Penalty (0.0 to 1.0, higher is better/closer)
    distance_score = max(0.0, 1.0 - (distance / max_radius_km))

    # Weighted Scoring Formula:
    # 25% Category Match, 25% Crowd Relief, 15% Eco-Safety, 15% Local Economy, 10% Weather, 10% Proximity
    score = (
        0.25 * category_match +
        0.25 * crowd_score +
        0.15 * eco_score +
        0.15 * econ_score +
        0.10 * weather_score +
        0.10 * distance_score
    )

    # Generate reasoning text
    reasons = []
    if crowd_score > 0.7:
        reasons.append("uncongested conditions")
    if candidate.local_economic_weight >= 0.75:
        reasons.append("supports local artisans/homestays")
    if candidate.eco_sensitivity < 0.5:
        reasons.append("high structural carrying infrastructure")
    if weather_score >= 0.95:
        reasons.append("excellent local weather")
        
    reasoning_string = f"Offers a similar {candidate.category.replace('_', ' ')} experience with " + ", ".join(reasons) + "."

    return round(score, 3), reasoning_string

def get_incentive(candidate: DestinationDb) -> str:
    """
    Provide dynamic incentives/rewards based on destination properties.
    """
    if candidate.local_economic_weight >= 0.8:
        return "Get a 20% discount on local handloom and craft workshops."
    elif candidate.category == "hill_station":
        return "Free guided nature trek with a local community guide."
    elif candidate.category == "backwaters":
        return "Complimentary traditional Kerala lunch at local homestay."
    else:
        return "Get 15% off national park / monument entry ticket."

def find_alternatives(
    target: DestinationDb,
    all_destinations: List[DestinationDb],
    max_radius_km: float = 120.0
) -> List[Dict[str, Any]]:
    """
    Find and rank alternative destinations for redirection.
    """
    candidates = []
    
    for dest in all_destinations:
        # Don't recommend the target itself
        if dest.id == target.id:
            continue
            
        # Calculate distance
        dist = haversine_distance(target.lat, target.lon, dest.lat, dest.lon)
        
        # Filter: only look within the maximum search radius
        if dist > max_radius_km:
            continue
            
        # Don't recommend options that are already overcrowded
        if dest.current_crowd >= dest.carrying_capacity:
            continue
            
        score, reason = calculate_redirection_score(dest, target, dist, max_radius_km)
        incentive = get_incentive(dest)
        
        candidates.append({
            "destination": dest,
            "score": score,
            "distance_km": round(dist, 1),
            "incentive_text": incentive,
            "redirection_reason": reason
        })
        
    # Sort candidates by optimization score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates[:3] # Return top 3 alternatives
