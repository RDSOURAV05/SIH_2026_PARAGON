# File & Module Ownership

This document lists the specific file ownership assignments to avoid Git merge conflicts. No team member should edit a file owned by another member without prior coordination.

---

## File Ownership Table

| Directory/File | Owner | Purpose | Dependency | Who Can Edit |
| :--- | :--- | :--- | :--- | :--- |
| `data/raw/*`, `data/schemas/*`, `demo/seed_data.py` | **Ashwin** | Base datasets, schemas and seeding | Python native data | Ashwin, Deon (for db import) |
| `backend/database.py`, `backend/schemas.py` | **Deon** | SQLite database and Pydantic validation schemas | Ashwin's schemas | Deon, Juwel |
| `ml/optimizer.py`, `ml/forecaster.py` | **Anna** | Optimization scoring and crowd predictions | Ashwin's raw datasets | Anna, Juwel |
| `backend/router.py`, `backend/main.py` | **Juwel** | FastAPI core routes, static file serving, gateway coordination | Deon's DB & Anna's ML | Juwel |
| `frontend/index.html`, `frontend/css/*`, `frontend/js/*` | **Sourav** | Frontend interactive dashboard and maps | Juwel's backend APIs | Sourav |
| `tests/*`, `docs/TESTING.md`, `docs/PRESENTATION_PLAN.md` | **Nandana** | Test cases, verification script, PPT plans | Full system integration | Nandana, Juwel |

---

## Integration Guidelines
1. **API Contracts First:** Before Juwel, Sourav, and Deon start coding, they must agree on the Pydantic schemas in `backend/schemas.py`.
2. **ML Interface:** Anna's optimizer functions must accept clean dictionaries/objects and output simple redirect candidates with scores. This decouples API logic from math algorithms.
3. **Frontend decoupling:** Sourav's JS scripts should call endpoints using relative URLs (e.g. `/api/destinations`), allowing backend static serving without CORS issues.
