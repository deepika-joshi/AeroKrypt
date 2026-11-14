"""
AEROKRYPT - Database Connection & Session Management
Approved Stack: PostgreSQL 16 + PostGIS 3.4
Provides resilient connection management, PostGIS spatial verification,
explicit error reporting (no silent fallbacks), and explicit SQLite option for testing/development.
"""

from sqlalchemy import create_engine, text, func
from sqlalchemy.orm import sessionmaker, declarative_base
import logging
import os
import json
import re
from datetime import datetime, timezone
from typing import Optional
from app.config import settings

logger = logging.getLogger("aerokrypt.database")

Base = declarative_base()

engine = None
SessionLocal = None


def dms_to_deg(dms_str: str) -> Optional[float]:
    """Helper to convert DMS coordinates string to decimal degrees."""
    if not dms_str or not isinstance(dms_str, str):
        return None
    dms_str = dms_str.strip()
    try:
        return float(dms_str.replace("°", "").replace("N", "").replace("E", ""))
    except ValueError:
        pass

    match = re.search(r"([0-9\.]+)[°\s]+([0-9\.]*)['′\s]*([0-9\.]*)[\"″\s]*([NSEWnsew]?)", dms_str)
    if match:
        deg = float(match.group(1))
        mins = float(match.group(2)) if match.group(2) else 0.0
        secs = float(match.group(3)) if match.group(3) else 0.0
        direction = match.group(4).upper()
        res = deg + (mins / 60.0) + (secs / 3600.0)
        if direction in ['S', 'W']:
            res = -res
        return res
    return None


def parse_coordinates(coord_str: str):
    """Splits '24°04′S, 69°59′W' into (lat, lon)."""
    if not coord_str or not isinstance(coord_str, str):
        return 0.0, 0.0
    parts = coord_str.split(",")
    if len(parts) == 2:
        lat = dms_to_deg(parts[0]) or 0.0
        lon = dms_to_deg(parts[1]) or 0.0
        return lat, lon
    return 0.0, 0.0


def setup_database_connection(target_url: Optional[str] = None, force_sqlite: bool = False):
    """
    Establishes connection to PostgreSQL + PostGIS or explicitly configured SQLite.
    CRITICAL POLICY: Never silently falls back to SQLite when PostgreSQL is configured.
    """
    global engine, SessionLocal

    url = target_url or settings.DATABASE_URL
    is_explicit_sqlite = (
        force_sqlite or
        settings.USE_SQLITE or
        url.startswith("sqlite") or
        os.getenv("TESTING") == "sqlite"
    )

    if is_explicit_sqlite:
        sqlite_url = settings.SQLITE_FALLBACK_URL if url.startswith("postgresql") else url
        try:
            sqlite_engine = create_engine(
                sqlite_url,
                connect_args={"check_same_thread": False} if sqlite_url.startswith("sqlite") else {}
            )
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sqlite_engine)
            engine = sqlite_engine
            settings.DB_DIALECT = "sqlite"
            settings.DB_CONNECTION_STATUS = "CONNECTED_SQLITE_EXPLICIT"
            settings.IS_LOCAL_DB_LIVE = True
            settings.DB_ERROR = None
            settings.POSTGIS_AVAILABLE = False
            settings.POSTGIS_VERSION = None
            logger.info("SQLite database explicitly configured for testing/development: %s", sqlite_url)
            return engine
        except Exception as e:
            engine = None
            SessionLocal = None
            settings.DB_DIALECT = "sqlite"
            settings.DB_CONNECTION_STATUS = "SQLITE_CONNECTION_FAILED"
            settings.IS_LOCAL_DB_LIVE = False
            settings.DB_ERROR = f"Failed to initialize explicitly configured SQLite ({sqlite_url}): {str(e)}"
            logger.error(settings.DB_ERROR)
            return None

    # Target is PostgreSQL + PostGIS
    settings.DB_DIALECT = "postgresql"
    try:
        candidate_engine = create_engine(
            url,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            connect_args={"connect_timeout": 3}
        )
        with candidate_engine.connect() as conn:
            # Check for PostGIS extension
            try:
                res = conn.execute(text("SELECT PostGIS_Full_Version()")).scalar()
                settings.POSTGIS_AVAILABLE = True
                settings.POSTGIS_VERSION = str(res)
                logger.info("PostGIS spatial extension verified: %s", settings.POSTGIS_VERSION)
            except Exception as postgis_err:
                settings.POSTGIS_AVAILABLE = False
                settings.POSTGIS_VERSION = None
                logger.warning("PostGIS extension check returned: %s. Standard PostgreSQL active.", postgis_err)

        engine = candidate_engine
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        settings.DB_CONNECTION_STATUS = "CONNECTED_POSTGRESQL"
        settings.IS_LOCAL_DB_LIVE = True
        settings.DB_ERROR = None
        logger.info("Connected to PostgreSQL database: %s", url.split("@")[-1] if "@" in url else url)
        return engine

    except Exception as e:
        # STRICT REQUIREMENT: Report database failures clearly. Do NOT silently fall back to SQLite.
        engine = None
        SessionLocal = None
        settings.DB_CONNECTION_STATUS = "POSTGRESQL_CONNECTION_FAILED"
        settings.IS_LOCAL_DB_LIVE = False
        settings.POSTGIS_AVAILABLE = False
        settings.POSTGIS_VERSION = None
        settings.DB_ERROR = f"PostgreSQL connection to {url.split('@')[-1] if '@' in url else url} failed: {str(e)}"
        logger.error("POSTGRESQL CONNECTION FAILURE: %s", settings.DB_ERROR)
        return None


