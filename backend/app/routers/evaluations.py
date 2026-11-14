"""
AEROKRYPT - Multi-Parameter Site Suitability & AI/ML Evaluation Router
Executes dual-domain assessment strictly separating geological analogue fidelity
from operational testing feasibility across Mars and Moon targets.
Strictly disclaims arbitrary composite percentage scores and identifies physical divergences.
"""

import os
import json
import uuid
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from app.schemas.schemas import SiteEvaluationRequest, DualSuitabilityAssessment
from app.services.ml_evaluator import ml_evaluator
from app.routers.planetary import PLANETARY_TERRAINS
from app.database import get_db
from app.models.spatial_models import SiteEvaluationModel

logger = logging.getLogger("aerokrypt.routers.evaluations")
router = APIRouter(prefix="/evaluations", tags=["Site Suitability & ML Evaluation"])

# Load locations map from curated dataset
LOCATIONS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "locations.json")
LOCATIONS_MAP: Dict[str, Dict[str, Any]] = {}

try:
    if os.path.exists(LOCATIONS_PATH):
        with open(LOCATIONS_PATH, "r", encoding="utf-8") as f:
            for item in json.load(f):
                LOCATIONS_MAP[item["id"]] = item
except Exception as err:
    print(f"Warning: Could not load locations in evaluations router: {err}")


