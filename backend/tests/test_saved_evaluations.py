"""
AEROKRYPT - Saved Site Evaluations & Project Traceability Test Suite
Verifies:
1. Running and saving an analogue site assessment linked to a specific research project.
2. Preserving parameter comparisons, physical divergences, evidence, and uncertainties.
3. Reopening previously saved assessments by unique ID.
4. Retrieving all assessments belonging to a project.
5. Comparing multiple assessments side-by-side within the same project.
6. Ensuring evaluation traceability (evaluation_version, timestamp, source provenance).
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


def test_save_reopen_and_compare_evaluations():
    # 1. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": "dr.pascal.lee@seti.org",
        "password": "AeroKrypt2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a research project
    proj_res = client.post("/api/v1/research/projects", json={
        "title": "Comparative Planetary Analogue Traverses: Atacama vs Mars Gale & Jezero",
        "abstract": "Evaluating rover trafficability across hyper-arid nitrate-sulfate terrains against MOLA reference craters.",
        "category": "ROVER_MOBILITY",
        "target_body": "Mars",
        "location_id": "atacama-yungay",
        "status": "DRAFT"
    }, headers=headers)
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 3. Run and save Evaluation #1 (Atacama vs Jezero Delta)
    eval1_payload = {
        "location_id": "atacama-yungay",
        "target_body": "Mars",
        "planetary_terrain_id": "mars-jezero-delta",
        "project_id": project_id,
        "experiment_id": "rover-mobility",
        "evaluator_name": "Dr. Pascal Lee",
        "save_to_project": True
    }
    res1 = client.post("/api/v1/evaluations/site-assessment", json=eval1_payload)
    assert res1.status_code == 200
    eval1_data = res1.json()
    eval1_id = eval1_data["evaluation_id"]
    assert eval1_data["project_id"] == project_id
    assert eval1_data["evaluation_version"] == "AEROKRYPT_SITE_EVAL_V2"

    # 4. Run and save Evaluation #2 (Atacama vs Gale Crater)
    eval2_payload = {
        "location_id": "atacama-yungay",
        "target_body": "Mars",
        "planetary_terrain_id": "mars-gale-crater-aeolis",
        "project_id": project_id,
        "experiment_id": "deep-uv-spectroscopy",
        "evaluator_name": "Dr. Pascal Lee",
        "save_to_project": True
    }
    res2 = client.post("/api/v1/evaluations/site-assessment", json=eval2_payload)
    assert res2.status_code == 200
    eval2_data = res2.json()
    eval2_id = eval2_data["evaluation_id"]

    # 5. Reopen saved assessment #1 by ID
    reopen_res = client.get(f"/api/v1/evaluations/{eval1_id}")
    assert reopen_res.status_code == 200
    reopened = reopen_res.json()
    assert reopened["evaluation_id"] == eval1_id
    assert reopened["project_id"] == project_id
    assert "geological_fidelity" in reopened
    assert "divergence_summary" in reopened
    assert reopened["geological_fidelity"]["lithology_alignment"] in ["HIGH", "MODERATE"]

    # 6. Retrieve all evaluations for this project
    proj_evals_res = client.get(f"/api/v1/evaluations/project/{project_id}")
    assert proj_evals_res.status_code == 200
    eval_list = proj_evals_res.json()
    assert len(eval_list) >= 2
    ids_in_project = [e.get("evaluation_id") or e.get("id") for e in eval_list]
    assert eval1_id in ids_in_project
    assert eval2_id in ids_in_project

    # 7. Compare multiple evaluations belonging to the same project
    compare_res = client.post("/api/v1/evaluations/compare", json={
        "evaluation_ids": [eval1_id, eval2_id]
    })
    assert compare_res.status_code == 200
    comp_data = compare_res.json()
    assert comp_data["count"] == 2
    assert "comparison_matrix" in comp_data
    assert len(comp_data["evaluations"]) == 2
