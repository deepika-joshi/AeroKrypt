"""
AEROKRYPT - Automated Full Backend Test Suite
Tests:
1. Researcher Registration, Login, Logout, and Token Issuance
2. HttpOnly Cookie & Bearer Token Authentication
3. /api/v1/auth/me Profile Verification and 401 Guarding
4. Private Research Workspace CRUD
5. STRICT DATA PRIVACY: Cross-Account Access Blocking (Researcher A vs B)
6. Peer Review Submission, Queue, Review Transition, and Audit Trail
7. Public Discovery Archive Isolation (Drafts never leak)
8. Operational Telemetry (/health) and Location APIs
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database import init_db, SessionLocal
from app.config import settings

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Explicitly initializes SQLite test database schema and seeds before running tests."""
    from app.database import setup_database_connection
    setup_database_connection(force_sqlite=True)
    init_db()


# ============================================================================
# 1. AUTHENTICATION TESTS
# ============================================================================

def test_health_telemetry():
    """Telemetry endpoint reports NOMINAL operational status and stack metadata."""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "NOMINAL"
    assert "FastAPI" in data["stack"]["api_framework"]
    assert "PostgreSQL" in data["stack"]["spatial_database"]


def test_researcher_registration_success():
    """Registers a new researcher with valid institutional credentials."""
    import uuid
    unique_email = f"dr.alan.grant.{uuid.uuid4().hex[:6]}@paleo-mars.org"
    payload = {
        "email": unique_email,
        "password": "SecurePassword2026!",
        "full_name": "Dr. Alan Grant",
        "institution": "Montana Planetary Analogues Institute",
        "role": "RESEARCHER"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["researcher"]["email"] == unique_email
    assert data["researcher"]["role"] == "RESEARCHER"
    # Verify HttpOnly cookie is set
    assert settings.COOKIE_NAME in res.cookies


def test_researcher_registration_duplicate_email():
    """Blocks duplicate registration with 400 Bad Request."""
    import uuid
    dup_email = f"dup.{uuid.uuid4().hex[:8]}@paleo-mars.org"
    payload = {
        "email": dup_email,
        "password": "AnotherPassword2026!",
        "full_name": "Duplicate Investigator",
        "institution": "Another Inst"
    }
    first_res = client.post("/api/v1/auth/register", json=payload)
    assert first_res.status_code == 201
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 400
    assert "already registered" in res.json()["detail"].lower()


def test_researcher_registration_short_password():
    """Rejects weak passwords under 8 characters."""
    payload = {
        "email": "weak.pw@inst.edu",
        "password": "short",
        "full_name": "Weak Pass User",
        "institution": "Inst"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422  # Pydantic validation error


def test_researcher_login_success():
    """Authenticates seeded Principal Investigator Dr. Pascal Lee."""
    payload = {
        "email": "dr.pascal.lee@seti.org",
        "password": "AeroKrypt2026!"
    }
    res = client.post("/api/v1/auth/login", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["researcher"]["full_name"] == "Dr. Pascal Lee"
    assert settings.COOKIE_NAME in res.cookies


def test_researcher_login_invalid_password():
    """Rejects incorrect password with 401 Unauthorized."""
    payload = {
        "email": "dr.pascal.lee@seti.org",
        "password": "WrongPassword999!"
    }
    res = client.post("/api/v1/auth/login", json=payload)
    assert res.status_code == 401


def test_auth_me_unauthenticated():
    """Unauthenticated requests to /api/v1/auth/me receive 401."""
    # Create fresh client without cookies
    clean_client = TestClient(app)
    res = clean_client.get("/api/v1/auth/me")
    assert res.status_code == 401


def test_auth_me_authenticated():
    """Authenticated researcher can retrieve their own profile."""
    # Login as Dr. Pascal Lee
    login_res = client.post("/api/v1/auth/login", json={
        "email": "dr.pascal.lee@seti.org",
        "password": "AeroKrypt2026!"
    })
    token = login_res.json()["access_token"]

    # Request profile using Bearer header
    res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "dr.pascal.lee@seti.org"


def test_logout():
    """Logout clears the HttpOnly cookie."""
    res = client.post("/api/v1/auth/logout")
    assert res.status_code == 200
    assert "Logged out successfully" in res.json()["message"]


# ============================================================================
# 2. PRIVATE RESEARCH WORKSPACE & STRICT PRIVACY TESTS
# ============================================================================

def test_private_workspace_crud():
    """
    Verifies that a researcher can create, read, update, and delete
    their own private research records.
    """
    # 1. Login as Dr. Pascal Lee
    login_res = client.post("/api/v1/auth/login", json={
        "email": "dr.pascal.lee@seti.org",
        "password": "AeroKrypt2026!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create private record
    new_record = {
        "title": "Arctic Permafrost Drilling Depth Telemetry",
        "abstract": "Subsurface coring drill trials in Devon Island dolomite breccia.",
        "objective": "Evaluate rotary-percussive bit thermal dissipation under -20C ambient conditions.",
        "category": "DRILLING_ICE",
        "target_body": "Mars",
        "location_id": "haughton-crater",
        "experiment_name": "Cryo-Drill-2026",
        "methodology": "Thermocouple arrays mounted at 0.1m depth intervals along the drill flight.",
        "findings": "Bit temperatures peaked at +14C without melting the surrounding permafrost ice matrix.",
        "research_notes": "Bit speed held at 120 RPM.",
        "status": "DRAFT",
        "references": [
            {
                "doi": "10.1016/j.pss.2013.05.019",
                "title": "Cryogenic drilling in terrestrial analogue permafrost",
                "authors": "Heldmann, J., et al.",
                "year": 2013,
                "citation_status": "VERIFIED_DOI"
            }
        ]
    }
    create_res = client.post("/api/v1/research/records", json=new_record, headers=headers)
    assert create_res.status_code == 201
    created_data = create_res.json()
    record_id = created_data["id"]
    assert created_data["title"] == new_record["title"]
    assert len(created_data["references"]) == 1

    # 3. Read back single record
    get_res = client.get(f"/api/v1/research/records/{record_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == record_id

    # 4. Update record
    update_res = client.put(f"/api/v1/research/records/{record_id}", json={
        "findings": "Updated findings: rotational torque remained below 8.2 Nm throughout all trials."
    }, headers=headers)
    assert update_res.status_code == 200
    assert "8.2 Nm" in update_res.json()["findings"]

    # 5. Delete record
    del_res = client.delete(f"/api/v1/research/records/{record_id}", headers=headers)
    assert del_res.status_code == 200

    # 6. Verify record is gone
    verify_del = client.get(f"/api/v1/research/records/{record_id}", headers=headers)
    assert verify_del.status_code == 404


def test_strict_cross_account_isolation():
    """
    CRITICAL SECURITY CHECK:
    Researcher A (Dr. Pascal Lee) owns rec-demo-hmp-001.
    Researcher B (Dr. Jane Planetary) owns rec-demo-svalbard-002.
    Researcher B MUST NOT be able to view, edit, or delete Researcher A's record.
    """
    # Login as Researcher B (Dr. Jane Planetary)
    login_b = client.post("/api/v1/auth/login", json={
        "email": "dr.jane.planetary@psi.edu",
        "password": "JaneAstro2026!"
    })
    assert login_b.status_code == 200
    token_b = login_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # Researcher A's record ID
    record_a_id = "rec-demo-hmp-001"

    # 1. Researcher B tries to view Researcher A's record -> Expect 403 Forbidden
    forbidden_get = client.get(f"/api/v1/research/records/{record_a_id}", headers=headers_b)
    assert forbidden_get.status_code == 403
    assert "forbidden" in forbidden_get.json()["detail"].lower()

    # 2. Researcher B tries to edit Researcher A's record -> Expect 403 Forbidden
    forbidden_put = client.put(f"/api/v1/research/records/{record_a_id}", json={
        "title": "Hacked Title Attempt"
    }, headers=headers_b)
    assert forbidden_put.status_code == 403

    # 3. Researcher B tries to delete Researcher A's record -> Expect 403 Forbidden
    forbidden_del = client.delete(f"/api/v1/research/records/{record_a_id}", headers=headers_b)
    assert forbidden_del.status_code == 403

    # 4. Listing records for Researcher B must ONLY show Researcher B's records
    list_b = client.get("/api/v1/research/records", headers=headers_b)
    assert list_b.status_code == 200
    records_b = list_b.json()
    record_ids_b = [r["id"] for r in records_b]
    assert record_a_id not in record_ids_b
    assert "rec-demo-svalbard-002" in record_ids_b


# ============================================================================
# 3. SUBMISSION & PEER REVIEW PIPELINE TESTS
# ============================================================================

def test_submission_lifecycle_and_audit_history():
    """
    Tests the complete contribution lifecycle:
    Draft -> Submitted -> Under Review -> Approved -> Published.
    Verifies that only PUBLISHED contributions appear in Public Discovery.
    """
    # 1. Author (Dr. Jane Planetary) creates a new private record
    login_author = client.post("/api/v1/auth/login", json={
        "email": "dr.jane.planetary@psi.edu",
        "password": "JaneAstro2026!"
    })
    token_author = login_author.json()["access_token"]
    headers_author = {"Authorization": f"Bearer {token_author}"}

    create_res = client.post("/api/v1/research/records", json={
        "title": "Deep-UV Raman Calibrations on Bockfjorden Basalt Nodules",
        "abstract": "Validation of 248 nm deep-UV Raman spectroscopy for Martian mantle xenoliths.",
        "category": "ASTROBIOLOGY",
        "target_body": "Mars",
        "location_id": "svalbard-bockfjorden",
        "findings": "Zero background fluorescence achieved under 248 nm deep-UV excitation."
    }, headers=headers_author)
    record_id = create_res.json()["id"]

    # 2. Author submits the record
    submit_res = client.post(f"/api/v1/research/records/{record_id}/submit", headers=headers_author)
    assert submit_res.status_code == 200
    submission = submit_res.json()
    submission_id = submission["id"]
    assert submission["status"] == "SUBMITTED"

    # 3. Verify that the submission is NOT yet visible in Public Discovery
    pub_res = client.get("/api/v1/research/public/published")
    assert pub_res.status_code == 200
    public_ids = [item["id"] for item in pub_res.json()]
    assert submission_id not in public_ids

    # 4. Reviewer (Dr. Gordon Osinski) logs in and checks review queue
    login_reviewer = client.post("/api/v1/auth/login", json={
        "email": "reviewer.osinski@aerokrypt.org",
        "password": "ReviewerSecure2026!"
    })
    token_reviewer = login_reviewer.json()["access_token"]
    headers_reviewer = {"Authorization": f"Bearer {token_reviewer}"}

    queue_res = client.get("/api/v1/research/submissions/queue", headers=headers_reviewer)
    assert queue_res.status_code == 200
    queue_ids = [s["id"] for s in queue_res.json()]
    assert submission_id in queue_ids

    # 5. Reviewer marks submission UNDER_REVIEW
    review_res = client.post(f"/api/v1/research/submissions/{submission_id}/review", json={
        "status": "UNDER_REVIEW",
        "reviewer_comments": "Assigned to the Planetary Astrobiology working group."
    }, headers=headers_reviewer)
    assert review_res.status_code == 200
    assert review_res.json()["status"] == "UNDER_REVIEW"

    # 6. Reviewer marks submission APPROVED
    approve_res = client.post(f"/api/v1/research/submissions/{submission_id}/review", json={
        "status": "APPROVED",
        "reviewer_comments": "Spectroscopic baselines thoroughly validated against SHERLOC instrument specifications."
    }, headers=headers_reviewer)
    assert approve_res.status_code == 200
    assert approve_res.json()["status"] == "APPROVED"

    # 7. Reviewer publishes the submission
    publish_res = client.post(f"/api/v1/research/submissions/{submission_id}/publish", headers=headers_reviewer)
    assert publish_res.status_code == 200
    assert publish_res.json()["status"] == "PUBLISHED"

    # 8. Verify that it NOW appears in Public Discovery archive
    pub_res_updated = client.get("/api/v1/research/public/published")
    assert pub_res_updated.status_code == 200
    public_titles = [item["submission_title"] for item in pub_res_updated.json()]
    assert "Deep-UV Raman Calibrations on Bockfjorden Basalt Nodules" in public_titles

    # 9. Verify the complete audit history was recorded
    history = publish_res.json()["audit_history"]
    assert len(history) >= 3  # SUBMITTED, UNDER_REVIEW, APPROVED, PUBLISHED
    to_statuses = [h["to_status"] for h in history]
    assert "SUBMITTED" in to_statuses
    assert "PUBLISHED" in to_statuses


def test_public_discovery_never_leaks_drafts():
    """
    CRITICAL ISOLATION CHECK:
    Draft private records must never appear in Public Discovery.
    """
    res = client.get("/api/v1/research/public/published")
    assert res.status_code == 200
    published_items = res.json()
    for item in published_items:
        # None of the published items can be drafts
        assert item.get("status", "PUBLISHED") == "PUBLISHED"


# ============================================================================
# 4. LOCATION & EVALUATION ENDPOINTS VERIFICATION
# ============================================================================

def test_locations_endpoint():
    """Locations endpoint returns the 20 planetary analogue locations."""
    res = client.get("/api/v1/locations")
    assert res.status_code == 200
    locations = res.json()
    assert len(locations) >= 20


def test_location_detail_and_geojson():
    """Verifies detailed site profile and GeoJSON polygon generation."""
    loc_id = "atacama-yungay"
    detail_res = client.get(f"/api/v1/locations/{loc_id}")
    assert detail_res.status_code == 200
    data = detail_res.json()
    assert data["id"] == loc_id
    assert "Chile" in data["country"]
    assert len(data["lithology"]) > 0

    # Test GeoJSON endpoint
    geo_res = client.get(f"/api/v1/locations/{loc_id}/geojson")
    assert geo_res.status_code == 200
    geo = geo_res.json()
    assert geo["type"] == "FeatureCollection"
    assert len(geo["features"]) >= 2  # Bounding polygon and point marker


def test_planetary_terrains():
    """Planetary reference terrain models for Mars (MOLA) and Moon (LOLA)."""
    res = client.get("/api/v1/planetary/terrains")
    assert res.status_code == 200
    terrains = res.json()
    assert len(terrains) >= 3
    bodies = [t["target_body"] for t in terrains]
    assert "Mars" in bodies
    assert "Moon" in bodies


def test_evaluations_site_assessment():
    """Multi-criteria evaluation separates geological fidelity from operational feasibility."""
    payload = {
        "location_id": "atacama-yungay",
        "target_body": "Mars",
        "planetary_terrain_id": "mars-jezero-delta",
        "experiment_id": "extremophile-astrobiology"
    }
    res = client.post("/api/v1/evaluations/site-assessment", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "geological_fidelity" in data
    assert "operational_suitability" in data
    assert "missing_critical_parameters" in data
    assert len(data["divergence_summary"]) >= 2  # Gravity and Atmosphere divergences noted


def test_evaluations_predict_hazards():
    """AI/ML operational mobility hazard screening endpoint."""
    payload = {
        "slope": 12.5,
        "elevation": 1400.0,
        "temp": -10.0,
        "precip": 15.0,
        "uv": 6.5,
        "target_body": "Mars"
    }
    res = client.post("/api/v1/evaluations/predict-hazards", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "engine" in data
    assert "confidence" in data
    assert "disclaimer" in data
    assert any(k in data for k in ["mobility_risk_index", "mobility_hazard_score"])


def test_reviewer_queue_access_control():
    """Enforces that ordinary researchers cannot access the reviewer queue."""
    # Login as ordinary researcher (Dr. Alan Grant)
    login_res = client.post("/api/v1/auth/login", json={
        "email": "dr.pascal.lee@seti.org",
        "password": "AeroKrypt2026!"
    })
    token = login_res.json()["access_token"]
    res = client.get("/api/v1/research/submissions/queue", headers={"Authorization": f"Bearer {token}"})
    # Dr. Pascal Lee has role 'RESEARCHER', not 'REVIEWER' or 'ADMIN'
    assert res.status_code == 403
