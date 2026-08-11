# SIH Project: Team Responsibilities & Work Division

This document outlines the detailed work division, module ownership, dependencies, and deliverables for each of the 6 team members.

---

## Responsibility Matrix

| Member | Role | Primary Modules | Key Deliverables | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **Juwel** | **Team Lead** & Integration Specialist | `backend/main.py`, `backend/router.py` | API Gateway orchestration, final integration logic, Git merge coordination, API specs. | All backend, frontend, and ML modules. |
| **Sourav** | UI/UX & Frontend Developer | `frontend/` (all subdirectories) | Interactive web interface, Leaflet.js GIS visualizer, real-time redirection popups, animations, responsive design. | Backend routers & API structures. |
| **Anna** | AI/ML & Optimization Engineer | `ml/optimizer.py`, `ml/forecaster.py` | Multi-objective redirection algorithm, capacity forecaster, user-preference matching model. | Data preprocessing schemas & SQLite DB. |
| **Deon** | Backend & Database Developer | `backend/database.py`, `backend/schemas.py` | SQLite schema setup, SQLAlchemy models, database connection pool, API CRUD routers for itineraries. | Data models & schemas from Ashwin. |
| **Ashwin** | Data Engineer & GIS Specialist | `data/` (all raw & schemas), `demo/seed_data.py` | Kerala destinations dataset (Alleppey, Munnar, etc.), crowd & weather simulation feeds, preprocessors. | None (Initial phase builder). |
| **Nandana** | QA Engineer & Presentation Lead | `tests/`, `docs/PRESENTATION_PLAN.md`, `docs/TESTING.md` | Automated pytest scripts, demo flow verification, presentation pitch structure, API verification documents. | All other modules (for writing tests). |

---

## Tasks & Dependency Graph

### 1. Independent Tasks (Can Start Immediately)
- **Ashwin**: Gather/synthetic generate raw Kerala destinations dataset (lat/lon, carrying capacity, eco-sensitivity index, typical peak hours).
- **Deon**: Set up SQLite schema definitions and local ORM.
- **Sourav**: Build initial frontend HTML layout and draft glassmorphic CSS theme with map container.
- **Anna**: Draft core multi-objective logic mathematical formula in python scripts.

### 2. Dependent Tasks (Sequential Development)
- **Anna** requires Ashwin's dataset structure to feed carrying capacities into the ML optimizer.
- **Deon** requires Ashwin's database seed script to test SQLAlchemy models.
- **Juwel** requires Deon's schemas and Anna's optimizer to construct endpoints in FastAPI router.
- **Sourav** requires Juwel's backend API endpoints to hook interactive GIS maps and forms.
- **Nandana** requires Juwel's endpoints and Anna's optimizer to write automated test scripts.

### 3. Integration & Merge Workflow
- Juwel will act as the Git moderator, reviewing PRs from each member's feature branch and ensuring that code compiles without errors before merging into the `main` branch.
