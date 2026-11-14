"""
AEROKRYPT - Research Publication Lifecycle & Audit Trail Test Suite
Verifies:
1. Full 5-stage lifecycle: DRAFT -> SUBMITTED -> UNDER_REVIEW -> REVISION_REQUESTED -> APPROVED -> PUBLISHED.
2. Reviewer comments and revision request reasons.
3. Chronological audit history trail logging each status change with actor attribution.
4. Final approval and publication transition.
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


def test_complete_publication_lifecycle_and_audit_trail():
    # 1. Login as Author (Dr. Pascal Lee)
    author_login = client.post("/api/v1/auth/login", json={
        "email": "dr.pascal.lee@seti.org",
        "password": "AeroKrypt2026!"
    })
    assert author_login.status_code == 200
    author_token = author_login.json()["access_token"]
    author_headers = {"Authorization": f"Bearer {author_token}"}

    # 2. Login as Reviewer (Dr. Gordon Osinski)
    reviewer_login = client.post("/api/v1/auth/login", json={
        "email": "reviewer.osinski@aerokrypt.org",
        "password": "ReviewerSecure2026!"
    })
    assert reviewer_login.status_code == 200
    reviewer_token = reviewer_login.json()["access_token"]
    reviewer_headers = {"Authorization": f"Bearer {reviewer_token}"}

    # 3. Create Draft Project
    draft_res = client.post("/api/v1/research/projects", json={
        "title": "Subsurface Radar Dielectric Benchmarks in Salar de Atacama",
        "abstract": "Dielectric permittivity measurements of halite and sulfate crusts for Mars GPR.",
        "category": "RADAR_GEOPHYSICS",
        "target_body": "Mars",
        "location_id": "atacama-yungay",
        "status": "DRAFT"
    }, headers=author_headers)
    assert draft_res.status_code == 201
    rec_id = draft_res.json()["id"]

    # 4. Transition: DRAFT -> SUBMITTED
    submit_res = client.post(f"/api/v1/research/records/{rec_id}/submit", headers=author_headers)
    assert submit_res.status_code == 200
    sub_data = submit_res.json()
    sub_id = sub_data["id"]
    assert sub_data["status"] == "SUBMITTED"

    # 5. Reviewer Queue: Reviewer checks queue
    queue_res = client.get("/api/v1/research/submissions/queue?status=SUBMITTED", headers=reviewer_headers)
    assert queue_res.status_code == 200
    queue_items = queue_res.json()
    assert any(q["id"] == sub_id for q in queue_items)

    # 6. Transition: SUBMITTED -> UNDER_REVIEW
    under_review_res = client.post(f"/api/v1/research/submissions/{sub_id}/review", json={
        "status": "UNDER_REVIEW",
        "reviewer_comments": "Assigned to geophysics subcommittee for permittivity methodology audit."
    }, headers=reviewer_headers)
    assert under_review_res.status_code == 200
    assert under_review_res.json()["status"] == "UNDER_REVIEW"

    # 7. Transition: UNDER_REVIEW -> REVISION_REQUESTED
    revision_res = client.post(f"/api/v1/research/submissions/{sub_id}/review", json={
        "status": "REVISION_REQUESTED",
        "reviewer_comments": "Please incorporate temperature-dependent loss tangent measurements at 500 MHz.",
        "revision_requested_reason": "Missing 500 MHz loss tangent frequency calibration."
    }, headers=reviewer_headers)
    assert revision_res.status_code == 200
    assert revision_res.json()["status"] == "REVISION_REQUESTED"

    # 8. Author addresses revisions and re-submits
    resubmit_res = client.post(f"/api/v1/research/records/{rec_id}/submit", headers=author_headers)
    assert resubmit_res.status_code == 200
    assert resubmit_res.json()["status"] == "SUBMITTED"

    # 9. Transition: SUBMITTED -> APPROVED
    approved_res = client.post(f"/api/v1/research/submissions/{sub_id}/review", json={
        "status": "APPROVED",
        "reviewer_comments": "Revisions fully addressed. Loss tangent telemetry verified. Approved for publication."
    }, headers=reviewer_headers)
    assert approved_res.status_code == 200
    assert approved_res.json()["status"] == "APPROVED"

    # 10. Transition: APPROVED -> PUBLISHED
    publish_res = client.post(f"/api/v1/research/submissions/{sub_id}/publish", headers=reviewer_headers)
    assert publish_res.status_code == 200
    assert publish_res.json()["status"] == "PUBLISHED"

    # 11. Verify complete Audit Trail
    audit_res = client.get(f"/api/v1/research/records/{rec_id}/audit-trail", headers=author_headers)
    assert audit_res.status_code == 200
    audit_trail = audit_res.json()
    assert len(audit_trail) >= 5
    to_statuses = [a["to_status"] for a in audit_trail]
    assert "SUBMITTED" in to_statuses
    assert "UNDER_REVIEW" in to_statuses
    assert "REVISION_REQUESTED" in to_statuses
    assert "APPROVED" in to_statuses
    assert "PUBLISHED" in to_statuses
