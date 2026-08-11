# System Testing & Verification Report

This document records the testing plan, cases, and automated validation results for the Sustainable Tourism Platform.

---

## 1. Automated Unit & Integration Tests

The test suite is built using `pytest` and `fastapi.testclient`. It verifies database operations, API response contracts, optimization math, and simulated state changes.

### File: [`test_backend.py`](file:///C:/Users/Asus/.gemini/antigravity/scratch/sih_kerala_tourism/tests/test_backend.py)

### Running the Tests:
To run the automated tests, execute:
```bash
pytest tests/
```

### Test Coverage Results:
- `test_get_destinations`: Verifies listing API filters and fields. (PASSED)
- `test_get_destination_detail`: Verifies details retrieval and 12-hour crowd forecasting generation. (PASSED)
- `test_recommendation_congested`: Simulates routing requests for overcrowded spots (Munnar at 115% load), verifying that a redirection sequence triggers and ranks nearby alternatives (Marayoor) with appropriate incentives. (PASSED)
- `test_recommendation_not_congested`: Verifies that a normal spot request does not trigger redundant redirection recommendations. (PASSED)
- `test_simulation_crowd`: Simulates POST updates changing crowd bounds, verifying that the recommendation engine adapts state instantly. (PASSED)

---

## 2. Manual Verification Guidelines

To verify the user experience, follow these manual steps:

1. **Start the backend server:**
   ```bash
   uvicorn backend.main:app --reload
   ```
2. **Access the Web Dashboard:** Open `http://127.0.0.1:8000` in your web browser.
3. **Verify Map Render:** Ensure the Leaflet map is rendered in dark mode with colored pins indicating Munnar (Red, crowded) and Marayoor (Green, empty).
4. **Choose Destination:**
   - In the dropdown, choose **Munnar Tea Gardens**. Click **Calculate Routing & Load**.
   - **Verification**: The redirection panel must display a prominent warning banner explaining Munnar is congested. It must show **Marayoor Sandalwood Forests** as the top alternative (95% match) with a 20% craft discount incentive. A dotted line will appear on the map connecting the two points.
5. **Simulate Relief:**
   - Under the **SIH Live Simulation Panel**, click the button: **Clear Munnar**.
   - **Verification**: Munnar's marker turns green instantly. In the dropdown, Munnar's indicator changes to "(Normal)". Selecting Munnar and clicking "Calculate" no longer triggers a redirection popup, proving dynamic balancing works in real-time.
