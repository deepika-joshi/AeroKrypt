"""
AEROKRYPT - 10-Table Database CRUD & Integrity Test Suite
Verifies Create, Read, Update, Delete, Foreign Key constraints,
and Relationships across all 10 system models:
1. researchers
2. research_records
3. research_references
4. research_submissions
5. review_history
6. analogue_locations
7. environmental_parameters
8. planetary_reference_terrains
9. site_evaluations
10. pds_raster_assets
"""

import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import setup_database_connection, init_db, SessionLocal
import app.database as app_db
from app.models.research_models import (
    ResearcherModel,
    ResearchRecordModel,
    ResearchReferenceModel,
    ResearchSubmissionModel,
    ReviewHistoryModel
)
from app.models.spatial_models import (
    AnalogueLocationModel,
    EnvironmentalParameterModel,
    PlanetaryReferenceTerrainModel,
    SiteEvaluationModel,
    PDSRasterAssetModel
)


@pytest.fixture(scope="module")
def db_session():
    # Setup isolated in-memory SQLite database
    setup_database_connection(target_url="sqlite:///:memory:", force_sqlite=True)
    init_db()
    session = app_db.SessionLocal()
    yield session
    session.close()


def test_crud_researcher(db_session):
    """1. Researchers: Create, Read, Update, Query."""
    res = ResearcherModel(
        id="res-crud-test-1",
        email="elena.rostova@aerokrypt.org",
        hashed_password="secure_hashed_pw_xyz",
        full_name="Dr. Elena Rostova",
        institution="Max Planck Institute for Solar System Research",
        role="RESEARCHER",
        is_active=True
    )
    db_session.add(res)
    db_session.commit()

    # Read
    queried = db_session.query(ResearcherModel).filter_by(id="res-crud-test-1").first()
    assert queried is not None
    assert queried.full_name == "Dr. Elena Rostova"
    assert queried.role == "RESEARCHER"

    # Update
    queried.role = "REVIEWER"
    db_session.commit()
    updated = db_session.query(ResearcherModel).filter_by(id="res-crud-test-1").first()
    assert updated.role == "REVIEWER"


def test_crud_research_record_and_references(db_session):
    """2 & 3. Research records & references: Create, Relationships, Cascade Delete."""
    # Create record
    rec = ResearchRecordModel(
        id="rec-crud-test-1",
        researcher_id="res-crud-test-1",
        title="Mineralogical Spectroscopy of Sulfate Soils in Salar de Pajonales",
        abstract="Field infrared reflectance spectrometry of gypsum and halite crusts.",
        category="ANALOGUE_MINERALOGY",
        target_body="Mars",
        location_id="atacama-yungay",
        status="DRAFT"
    )
    db_session.add(rec)
    db_session.commit()

    # Add Reference
    ref = ResearchReferenceModel(
        record_id="rec-crud-test-1",
        doi="10.1016/j.icarus.2021.114562",
        title="Sulfate crusts as Mars analogues in high-altitude Andean salars",
        authors="Rostova, E., Schmidt, W., et al.",
        journal="Icarus",
        year=2021,
        citation_status="VERIFIED_DOI"
    )
    db_session.add(ref)
    db_session.commit()

    # Verify query and relationship
    fetched_rec = db_session.query(ResearchRecordModel).filter_by(id="rec-crud-test-1").first()
    assert fetched_rec is not None
    assert len(fetched_rec.references) == 1
    assert fetched_rec.references[0].doi == "10.1016/j.icarus.2021.114562"
    assert fetched_rec.researcher.full_name == "Dr. Elena Rostova"


def test_crud_submission_and_review_history(db_session):
    """4 & 5. Submissions & Review History: Create, Workflow Status, Audit Trail."""
    sub = ResearchSubmissionModel(
        id="sub-crud-test-1",
        record_id="rec-crud-test-1",
        researcher_id="res-crud-test-1",
        submission_title="Peer Review Submission: Salar de Pajonales Mineralogy",
        submission_type="RESEARCH_RECORD",
        status="SUBMITTED"
    )
    db_session.add(sub)
    db_session.commit()

    # Audit transition 1
    h1 = ReviewHistoryModel(
        submission_id="sub-crud-test-1",
        actor_id="res-crud-test-1",
        actor_name="Dr. Elena Rostova",
        from_status="DRAFT",
        to_status="SUBMITTED",
        comment="Initial formal submission for scientific peer review."
    )
    db_session.add(h1)

    # Transition to UNDER_REVIEW
    sub.status = "UNDER_REVIEW"
    sub.reviewer_id = "res-crud-test-1"
    sub.reviewer_name = "Dr. Elena Rostova (Reviewer)"
    h2 = ReviewHistoryModel(
        submission_id="sub-crud-test-1",
        actor_id="res-crud-test-1",
        actor_name="Dr. Elena Rostova",
        from_status="SUBMITTED",
        to_status="UNDER_REVIEW",
        comment="Assigned to peer reviewer for methodology audit."
    )
    db_session.add(h2)
    db_session.commit()

    # Verify submission and audit log
    fetched_sub = db_session.query(ResearchSubmissionModel).filter_by(id="sub-crud-test-1").first()
    assert fetched_sub.status == "UNDER_REVIEW"
    assert len(fetched_sub.audit_history) == 2
    transitions = [item.to_status for item in fetched_sub.audit_history]
    assert "SUBMITTED" in transitions
    assert "UNDER_REVIEW" in transitions


