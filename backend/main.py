import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.database import Base, engine, SessionLocal
from backend.router import router as api_router
from demo.seed_data import seed_database

app = FastAPI(
    title="Kerala Sustainable Tourism Platform",
    description="AI-Powered Sustainable Tourism Management and Intelligent Tourist Distribution Platform for Kerala",
    version="1.0.0"
)

# CORS middleware for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup if db does not exist or has no entries
@app.on_event("startup")
def startup_event():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Check if we already have data
    db = SessionLocal()
    from backend.database import DestinationDb
    count = db.query(DestinationDb).count()
    db.close()
    
    if count == 0:
        print("Database empty. Seeding destinations data...")
        seed_database()

# Include REST API router
app.include_router(api_router)

# Mount frontend static directory
frontend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

    # Serve index.html at root
    @app.get("/")
    def read_root():
        return FileResponse(os.path.join(frontend_path, "index.html"))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