@router.post("/site-assessment", response_model=DualSuitabilityAssessment)
def evaluate_site_suitability(request: SiteEvaluationRequest, db: Optional[Session] = Depends(get_db)):
    """
    Executes multi-criteria evaluation strictly separating geological fidelity from operational feasibility.
    Explicitly flags missing measurements, data gaps, and physical divergences.
    Never synthesizes unscientific arbitrary percentages.
    Persists evaluation dossier to database when available.
    """
    loc = LOCATIONS_MAP.get(request.location_id)
    target_body = request.target_body.capitalize() if request.target_body else "Mars"

    # 1. Geological Fidelity Assessment
    lithology_list = loc.get("lithology", []) if loc else ["Impact breccia", "Basalt"]
    terrain_type = loc.get("terrainType", "Terrestrial Analogue Terrain") if loc else "Arid Basin"
    location_name = loc.get("name", request.location_id) if loc else request.location_id

    # Check mineralogical alignment with target body
    is_mars = target_body == "Mars"
    is_moon = target_body == "Moon"

    if is_moon:
        has_anorthosite = any("anorthosite" in l.lower() for l in lithology_list)
        has_basalt = any("basalt" in l.lower() or "pyroduct" in l.lower() or "lava" in l.lower() for l in lithology_list)
        if has_anorthosite:
            lithology_alignment = "HIGH"
            rationale = f"Anorthositic plagioclase suite at {location_name} replicates Lunar Ferroan Anorthosite (FAN) primordial crust."
            epoch = "Pre-Nectarian / Nectarian Magma Ocean Crystallization"
        elif has_basalt:
            lithology_alignment = "HIGH"
            rationale = f"Tholeiitic and alkali basalt flows at {location_name} match Lunar Mare flood basalt sheet flows and pyroduct tubes."
            epoch = "Late Imbrian / Eratosthenian Mare Volcanism"
        elif loc and loc.get("locationCategory") == "RESEARCH_FACILITY":
            lithology_alignment = "HIGH_SIMULATION"
            rationale = f"Indoor regolith testbed at {location_name} simulates Lunar surface dust and gravity-offloading ConOps."
            epoch = "Simulated Artemis ConOps Envelope"
        else:
            lithology_alignment = "MODERATE"
            rationale = f"Geomorphological analogue for Lunar impact degradation or regolith mechanics; secondary mineralogical disparities exist."
            epoch = "Copernican Impact Degradation"
    else:  # Mars
        has_sulfate = any("sulfate" in l.lower() or "gypsum" in l.lower() or "jarosite" in l.lower() or "perchlorate" in l.lower() or "halite" in l.lower() for l in lithology_list)
        has_permafrost = any("permafrost" in l.lower() or "ice" in l.lower() or "breccia" in l.lower() for l in lithology_list)
        if has_sulfate:
            lithology_alignment = "HIGH"
            rationale = f"Evaporite sulfate and perchlorate minerals at {location_name} match Martian sedimentary sulfate beds."
            epoch = "Late Noachian / Early Hesperian Aqueous Evaporite Epoch"
        elif has_permafrost:
            lithology_alignment = "HIGH"
            rationale = f"Active layer permafrost and cryogenic matrix at {location_name} replicate high-latitude Martian cryosphere."
            epoch = "Amazonian Cryospheric / Glacial Regime"
        elif loc and loc.get("locationCategory") == "RESEARCH_FACILITY":
            lithology_alignment = "HIGH_SIMULATION"
            rationale = f"Controlled facility chamber at {location_name} validates rover hardware under simulated Martian soil profiles."
            epoch = "Simulated Robotic Surface Operation"
        else:
            lithology_alignment = "MODERATE"
            rationale = f"Structural geomorphic analogue at {location_name}; exact mineralogical and weathering kinetics differ from Mars."
            epoch = "Middle Hesperian Volcanic / Impact Epoch"

    # 2. Operational Feasibility Assessment
    slope_info = loc.get("slope", {}) if loc else {}
    typical_slope = slope_info.get("typicalDeg", 4.0) if isinstance(slope_info, dict) else 4.0

    if typical_slope < 8.0:
        mobility_rating = "SUITABLE_UNCONSTRAINED"
        slope_envelope = "WITHIN_NOMINAL_SAFETY_LIMITS"
    elif typical_slope < 18.0:
        mobility_rating = "SUITABLE_WITH_CONSTRAINTS"
        slope_envelope = "MODERATE_TRACTION_MANAGEMENT_REQUIRED"
    else:
        mobility_rating = "CHALLENGING_HIGH_SLOPE"
        slope_envelope = "ELEVATED_ROLLOVER_RISK_CORRIDORS"

    is_facility = loc.get("locationCategory") == "RESEARCH_FACILITY" if loc else False
    logistics = "CONTROLLED_INDOOR_FACILITY" if is_facility else ("ESTABLISHED_FIELD_STATION" if typical_slope < 15.0 else "REMOTE_EXPEDITIONARY_BASE")

    # 3. Missing Critical Parameters
    missing_params = [
        "Continuous in-situ surface shear modulus (c, φ soil mechanics parameters)",
        "Sub-meter boulder frequency distribution and obstacle spatial density"
    ]
    if not is_facility:
        missing_params.append("Direct surface solar UV spectral irradiance monitoring")

    # 4. Planetary Physical Divergences
    divergences = [
        {
            "parameter": "Surface Gravity",
            "earth_value": "1.00 G (9.81 m/s²)",
            "planetary_value": "0.38 G (3.72 m/s²)" if is_mars else "0.166 G (1.62 m/s²)",
            "impact": "Traction, wheel slip ratio, soil bearing capacity, and drill penetration dynamics behave fundamentally differently under reduced gravitational acceleration."
        },
        {
            "parameter": "Atmospheric Pressure & Composition",
            "earth_value": "101.3 kPa (78% N2, 21% O2)",
            "planetary_value": "0.6 kPa (95% CO2, ~610 Pa)" if is_mars else "Hard Vacuum (~10⁻¹⁰ Pa)",
            "impact": "Aerodynamic drag, convective thermal cooling, volatile sublimation rates, and motor heat dissipation are radically altered."
        },
        {
            "parameter": "Thermal Diurnal Envelope",
            "earth_value": "Moderate terrestrial diurnal variation (-15°C to +35°C)",
            "planetary_value": "-125°C to +20°C (Mars surface)" if is_mars else "-180°C to +120°C (Lunar surface)",
            "impact": "Cryogenic thermal cycling causes rapid material embrittlement, lubricant solid-phase transition, and electronics freeze."
        },
        {
            "parameter": "Galactic Cosmic Radiation & Solar Protons",
            "earth_value": "Attenuated by geomagnetic field and 10,000 kg/m² air column",
            "planetary_value": "Unshielded surface dose (230-260 µGy/day Mars; 300-400 µGy/day Moon)",
            "impact": "Electronics Single Event Upsets (SEU), organic biosignature radiolysis, and cumulative crew ionizing radiation dose."
        }
    ]

    eval_id = f"eval-{uuid.uuid4().hex[:12]}"
    created_ts = datetime.now(timezone.utc).isoformat()

    assessment_result = {
        "evaluation_id": eval_id,
        "project_id": request.project_id,
        "evaluation_version": "AEROKRYPT_SITE_EVAL_V2",
        "created_at": created_ts,
        "geological_fidelity": {
            "domain": "GEOLOGY & LITHOLOGY",
            "target_body": target_body,
            "lithology_alignment": lithology_alignment,
            "primary_analogue_rationale": rationale,
            "geological_epoch": epoch,
            "representative_lithology": lithology_list[:5]
        },
        "operational_suitability": {
            "domain": "OPERATIONAL FEASIBILITY & CONOPS",
            "target_body": target_body,
            "vehicle_mobility_rating": mobility_rating,
            "slope_envelope_status": slope_envelope,
            "logistical_support_tier": logistics,
            "safety_margins": "Nominal thermal and physical boundaries during scheduled operational windows."
        },
        "missing_critical_parameters": missing_params,
        "divergence_summary": divergences,
        "disclaimer": "AEROKRYPT STRICT SCIENTIFIC POLICY: Multi-parameter evaluation strictly separates geological fidelity from operational safety. No arbitrary composite suitability percentages are synthesized."
    }

    # Persist to database if active session exists
    if db is not None:
        try:
            eval_record = SiteEvaluationModel(
                id=eval_id,
                project_id=request.project_id,
                location_id=request.location_id,
                target_body=target_body,
                planetary_terrain_id=request.planetary_terrain_id or "mars-jezero-delta",
                experiment_id=request.experiment_id,
                evaluator_name=request.evaluator_name or "Principal Investigator",
                geological_fidelity_rating=lithology_alignment,
                operational_feasibility_rating=mobility_rating,
                composite_similarity=None,
                evaluation_version="AEROKRYPT_SITE_EVAL_V2",
                source_data_provenance={
                    "geodetic_datum": loc.get("geographicBoundaries", {}).get("geodeticDatum", "WGS 84") if loc else "WGS 84",
                    "planetary_datum": "IAU2000 MOLA Areoid" if is_mars else "IAU2000 LOLA Lunar Sphere",
                    "evaluation_engine": "FastAPI Dual-Domain Evaluator v2"
                },
                evaluation_json=assessment_result
            )
            db.add(eval_record)

            # If associated with a research project, record in project's saved evaluations
            if request.project_id:
                from app.models.research_models import ResearchRecordModel
                project = db.query(ResearchRecordModel).filter(ResearchRecordModel.id == request.project_id).first()
                if project:
                    existing_list = list(project.saved_evaluations_json or [])
                    existing_list.append({
                        "id": eval_id,
                        "location_id": request.location_id,
                        "location_name": location_name,
                        "target_body": target_body,
                        "planetary_terrain_id": request.planetary_terrain_id,
                        "geological_fidelity_rating": lithology_alignment,
                        "operational_feasibility_rating": mobility_rating,
                        "created_at": created_ts,
                        "evaluation_json": assessment_result
                    })
                    project.saved_evaluations_json = existing_list

            db.commit()
        except Exception as e:
            db.rollback()
            logger.warning("Could not persist site evaluation to database: %s", e)

    return assessment_result