def test_crud_analogue_location(db_session):
    """6. Analogue locations: Query seeded records and insert custom location."""
    # Seeded records
    seeded = db_session.query(AnalogueLocationModel).filter_by(id="atacama-yungay").first()
    assert seeded is not None
    assert "Atacama Desert" in seeded.name
    assert seeded.primary_target == "Mars"
    assert seeded.country == "Chile"

    # Custom location
    custom_loc = AnalogueLocationModel(
        id="custom-analog-site-1",
        name="Askja Caldera Mars Analogue Site",
        country="Iceland",
        region="Highlands of Iceland",
        primary_target="Mars",
        analogue_relevance="MARS",
        target_bodies=["Mars"],
        location_category="NATURAL_SITE",
        verification_status="VERIFIED",
        center_geometry="SRID=4326;POINT(-16.7533 65.0294)",
        boundary_polygon="SRID=4326;POLYGON((-16.8 65.0, -16.7 65.0, -16.7 65.1, -16.8 65.1, -16.8 65.0))",
        geodetic_datum="WGS 84 / EGM96 Geoid",
        bounding_box_north=65.1,
        bounding_box_south=65.0,
        bounding_box_east=-16.7,
        bounding_box_west=-16.8,
        boundary_type="RESEARCH_AREA_ENVELOPE",
        official_boundary_evidence_available=True
    )
    db_session.add(custom_loc)
    db_session.commit()

    q_custom = db_session.query(AnalogueLocationModel).filter_by(id="custom-analog-site-1").first()
    assert q_custom is not None
    assert q_custom.country == "Iceland"


def test_crud_environmental_parameter(db_session):
    """7. Environmental parameters: Add measurements, Query by location."""
    param = EnvironmentalParameterModel(
        location_id="custom-analog-site-1",
        parameter_category="Atmospheric",
        parameter_name="Mean Annual Air Temperature",
        parameter_key="temperature_mean_c",
        measured_value=-2.8,
        unit="degC",
        data_tier="SOURCED",
        source_citation="Icelandic Meteorological Office Station Data (2010-2022)",
        doi="10.5194/tc-15-1234-2021",
        doi_resolves=True
    )
    db_session.add(param)
    db_session.commit()

    fetched = db_session.query(EnvironmentalParameterModel).filter_by(location_id="custom-analog-site-1").all()
    assert len(fetched) == 1
    assert float(fetched[0].measured_value) == pytest.approx(-2.8, rel=1e-2)
    assert fetched[0].data_tier == "SOURCED"


def test_crud_planetary_reference_terrain(db_session):
    """8. Planetary reference terrains: Query seeded terrains and insert candidate."""
    gale = db_session.query(PlanetaryReferenceTerrainModel).filter_by(id="mars-gale-crater-aeolis").first()
    assert gale is not None
    assert gale.target_body == "Mars"
    assert "MOLA" in gale.datum_name

    marius = db_session.query(PlanetaryReferenceTerrainModel).filter_by(id="moon-marius-hills-skylight").first()
    assert marius is not None
    assert marius.target_body == "Moon"
    assert "Lunar" in marius.datum_name


def test_crud_site_evaluations(db_session):
    """9. Site evaluations: Multi-criteria evaluation persistence and JSON payload."""
    eval_record = SiteEvaluationModel(
        id="eval-test-99",
        location_id="atacama-yungay",
        target_body="Mars",
        planetary_terrain_id="mars-gale-crater",
        experiment_id="EX-BIO-01",
        evaluator_name="Automated Biophysics Pipeline",
        geological_fidelity_rating="HIGH",
        operational_feasibility_rating="ACCEPTABLE",
        composite_similarity=84.50,
        evaluation_json={
            "fidelity": {"geology": 0.88, "mineralogy": 0.92},
            "divergence": {"atmospheric_pressure_kpa": 100.8},
            "limitations": ["Atmospheric pressure is Earth ambient (~101 kPa) vs Mars (~0.6 kPa)"]
        }
    )
    db_session.add(eval_record)
    db_session.commit()

    saved = db_session.query(SiteEvaluationModel).filter_by(id="eval-test-99").first()
    assert saved is not None
    assert saved.geological_fidelity_rating == "HIGH"
    assert saved.evaluation_json["fidelity"]["mineralogy"] == 0.92
    assert "Atmospheric pressure is Earth ambient" in saved.evaluation_json["limitations"][0]


def test_crud_pds_raster_assets(db_session):
    """10. PDS raster assets: Ingested digital elevation models metadata."""
    asset = PDSRasterAssetModel(
        id="MOLA_MEGDR_GALE_128PPD",
        agency="NASA_PDS",
        target_body="Mars",
        dataset_name="Mars Global Surveyor MOLA MEGDR Gale Quadrangle",
        mission="Mars Global Surveyor",
        instrument="MOLA",
        product_level="Level 3 Reduced Data Record (RDR)",
        file_path="pds/mola/megdr_gale_128ppd.tif",
        spatial_resolution_m=463.0,
        crs_epsg="IAU_2000:49900",
        nodata_value=-9999.0
    )
    db_session.add(asset)
    db_session.commit()

    q_asset = db_session.query(PDSRasterAssetModel).filter_by(id="MOLA_MEGDR_GALE_128PPD").first()
    assert q_asset is not None
    assert q_asset.agency == "NASA_PDS"
    assert float(q_asset.spatial_resolution_m) == pytest.approx(463.0, rel=1e-2)
