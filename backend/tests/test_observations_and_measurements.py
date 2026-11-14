"""
AEROKRYPT - Research Observations & Scientific Measurements Storage Test Suite
Verifies:
1. Storing structured field observations, geological notes, and instrument readings.
2. Saving environmental measurements without fabricating or auto-filling values.
3. Attaching photographs and supporting file metadata.
4. Preserving verified academic DOI literature citations.
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database import setup_database_connection, init_db

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_test_environment():
    setup_database_connection(force_sqlite=True)
    init_db()


def test_structured_data_entry_and_measurements():
    # Login as Dr. Pascal Lee
    login_res = client.post("/api/v1/auth/login", json={
        "email": "dr.pascal.lee@seti.org",
        "password": "AeroKrypt2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "title": "Field In-Situ Raman Spectroscopy of Anorthosite Mineralogy",
        "abstract": "Field spectroscopy campaign examining Namakkal anorthosite plagioclase suite as a lunar highland analogue.",
        "category": "ANALOGUE_MINERALOGY",
        "target_body": "Moon",
        "location_id": "namakkal-anorthosite",
        "experiment_name": "Lunar Plagioclase Raman Calibration",
        "methodology": "Field 532 nm and 785 nm dual-wavelength Raman spectroscopy under ambient daylight conditions.",
        # Structured field observations
        "field_observations": [
            {
                "observation_id": "OBS-01",
                "station": "Sittampundi Complex Quarry Face",
                "latitude": 11.2189,
                "longitude": 78.1674,
                "notes": "Coarse-grained megacrystic anorthosite with visible cumulate plagioclase laths."
            }
        ],
        # Structured environmental measurements (with authentic units and sensor tiers)
        "environmental_measurements": [
            {
                "parameter_name": "Ambient Air Temperature",
                "measured_value": 32.4,
                "unit": "degC",
                "sensor_type": "Calibrated Thermistor Array",
                "data_tier": "MEASURED"
            },
            {
                "parameter_name": "Solar UV-B Irradiance",
                "measured_value": 4.8,
                "unit": "W/m2",
                "sensor_type": "Solar Radiometer",
                "data_tier": "MEASURED"
            }
        ],
        # Structured geological observations
        "geological_observations": [
            {
                "lithology": "Ferroan Anorthosite Suite",
                "plagioclase_content_pct": 92.5,
                "grain_size_mm": 4.5,
                "metamorphic_overprint": "Amphibolite facies re-equilibration"
            }
        ],
        # Structured instrument readings
        "instrument_readings": [
            {
                "instrument_name": "BWTek i-Raman Plus",
                "laser_wavelength_nm": 785.0,
                "peak_1_cm_inv": 507.0,
                "peak_2_cm_inv": 480.0,
                "interpretation": "Characteristic anorthite doublet representing four-membered tetrahedral ring vibration."
            }
        ],
        # Photographs and supporting files
        "attachments": [
            {
                "file_name": "quarry_face_plagioclase_megacrysts.jpg",
                "file_url": "https://aerokrypt.org/files/namakkal_01.jpg",
                "caption": "Polished slab of Namakkal anorthosite showing 3-5 cm calcic plagioclase crystals.",
                "file_type": "IMAGE_JPEG"
            }
        ],
        # References and DOI
        "references": [
            {
                "doi": "10.1007/s12040-019-1224-8",
                "title": "Anorthosites of Sittampundi Complex, Tamil Nadu: A lunar highland analogue",
                "authors": "Anbazhagan, S., et al.",
                "journal": "Journal of Earth System Science",
                "year": 2019,
                "citation_status": "VERIFIED_DOI"
            }
        ],
        "status": "DRAFT"
    }

    res = client.post("/api/v1/research/projects", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()

    assert len(data["field_observations"]) == 1
    assert data["field_observations"][0]["observation_id"] == "OBS-01"

    assert len(data["environmental_measurements"]) == 2
    assert data["environmental_measurements"][0]["measured_value"] == 32.4

    assert len(data["geological_observations"]) == 1
    assert data["geological_observations"][0]["plagioclase_content_pct"] == 92.5

    assert len(data["instrument_readings"]) == 1
    assert data["instrument_readings"][0]["peak_1_cm_inv"] == 507.0

    assert len(data["attachments"]) == 1
    assert data["attachments"][0]["file_name"] == "quarry_face_plagioclase_megacrysts.jpg"

    assert len(data["references"]) == 1
    assert data["references"][0]["doi"] == "10.1007/s12040-019-1224-8"
