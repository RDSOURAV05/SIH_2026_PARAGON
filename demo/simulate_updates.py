import time
import random
import sys
import os

# Append parent directory so we can simulate direct DB modifications or API requests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# We can simulate updates by hitting the localhost API endpoints
import requests

API_URL = "http://127.0.0.1:8000/api/simulate"

# List of target destination IDs to dynamically adjust in simulation loop
destinations = [
    {"id": 1, "name": "Munnar Tea Gardens", "base_cap": 1000},
    {"id": 4, "name": "Alleppey Backwater Houseboats", "base_cap": 800},
    {"id": 6, "name": "Kovalam Lighthouse Beach", "base_cap": 1500}
]

def run_simulation():
    print("====================================================")
    # Highlight simulation activation
    print("Starting Live IoT Crowd & Weather Sensor Feeds Simulator...")
    print("Press Ctrl+C to stop simulation.")
    print("====================================================")
    
    while True:
        for dest in destinations:
            # Simulate crowd fluctuations (50% to 130% of carrying capacity)
            simulated_crowd = int(dest["base_cap"] * random.uniform(0.5, 1.3))
            
            # Simulate weather index fluctuations (0.2: storm warning, 1.0: sunny/clear)
            simulated_weather = round(random.choice([0.2, 0.4, 0.75, 0.95, 1.0]), 2)
            
            try:
                # 1. Update crowd level
                crowd_res = requests.post(f"{API_URL}/crowd?dest_id={dest['id']}&crowd={simulated_crowd}")
                
                # 2. Update weather index
                weather_res = requests.post(f"{API_URL}/weather?dest_id={dest['id']}&index={simulated_weather}")
                
                if crowd_res.status_code == 200 and weather_res.status_code == 200:
                    status_text = "NORMAL"
                    if simulated_crowd >= dest["base_cap"]:
                        status_text = "⚠️ OVERLOADED"
                    elif simulated_weather <= 0.3:
                        status_text = "❌ WEATHER ALERT"
                        
                    print(f"[Sensor Feed] {dest['name']}: Crowd = {simulated_crowd}/{dest['base_cap']} | Weather = {simulated_weather} | Status = {status_text}")
            except requests.exceptions.ConnectionError:
                print(f"[Error] Cannot connect to FastAPI server. Please ensure 'uvicorn backend.main:app' is running.")
                break
            except Exception as e:
                print(f"[Error] Update failed: {e}")
                
        print("----------------------------------------------------")
        time.sleep(10) # Run sensor update intervals every 10 seconds

if __name__ == "__main__":
    run_simulation()