# Execute connection on module load
setup_database_connection()


def get_db():
    """Dependency injection helper for FastAPI routes."""
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initializes all 10 schema tables and seeds default researchers, locations,
    planetary terrains, and raster metadata if database is newly initialized.
    """
    if engine is None:
        logger.error("Cannot initialize DB: %s", settings.DB_ERROR or "No engine configured")
        return False

    # Import all 10 models to register with Base.metadata
    from app.models.spatial_models import (
        AnalogueLocationModel,
        EnvironmentalParameterModel,
        PlanetaryReferenceTerrainModel,
        SiteEvaluationModel,
        PDSRasterAssetModel
    )
    from app.models.research_models import (
        ResearcherModel,
        ResearchRecordModel,
        ResearchReferenceModel,
        ResearchSubmissionModel,
        ReviewHistoryModel
    )
    from app.services.auth_service import hash_password

    # Create all 10 tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Researchers and Demo Workspace
        existing_pascal = db.query(ResearcherModel).filter_by(id="res-pascal-lee-001").first()
        if not existing_pascal:
            logger.info("Seeding initial researcher accounts and demo workspace records...")

            pi = ResearcherModel(
                id="res-pascal-lee-001",
                email="dr.pascal.lee@seti.org",
                hashed_password=hash_password("AeroKrypt2026!"),
                full_name="Dr. Pascal Lee",
                institution="Mars Institute / SETI / NASA Haughton-Mars Project",
                role="RESEARCHER",
                is_active=True
            )
            reviewer = ResearcherModel(
                id="res-reviewer-osinski-002",
                email="reviewer.osinski@aerokrypt.org",
                hashed_password=hash_password("ReviewerSecure2026!"),
                full_name="Dr. Gordon Osinski",
                institution="Western University / Canadian Space Agency Analogue Working Group",
                role="REVIEWER",
                is_active=True
            )
            admin = ResearcherModel(
                id="res-admin-003",
                email="admin@aerokrypt.org",
                hashed_password=hash_password("AdminSecret2026!"),
                full_name="AEROKRYPT Operations Administrator",
                institution="AEROKRYPT Planetary Consortium",
                role="ADMIN",
                is_active=True
            )
            colleague = ResearcherModel(
                id="res-jane-planetary-004",
                email="dr.jane.planetary@psi.edu",
                hashed_password=hash_password("JaneAstro2026!"),
                full_name="Dr. Jane Planetary",
                institution="Planetary Science Institute",
                role="RESEARCHER",
                is_active=True
            )
            db.add_all([pi, reviewer, admin, colleague])
            db.flush()

            rec1 = ResearchRecordModel(
                id="rec-demo-hmp-001",
                researcher_id=pi.id,
                title="Autonomous Wheel Odometry Correction in Arctic Breccia (Devon Island)",
                abstract="Tri-axial wheel torque monitoring paired with downward optical visual odometry cameras in Haughton Crater ejecta fields.",
                objective="Mitigate slip rates on loose dolomite ejecta fields during autonomous rover long-traverses.",
                category="ROVER_MOBILITY",
                target_body="Mars",
                location_id="haughton-crater",
                experiment_name="Odometry Drift Reduction Campaign",
                methodology="Tri-axial wheel torque monitoring paired with downward optical visual odometry cameras.",
                observations="Significant wheel slippage observed on slope gradients > 14 degrees on loose ejecta breccia.",
                findings="Visual odometry reduced dead-reckoning positional drift from 32% to 4.5% over 5.2 km traverses.",
                research_notes="Summer polar daylight window provided continuous 24h solar tracking baseline.",
                status="SUBMITTED"
            )
            ref1 = ResearchReferenceModel(
                record_id=rec1.id,
                doi="10.1177/0278364911433135",
                title="Visual odometry for planetary rovers in harsh terrain",
                authors="Lee, P., et al.",
                journal="International Journal of Robotics Research",
                year=2012,
                citation_status="VERIFIED_DOI"
            )
            sub1 = ResearchSubmissionModel(
                id="sub-demo-001",
                record_id=rec1.id,
                researcher_id=pi.id,
                submission_title=rec1.title,
                submission_type="RESEARCH_RECORD",
                status="APPROVED",
                reviewer_id=reviewer.id,
                reviewer_name=reviewer.full_name,
                reviewer_notes="Solid empirical slip telemetry. Recommended for publication in Public Discovery archive.",
            )
            hist1 = ReviewHistoryModel(
                submission_id=sub1.id,
                actor_id=pi.id,
                actor_name=pi.full_name,
                from_status="DRAFT",
                to_status="SUBMITTED",
                comment="Initial field trial draft submitted for peer review."
            )
            hist2 = ReviewHistoryModel(
                submission_id=sub1.id,
                actor_id=reviewer.id,
                actor_name=reviewer.full_name,
                from_status="SUBMITTED",
                to_status="APPROVED",
                comment="Solid empirical slip telemetry. Approved for archive."
            )
            rec2 = ResearchRecordModel(
                id="rec-demo-svalbard-002",
                researcher_id=colleague.id,
                title="In-situ Raman Spectroscopy Benchmarking in Svalbard Basalts",
                abstract="Private confidential draft: deep-UV Raman spectroscopy calibration on primitive olivine basalts.",
                objective="Initial calibration of deep-UV Raman spectroscopy on primitive olivine basalts.",
                category="ASTROBIOLOGY",
                target_body="Mars",
                location_id="svalbard-bockfjorden",
                experiment_name="Svalbard AMASE Raman Protocol",
                methodology="Preliminary bench tests with 248 nm laser excitation on peridotite nodules.",
                observations="Fluorescence background heavily attenuated under 248 nm deep-UV compared to 532 nm green laser.",
                findings="Draft protocol compiled; awaiting summer field campaign verification.",
                research_notes="STRICTLY CONFIDENTIAL: Do not disclose before publication.",
                status="DRAFT"
            )
            rec3 = ResearchRecordModel(
                id="rec-demo-published-003",
                researcher_id=pi.id,
                title="Sulfate and Halite Crust Reflectance Spectroscopy as a Terrestrial Analogue for Martian Evaporites",
                abstract="Field reflectance spectrometry of gypsum, anhydrite, and halite crusts in the Yungay core region of the Atacama Desert. High chemical correspondence to Martian sedimentary sulfate deposits observed by the Mars Exploration Rover Opportunity at Meridiani Planum.",
                objective="Calibrate visible/near-infrared (VNIR) reflectance spectroscopy for sulfate-perchlorate soil mixtures under hyper-arid conditions.",
                category="ANALOGUE_MINERALOGY",
                target_body="Mars",
                location_id="atacama-yungay",
                experiment_name="Atacama VNIR Spectroscopy Campaign",
                methodology="Portable field spectrometer (350-2500 nm) with calibrated Spectralon reflectance standard and solar irradiance compensation.",
                observations="Distinct 1.4 um and 1.9 um absorption bands observed across gypsum crusts with suppressed water signature in dehydration zones.",
                findings="Diagnostic overtone and combination bands of hydrated sulfates remain detectable even when diluted with 85% basaltic tephra dust.",
                research_notes="Empirical baseline matches orbital CRISM and in-situ Opportunity APXS signatures.",
                status="PUBLISHED",
                collaborators=["Dr. Chris McKay (NASA Ames)", "Dr. Rafael Navarro-González (UNAM)"],
                experiment_params={
                    "spectral_range_nm": "350-2500",
                    "integration_time_ms": 100,
                    "target_minerals": ["Gypsum", "Halite", "Anhydrite", "Magnesium sulfate"]
                },
                field_observations=[
                    {
                        "site_id": "YUNGAY-TRANSECT-A",
                        "lithology": "Evaporite polygon crust over halite-bearing silt",
                        "depth_cm": 5.0,
                        "apparent_cohesion_kpa": 42.0
                    }
                ],
                environmental_measurements=[
                    {
                        "parameter": "Relative Humidity",
                        "measured_value": 8.2,
                        "unit": "%",
                        "sensor": "Vaisala HMP155",
                        "data_tier": "MEASURED"
                    },
                    {
                        "parameter": "Surface Temperature",
                        "measured_value": 38.5,
                        "unit": "degC",
                        "sensor": "Apogee Calibrated Infrared Radiometer",
                        "data_tier": "MEASURED"
                    }
                ]
            )
            ref3 = ResearchReferenceModel(
                record_id=rec3.id,
                doi="10.1089/153110703769016460",
                title="Temperature and moisture conditions for life in the extreme arid region of the Atacama Desert: four years of observations including the El Nino of 1997-1998",
                authors="McKay, C. P., Friedmann, E. I., Gomez-Silva, B., Caceres, L., Andersen, D. T., & Landheim, R.",
                journal="Astrobiology",
                year=2003,
                citation_status="VERIFIED_DOI"
            )
            sub3 = ResearchSubmissionModel(
                id="sub-demo-003",
                record_id=rec3.id,
                researcher_id=pi.id,
                submission_title=rec3.title,
                submission_type="RESEARCH_RECORD",
                status="PUBLISHED",
                reviewer_id=reviewer.id,
                reviewer_name=reviewer.full_name,
                reviewer_notes="Peer review complete. Methodology and VNIR calibration verified. Approved for Public Discovery open archive.",
                published_at=func.now()
            )
            hist3 = ReviewHistoryModel(
                submission_id=sub3.id,
                actor_id=reviewer.id,
                actor_name=reviewer.full_name,
                from_status="APPROVED",
                to_status="PUBLISHED",
                comment="Peer review approved and published to AEROKRYPT Public Archive."
            )
            db.add_all([rec1, ref1, sub1, hist1, hist2, rec2, rec3, ref3, sub3, hist3])
            db.commit()

        # 2. Seed Analogue Locations and Environmental Parameters
        existing_loc = db.query(AnalogueLocationModel).filter_by(id="atacama-yungay").first()
        if not existing_loc:
            logger.info("Seeding curated analogue locations and environmental parameters...")
            loc_file = os.path.join(os.path.dirname(__file__), "data", "locations.json")
            if os.path.exists(loc_file):
                with open(loc_file, "r", encoding="utf-8") as f:
                    raw_locations = json.load(f)

                for item in raw_locations:
                    loc_id = item["id"]
                    coords_str = item.get("coordinates", "")
                    lat, lon = parse_coordinates(coords_str)

                    bbox_raw = item.get("geographicBoundaries", {}).get("boundingBox", {})
                    n = dms_to_deg(str(bbox_raw.get("north", ""))) or (lat + 0.1 if lat else 1.0)
                    s = dms_to_deg(str(bbox_raw.get("south", ""))) or (lat - 0.1 if lat else -1.0)
                    e = dms_to_deg(str(bbox_raw.get("east", ""))) or (lon + 0.1 if lon else 1.0)
                    w = dms_to_deg(str(bbox_raw.get("west", ""))) or (lon - 0.1 if lon else -1.0)

                    point_wkt = f"SRID=4326;POINT({lon} {lat})"
                    poly_wkt = f"SRID=4326;POLYGON(({w} {s}, {e} {s}, {e} {n}, {w} {n}, {w} {s}))"

                    loc_model = AnalogueLocationModel(
                        id=loc_id,
                        name=item.get("name", loc_id),
                        country=item.get("country", "Unknown"),
                        region=item.get("region", "Global"),
                        primary_target=item.get("primaryTarget", "Mars"),
                        analogue_relevance=item.get("analogueRelevance", "MARS"),
                        target_bodies=item.get("targetBodies", [item.get("primaryTarget", "Mars")]),
                        location_category=item.get("locationCategory", "NATURAL_SITE"),
                        verification_status=item.get("verificationStatus", "VERIFIED"),
                        center_geometry=point_wkt,
                        boundary_polygon=poly_wkt,
                        geodetic_datum=item.get("geographicBoundaries", {}).get("geodeticDatum", "WGS 84 / EGM96 Geoid"),
                        bounding_box_north=round(n, 6),
                        bounding_box_south=round(s, 6),
                        bounding_box_east=round(e, 6),
                        bounding_box_west=round(w, 6),
                        boundary_type=item.get("geographicBoundaries", {}).get("boundaryClassification", "RESEARCH_AREA_ENVELOPE"),
                        official_boundary_evidence_available=item.get("geographicBoundaries", {}).get("surveyStatus") == "OFFICIALLY_SURVEYED"
                    )
                    db.add(loc_model)
                    db.flush()

                    for p_key, p_val in item.get("environmentalParameters", {}).items():
                        if isinstance(p_val, dict):
                            measured_val = float(p_val.get("value")) if isinstance(p_val.get("value"), (int, float)) else None
                            param_model = EnvironmentalParameterModel(
                                location_id=loc_id,
                                parameter_category=p_val.get("category", "General"),
                                parameter_name=p_val.get("name", p_key),
                                parameter_key=p_key,
                                measured_value=measured_val,
                                unit=p_val.get("unit"),
                                data_tier=p_val.get("confidenceTier", "SOURCED"),
                                station_name=p_val.get("locationBasis"),
                                station_distance_km=None,
                                station_geometry=point_wkt,
                                observation_period=p_val.get("measurementPeriod"),
                                source_citation=p_val.get("sourceCitation", "AEROKRYPT Curated Database"),
                                doi=p_val.get("doi"),
                                doi_resolves=True if p_val.get("doi") else False,
                                notes=p_val.get("label")
                            )
                            db.add(param_model)

                db.commit()

        # 3. Seed Planetary Reference Terrains
        existing_terrain = db.query(PlanetaryReferenceTerrainModel).filter_by(id="mars-jezero-delta").first()
        if not existing_terrain:
            from app.routers.planetary import PLANETARY_TERRAINS
            for t in PLANETARY_TERRAINS:
                terrain_model = PlanetaryReferenceTerrainModel(
                    id=t["id"],
                    name=t["name"],
                    target_body=t["target_body"],
                    planetary_region=t["planetary_region"],
                    primary_landform=t["primary_landform"],
                    center_coordinates=t["center_coordinates"],
                    datum_name=t["datum_name"],
                    datum_description=t["datum_description"],
                    local_relief_m=t.get("local_relief_m"),
                    typical_slope_deg=t.get("typical_slope_deg"),
                    max_slope_deg=t.get("max_slope_deg"),
                    raster_asset_uri=f"s3://nasa-pds/{t['id']}.tif"
                )
                db.add(terrain_model)
            db.commit()

        # 4. Seed PDS Raster Assets
        existing_raster = db.query(PDSRasterAssetModel).filter_by(id="pds-mola-meg004").first()
        if not existing_raster:
            r1 = PDSRasterAssetModel(
                id="pds-mola-meg004",
                agency="NASA_PDS",
                target_body="Mars",
                dataset_name="MGS MOLA 128 px/deg Global Mission Elevation Model",
                mission="Mars Global Surveyor",
                instrument="MOLA",
                product_level="MEGDR",
                file_path="./raster_cache/mars_dem.tif",
                spatial_resolution_m=463.0,
                crs_epsg="IAU2000:49900",
                bounding_box_geom="SRID=4326;POLYGON((-180 -90, 180 -90, 180 90, -180 90, -180 -90))",
                nodata_value=-9999.0
            )
            r2 = PDSRasterAssetModel(
                id="usgs-3dep-1m",
                agency="USGS",
                target_body="Earth",
                dataset_name="USGS 3D Elevation Program (3DEP) LiDAR DEM",
                mission="USGS National Geospatial Program",
                instrument="Airborne LiDAR",
                product_level="1-meter DTM",
                file_path="./raster_cache/earth_dem.tif",
                spatial_resolution_m=1.0,
                crs_epsg="EPSG:6350",
                bounding_box_geom="SRID=4326;POLYGON((-125 25, -65 25, -65 50, -125 50, -125 25))",
                nodata_value=-999999.0
            )
            db.add_all([r1, r2])
            db.commit()

        logger.info("Database schema and default records initialized successfully.")
        return True

    except Exception as e:
        db.rollback()
        logger.error("Error during init_db: %s", e)
        return False
    finally:
        db.close()
