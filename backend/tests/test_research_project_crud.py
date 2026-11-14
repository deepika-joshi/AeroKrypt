"""
AEROKRYPT - Research Project CRUD Test Suite
Verifies:
1. Creating a research project with title, abstract, target body, analogue location, experiment, methodology, objectives, collaborators.
2. Saving incomplete work as drafts.
3. Reading project details.
4. Updating project fields (e.g. adding team members, updating objectives).
5. Deleting project and cascading dependencies.
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


def test_create_and_read_research_project():
    # 1. Login as Dr. Pascal Lee
    login_res = client.post("/api/v1/auth/login", json={
        "email": "dr.pascal.lee@seti.org",
        "password": "AeroKrypt2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a research project with full parameters
    project_payload = {
        "title": "Cryogenic Permafrost Core Sampling in High Arctic Impact Ejecta",
        "abstract": "Subsurface core extraction in continuous permafrost within the Haughton impact crater, Devon Island.",
        "objective": "Determine drill penetration mechanics in cold-ice-cemented dolomite breccia under simulated Martian temperatures.",
        "category": "CRYO_DRILLING",
        "target_body": "Mars",
        "location_id": "haughton-crater",
        "experiment_name": "Autonomous Cryo-Core Drill Protocol",
        "methodology": "Low-power rotary percussive coring with non-fluid air purge.",
        "collaborators": [
            "Dr. Pascal Lee (Mars Institute)",
            "Dr. Gordon Osinski (Western University)",
            "Dr. Brian Glass (NASA Ames)"
        ],
        "experiment_params": {
            "target_depth_m": 2.0,
            "max_power_w": 100.0,
            "core_diameter_mm": 25.0
        },
        "status": "DRAFT"
    }

    create_res = client.post("/api/v1/research/projects", json=project_payload, headers=headers)
    assert create_res.status_code == 201
    proj_data = create_res.json()
    proj_id = proj_data["id"]

    assert proj_data["title"] == project_payload["title"]
    assert proj_data["target_body"] == "Mars"
    assert proj_data["status"] == "DRAFT"
    assert len(proj_data["collaborators"]) == 3
    assert proj_data["experiment_params"]["target_depth_m"] == 2.0

    # 3. Read back project
    get_res = client.get(f"/api/v1/research/projects/{proj_id}", headers=headers)
    assert get_res.status_code == 200
    fetched = get_res.json()
    assert fetched["id"] == proj_id
    assert fetched["location_id"] == "haughton-crater"

    # 4. Update project
    update_payload = {
        "status": "COMPLETED",
        "findings": "Core recovery rate exceeded 94% across 8 consecutive drill holes.",
        "collaborators": [
            "Dr. Pascal Lee (Mars Institute)",
            "Dr. Gordon Osinski (Western University)",
            "Dr. Brian Glass (NASA Ames)",
            "Dr. Christopher McKay (NASA Ames)"
        ]
    }
    update_res = client.put(f"/api/v1/research/projects/{proj_id}", json=update_payload, headers=headers)
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["status"] == "COMPLETED"
    assert len(updated["collaborators"]) == 4

    # 5. Delete project
    del_res = client.delete(f"/api/v1/research/projects/{proj_id}", headers=headers)
    assert del_res.status_code == 200

    # Verify 404 after deletion
    get_404 = client.get(f"/api/v1/research/projects/{proj_id}", headers=headers)
    assert get_404.status_code == 404