@router.get("/{evaluation_id}", response_model=Dict[str, Any])
def get_saved_evaluation(evaluation_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Reopens a previously saved site evaluation dossier by ID.
    Preserves exact parameter comparisons, evidence, and uncertainty metadata.
    """
    if db is not None:
        try:
            eval_record = db.query(SiteEvaluationModel).filter(SiteEvaluationModel.id == evaluation_id).first()
            if eval_record and eval_record.evaluation_json:
                data = dict(eval_record.evaluation_json)
                data["id"] = eval_record.id
                data["evaluation_id"] = eval_record.id
                data["project_id"] = eval_record.project_id
                data["evaluation_version"] = eval_record.evaluation_version
                data["created_at"] = eval_record.created_at.isoformat() if eval_record.created_at else None
                return data
        except Exception as e:
            logger.warning("Database query failed in get_saved_evaluation: %s", e)

    raise HTTPException(status_code=404, detail=f"Site evaluation '{evaluation_id}' not found.")


@router.get("/project/{project_id}", response_model=List[Dict[str, Any]])
def get_project_evaluations(project_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Retrieves all saved site evaluations associated with a research project.
    """
    if db is not None:
        try:
            evals = db.query(SiteEvaluationModel).filter(SiteEvaluationModel.project_id == project_id).all()
            if evals:
                results = []
                for ev in evals:
                    item = dict(ev.evaluation_json) if ev.evaluation_json else {}
                    item["id"] = ev.id
                    item["evaluation_id"] = ev.id
                    item["project_id"] = ev.project_id
                    item["location_id"] = ev.location_id
                    item["target_body"] = ev.target_body
                    item["planetary_terrain_id"] = ev.planetary_terrain_id
                    item["evaluation_version"] = ev.evaluation_version
                    item["created_at"] = ev.created_at.isoformat() if ev.created_at else None
                    results.append(item)
                return results

            # Fallback to project.saved_evaluations_json if available
            from app.models.research_models import ResearchRecordModel
            proj = db.query(ResearchRecordModel).filter(ResearchRecordModel.id == project_id).first()
            if proj and proj.saved_evaluations_json:
                return proj.saved_evaluations_json
        except Exception as e:
            logger.warning("Database query failed in get_project_evaluations: %s", e)

    return []


@router.post("/compare", response_model=Dict[str, Any])
def compare_saved_evaluations(payload: Dict[str, Any], db: Optional[Session] = Depends(get_db)):
    """
    Compares multiple saved site evaluations belonging to a research project.
    """
    evaluation_ids = payload.get("evaluation_ids", [])
    if not evaluation_ids or not isinstance(evaluation_ids, list):
        raise HTTPException(status_code=400, detail="Missing or invalid 'evaluation_ids' list.")

    evaluations = []
    if db is not None:
        try:
            for eid in evaluation_ids:
                record = db.query(SiteEvaluationModel).filter(SiteEvaluationModel.id == eid).first()
                if record and record.evaluation_json:
                    item = dict(record.evaluation_json)
                    item["id"] = record.id
                    item["evaluation_id"] = record.id
                    item["location_id"] = record.location_id
                    item["target_body"] = record.target_body
                    item["planetary_terrain_id"] = record.planetary_terrain_id
                    evaluations.append(item)
        except Exception as e:
            logger.warning("Database error during evaluation comparison: %s", e)

    if not evaluations:
        raise HTTPException(status_code=404, detail="No matching evaluations found for comparison.")

    return {
        "count": len(evaluations),
        "evaluation_ids": evaluation_ids,
        "evaluations": evaluations,
        "comparison_matrix": {
            "locations": [e.get("location_id") for e in evaluations],
            "targets": [e.get("geological_fidelity", {}).get("target_body") for e in evaluations],
            "fidelity_ratings": [e.get("geological_fidelity", {}).get("lithology_alignment") for e in evaluations],
            "mobility_ratings": [e.get("operational_suitability", {}).get("vehicle_mobility_rating") for e in evaluations]
        }
    }


@router.post("/predict-hazards")
def predict_operational_hazards(features: Dict[str, Any]):
    """
    Runs PyTorch / Scikit-learn AI/ML model for operational mobility and hazard screening.
    """
    return ml_evaluator.predict_operational_hazards(features)
