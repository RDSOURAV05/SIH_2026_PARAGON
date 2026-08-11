# AI-Powered Sustainable Tourism & Intelligent Tourist Distribution Platform for Kerala

An interactive, AI-driven capacity-aware tourist distribution system designed for the Smart India Hackathon (SIH). It manages tourist congestion in real-time by redirecting travelers from overcrowded attractions to nearby underutilized spots using multi-objective optimization and dynamic local incentives.

---

## 1. Core Problem
Kerala's tourism is heavily concentrated in a few popular spots (e.g., Munnar, Alleppey, Kovalam), causing:
- Environmental stress on fragile ecosystems.
- Severe traffic and infrastructure bottlenecks.
- Reduced visitor satisfaction.
- Unequal economic growth, leaving local artisans and homestays in lesser-known areas under-benefited.

## 2. Proposed Solution
This system replaces static search recommendations with a **Dynamic Traffic Controller for Tourism**. It:
1. Simulates/Monitors destination load ratios and ecological stress.
2. Identifies overcrowding and weather alerts in real-time.
3. Automatically recommends nearby underloaded alternatives using multi-objective scoring.
4. Distributes local economic benefit to rural communities through redirection incentives.

---

## 3. Technology Stack & Architecture
- **Backend**: Python 3.8+ with **FastAPI** for API endpoints and static file hosting.
- **Database**: **SQLite** (file-based relational engine).
- **Frontend**: Vanilla HTML5, premium glassmorphism CSS, and Javascript.
- **GIS Mapping**: **Leaflet.js** using CartoDB Dark Matter tiles (no API keys required).
- **Core Libraries**: SQLAlchemy, Pydantic, Pandas, NumPy.

---

## 4. AI & Optimization Approach
When a target spot is congested, the system calculates a multi-objective recommendation score for alternatives:

\[S_d = w_1 \cdot \text{Pref}(d, u) + w_2 \cdot (1 - \text{Crowd}(d)) + w_3 \cdot (1 - \text{ESI}(d)) + w_4 \cdot \text{Weather}(d) + w_5 \cdot \text{EcoBenefit}(d)\]

It weights matching preferences, crowd relief, eco-sensitivity, weather safety, and local economic benefit to yield the top alternatives.

---

## 5. Directory Structure
```text
sih_kerala_tourism/
├── backend/            # FastAPI startup, routers, schemas, and database configuration
├── frontend/           # Glassmorphism HTML layout, style sheets, and map scripts
├── ml/                 # Optimization formula and crowd forecaster engine
├── data/               # Workflows and raw destination structures
├── tests/              # Pytest automated test scripts
└── docs/               # Technical specs, novelty sheets, git and team files
```

---

## 6. Installation & Running Instructions

### Prerequisite: Python 3.8+
Clone the repository, enter the directory, and set up:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Setup database seed data
python demo/seed_data.py

# 3. Start the FastAPI server
uvicorn backend.main:app --reload
```

Open your browser and navigate to: **`http://127.0.0.1:8000`**

### Running Tests
Ensure all unit and integration tests compile:
```bash
pytest tests/
```

---

## 7. SIH Demonstration Flow
1. **Initial View**: Notice Munnar is marked in **Red** (115% load limit reached).
2. **Select Destination**: In the dropdown, select **Munnar Tea Gardens** and click **Calculate Routing & Load**.
3. **Redirection Trigger**: The dashboard immediately flashes a congestion alert and displays **Marayoor Sandalwood Forests** as the top alternative with a custom reward: *"Get a 20% discount on local handloom and craft workshops."*
4. **GIS Mapping**: The Leaflet map zooms to Munnar, showing a dashed green redirection path connecting Munnar to Marayoor.
5. **Live Simulation**: In the control panel, click **Clear Munnar**. The Munnar icon turns green. Selecting and planning routes for Munnar now shows normal capacity with no warnings.

---

## 8. Team Work Division & Branch Strategy
The project was developed in parallel across branches (`feature/member-module`):
- **Juwel (Team Lead)**: Main orchestration and integration.
- **Sourav**: Frontend design and Leaflet.js rendering.
- **Anna**: ML optimization and forecaster engine.
- **Deon**: Database setup and SQLAlchemy schemas.
- **Ashwin**: Data collection and seed feeds.
- **Nandana**: QA/Testing script and presentation plan.
