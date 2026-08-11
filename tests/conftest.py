import pytest
from fastapi.testclient import TestClient
from app.main import app, reset_db

@pytest.fixture(autouse=True)
def run_around_tests():
    """Reset the backend in-memory DB before and after each test."""
    reset_db()
    yield
    reset_db()

@pytest.fixture
def client():
    """Pytest fixture providing FastAPI TestClient."""
    return TestClient(app)
