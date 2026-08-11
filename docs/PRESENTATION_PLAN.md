# SIH Presentation & PPT Plan

This document outlines a structured, 16-slide sequence designed to highlight the technical implementation, novelty, and societal impact of the Kerala Sustainable Tourism Management Platform.

---

## Slide Sequence & Content Outlines

### Slide 1: Title Slide
- **Title**: GreenTour Kerala: AI-Powered Sustainable Tourism Management & Intelligent Tourist Distribution Platform
- **Sub-caption**: Transitioning Kerala's tourism from static recommendations to dynamic capacity-aware redistribution.
- **Team Info**: Juwel (Lead), Sourav, Anna, Deon, Ashwin, Nandana.

### Slide 2: The Problem (The SIH Challenge)
- **Visual**: Map overlay showing concentrated crowd hotspots (Munnar, Alleppey, Kovalam) suffering environmental degradation and gridlocks.
- **Key Points**:
  - Overcrowding at popular hubs degrades visitor experience and local ecosystems.
  - High carrying capacity breaches.
  - Undervaluing of lesser-known destinations, leading to uneven local economic distribution.

### Slide 3: The Existing Gap
- **Key Points**:
  - Legacy platforms (Google Travel, TripAdvisor) recommend sites statically based on stars or past search volumes.
  - No connection to live carrying capacities, local weather indices, or environmental sensitivity.

### Slide 4: Proposed Solution
- **Visual**: High-level block diagram showing inputs (crowd count, weather feeds, ESI constraints) converging into the AI Engine.
- **Key Points**: An automated redistribution system matching user preferences while prioritizing ecosystem carrying limits.

### Slide 5: System Architecture
- **Visual**: Simplified UML deployment diagram (FastAPI + SQLite + Leaflet.js).
- **Points**:
  - Light, robust footprint.
  - Zero third-party cloud API keys needed for baseline operation (uses OSM maps).
  - Native JSON endpoints for rapid sync.

### Slide 6: Multi-Objective Redistribution Scoring (MORS)
- **Math**: Display the weighted sum equation:
  \[S_d = w_1 \cdot \text{Pref}(d, u) + w_2 \cdot (1 - \text{Crowd}(d)) + w_3 \cdot (1 - \text{ESI}(d)) + w_4 \cdot \text{Weather}(d) + w_5 \cdot \text{EcoBenefit}(d)\]
- **Explanation**: Breaking down weights (e.g. 25% crowd mitigation, 15% local homestays weight).

### Slide 7: Live GIS Mapping & Interactivity
- **Visual**: Highlight the dark theme map with colored markers.
- **Points**: Color-coded markers (Green = Underloaded, Red = Congested). Dynamic dashed reroute lines displaying paths to close alternatives.

### Slide 8: Real-Time Dynamic Incentives
- **Points**: Reward-based redistribution. Instead of forcing redirection, we offer local cooperative discounts (e.g. "Free nature trek in Marayoor", "20% off local handicraft workshops").

### Slide 9: Crowd Forecasting
- **Visual**: Screenshot of the 12-hour hourly load forecasting chart.
- **Points**: Diurnal demand calculations helping tourists plan travel before peaks occur.

### Slide 10: Technical Feasibility & Scalability
- **Points**:
  - Light SQLite memory footprint during prototype stage.
  - Scale path: Migrating SQLite to PostgreSQL and hosting API container on AWS/Azure.
  - Integration path: Integrating mobile GPS location streams to automate crowd estimates.

### Slide 11: Societal and Environmental Impact
- **Points**:
  - Spreading economic benefits directly to local home-stays, artisans, and tour guides.
  - Limiting carrying capacity breaches in eco-fragile coastal zones and mountain forests.

### Slide 12: Team Contribution Matrix
- Present the table from `TEAM_RESPONSIBILITIES.md` demonstrating that all six members contributed essential code modules.
