"""
AEROKRYPT - Site Evaluation Engine & Neural Inference Test Suite
Verifies:
1. POST /api/v1/evaluations/site-assessment:
   - Strict separation of geological fidelity from operational suitability.
   - Identification of missing critical parameters.
   - Identification of physical divergences (Gravity, Atmosphere, Diurnal Delta, Radiation).
   - Zero fabricated arbitrary percentage scores.
   - Database persistence of evaluation records.
2. POST /api/v1/evaluations/predict-hazards:
   - PyTorch neural network inference.
   - Accurate hazard score scaling with terrain difficulty.
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database import setup_database_connection, init_db, SessionLocal
import app.database as app_db
from app.models.spatial_models import SiteEvaluationModel

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_test_environment():
    # Setup explicit shared SQLite test DB
    setup_database_connection(force_sqlite=True)
    init_db()


def test_site_assessment_mars_separation_and_divergence():
    """
    Verifies Mars site assessment:
    - Dual-domain separation
    - Physical divergences (gravity 0.38G, CO2 0.6 kPa)
    - Missing critical parameters exposed
    - Disclaimer against arbitrary scores
    """
    payload = {
        "location_id": "atacama-yungay",
        "target_body": "Mars",
        "planetary_terrain_id": "mars-gale-crater-aeolis",
        "experiment_id": "EXP-MARS-SPECTROSCOPY",
        "evaluator_name": "Dr. Pascal Lee"
    }
    res = client.post("/api/v1/evaluations/site-assessment", json=payload)
    assert res.status_code == 200
    data = res.json()

    # 1. Dual Domain Separation
    assert "geological_fidelity" in data
    assert "operational_suitability" in data
    assert data["geological_fidelity"]["domain"] == "GEOLOGY & LITHOLOGY"
    assert data["operational_suitability"]["domain"] == "OPERATIONAL FEASIBILITY & CONOPS"

    # 2. Lithology alignment
    geo = data["geological_fidelity"]
    assert geo["target_body"] == "Mars"
    assert geo["lithology_alignment"] in ["HIGH", "MODERATE"]

    # 3. Missing Critical Parameters
    missing = data["missing_critical_parameters"]
    assert isinstance(missing, list)
    assert len(missing) >= 2
    assert any("soil mechanics" in m.lower() or "shear modulus" in m.lower() for m in missing)

    # 4. Planetary Physical Divergences
    divergences = data["divergence_summary"]
    param_names = [d["parameter"] for d in divergences]
    assert "Surface Gravity" in param_names
    assert "Atmospheric Pressure & Composition" in param_names
    assert "Thermal Diurnal Envelope" in param_names
    assert "Galactic Cosmic Radiation & Solar Protons" in param_names

    # Verify Mars values
    grav_div = next(d for d in divergences if d["parameter"] == "Surface Gravity")
    assert "0.38 G" in grav_div["planetary_value"]

    # 5. Scientific Policy Disclaimer
    assert "disclaimer" in data
    assert "No arbitrary composite suitability percentages are synthesized" in data["disclaimer"]

    # 6. Database persistence
    db = app_db.SessionLocal()
    try:
        evals = db.query(SiteEvaluationModel).filter_by(location_id="atacama-yungay").all()
        assert len(evals) >= 1
        saved_eval = evals[-1]
        assert saved_eval.target_body == "Mars"
        assert saved_eval.evaluator_name == "Dr. Pascal Lee"
    finally:
        db.close()


def test_site_assessment_moon_divergence():
    """
    Verifies Moon site assessment:
    - Moon-specific physical divergences (0.166 G, Hard Vacuum)
    - Regolith / Anorthosite alignment logic
    """
    payload = {
        "location_id": "namakkal-anorthosite",
        "target_body": "Moon",
        "planetary_terrain_id": "moon-marius-hills-skylight",
        "experiment_id": "EXP-LUNAR-ROVER-TRACTION",
        "evaluator_name": "ISRO Lunar Analogue Group"
    }
    res = client.post("/api/v1/evaluations/site-assessment", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["geological_fidelity"]["target_body"] == "Moon"
    assert data["geological_fidelity"]["lithology_alignment"] == "HIGH"
    assert "Anorthositic" in data["geological_fidelity"]["primary_analogue_rationale"]

    # Check Lunar physical values in divergences
    divergences = data["divergence_summary"]
    grav_div = next(d for d in divergences if d["parameter"] == "Surface Gravity")
    assert "0.166 G" in grav_div["planetary_value"]

    press_div = next(d for d in divergences if d["parameter"] == "Atmospheric Pressure & Composition")
    assert "Vacuum" in press_div["planetary_value"]


def test_ml_predict_operational_hazards():
    """
    Verifies PyTorch neural network inference on terrain parameters.
    """
    # 1. Gentle nominal terrain
    gentle_features = {
        "slope_deg": 3.5,
        "roughness_index": 0.12,
        "boulder_density_pct": 2.0,
        "bearing_strength_kpa": 120.0,
        "temperature_c": 15.0
    }
    res_gentle = client.post("/api/v1/evaluations/predict-hazards", json=gentle_features)
    assert res_gentle.status_code == 200
    gentle_pred = res_gentle.json()

    assert "mobility_hazard_score" in gentle_pred
    assert "subsurface_access_feasibility" in gentle_pred
    assert "environmental_stress_factor" in gentle_pred
    assert "PYTORCH" in gentle_pred.get("engine", "")

    # 2. Extreme steep hazardous terrain
    steep_features = {
        "slope_deg": 32.0,
        "roughness_index": 0.85,
        "boulder_density_pct": 45.0,
        "bearing_strength_kpa": 15.0,
        "temperature_c": -45.0
    }
    res_steep = client.post("/api/v1/evaluations/predict-hazards", json=steep_features)
    assert res_steep.status_code == 200
    steep_pred = res_steep.json()

    # Hazard score on steep rugged terrain must be substantially higher than gentle
    assert steep_pred["mobility_hazard_score"] > gentle_pred["mobility_hazard_score"]
    assert steep_pred["environmental_stress_factor"] > gentle_pred["environmental_stress_factor"]
