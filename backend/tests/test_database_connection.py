"""
AEROKRYPT - Database Connection & Configuration Tests
Tests:
1. PostgreSQL connection failure reporting (no silent fallback).
2. Explicit SQLite configuration for testing/development.
3. Telemetry reporting on /health endpoint.
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.dialects import postgresql, sqlite

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.config import settings
from app.database import setup_database_connection, engine, SessionLocal, Base, init_db

client = TestClient(app)


def test_postgresql_connection_failure_reported_clearly():
    """
    CRITICAL POLICY TEST:
    When PostgreSQL is configured and cannot be reached on port 5432,
    the system must NOT silently fall back to SQLite.
    It must report POSTGRESQL_CONNECTION_FAILED and record the exact error.
    """
    unreachable_pg_url = "postgresql+psycopg2://aerokrypt_user:bad_pass@localhost:5432/aerokrypt"

    # Attempt connection to unreachable PostgreSQL without forcing SQLite
    res_engine = setup_database_connection(target_url=unreachable_pg_url, force_sqlite=False)

    assert res_engine is None
    assert settings.DB_CONNECTION_STATUS == "POSTGRESQL_CONNECTION_FAILED"
    assert settings.IS_LOCAL_DB_LIVE is False
    assert settings.DB_ERROR is not None
    assert "failed" in settings.DB_ERROR.lower()

    # Telemetry endpoint must reflect the disconnected status
    health_res = client.get("/health")
    assert health_res.status_code == 200
    data = health_res.json()
    assert data["status"] == "DATABASE_DISCONNECTED"
    assert data["database_connected"] is False
    assert data["database_status"] == "POSTGRESQL_CONNECTION_FAILED"
    assert data["database_error"] is not None


def test_sqlite_explicit_configuration_succeeds():
    """
    Verifies that SQLite initializes ONLY when explicitly configured
    for development or automated testing.
    """
    test_sqlite_url = "sqlite:///./test_explicit.db"
    res_engine = setup_database_connection(target_url=test_sqlite_url, force_sqlite=True)

    assert res_engine is not None
    assert settings.DB_CONNECTION_STATUS == "CONNECTED_SQLITE_EXPLICIT"
    assert settings.IS_LOCAL_DB_LIVE is True
    assert settings.DB_ERROR is None
    assert settings.DB_DIALECT == "sqlite"

    # Verify health telemetry in explicit SQLite mode
    health_res = client.get("/health")
    assert health_res.status_code == 200
    data = health_res.json()
    assert data["status"] == "NOMINAL"
    assert data["database_connected"] is True
    assert data["database_status"] == "CONNECTED_SQLITE_EXPLICIT"
    assert data["database_dialect"] == "sqlite"

    # Clean up test file
    if os.path.exists("./test_explicit.db"):
        try:
            os.remove("./test_explicit.db")
        except Exception:
            pass


def test_init_db_creates_tables_and_seeds():
    """
    Verifies that init_db creates all schema tables and seeds default records
    when an active engine is available.
    """
    # Configure SQLite for test
    setup_database_connection(target_url="sqlite:///:memory:", force_sqlite=True)
    success = init_db()
    assert success is True

    from app.models.spatial_models import AnalogueLocationModel, PlanetaryReferenceTerrainModel
    from app.models.research_models import ResearcherModel

    from app import database as app_db
    db = app_db.SessionLocal()
    try:
        # Check researchers seeded
        researchers = db.query(ResearcherModel).all()
        assert len(researchers) >= 4
        emails = [r.email for r in researchers]
        assert "dr.pascal.lee@seti.org" in emails
        assert "reviewer.osinski@aerokrypt.org" in emails

        # Check analogue locations seeded
        locations = db.query(AnalogueLocationModel).all()
        assert len(locations) >= 20
        loc_ids = [l.id for l in locations]
        assert "atacama-yungay" in loc_ids
        assert "haughton-crater" in loc_ids

        # Check planetary reference terrains seeded
        terrains = db.query(PlanetaryReferenceTerrainModel).all()
        assert len(terrains) >= 3
        terrain_ids = [t.id for t in terrains]
        assert "mars-jezero-delta" in terrain_ids
        assert "moon-marius-hills-skylight" in terrain_ids
    finally:
        db.close()
