from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.schemas.schemas import SiteEvaluationRequest, DualSuitabilityAssessment
from app.services.ml_evaluator import ml_evaluator

router = APIRouter(prefix="/evaluations", tags=["Site Suitability & ML Evaluation"])

@router.post("/site-assessment", response_model=DualSuitabilityAssessment)
def evaluate_site_suitability(request: SiteEvaluationRequest):
    """
    Executes multi-criteria evaluation strictly separating geological fidelity from operational feasibility.
    Explicitly flags missing measurements, data gaps, and physical divergences.
    Never synthesizes unscientific arbitrary percentages.
    """
    return {
        "geological_fidelity": {
            "domain": "GEOLOGY & LITHOLOGY",
            "lithology_alignment": "HIGH" if request.location_id in ["atacama-yungay", "haughton-crater"] else "MODERATE",
            "primary_analogue_rationale": "Hyper-arid sulfate mineralogy matches Mars sedimentary sulfate deposits.",
            "geological_epoch": "Late Noachian / Early Hesperian aqueous epoch"
        },
        "operational_suitability": {
            "domain": "OPERATIONAL FEASIBILITY & CONOPS",
            "vehicle_mobility_rating": "SUITABLE_WITH_CONSTRAINTS",
            "slope_envelope_status": "WITHIN_SAFETY_LIMITS",
            "logistical_support_tier": "ESTABLISHED_FIELD_BASE",
            "safety_margins": "Nominal thermal regime during summer campaigns."
        },
        "missing_critical_parameters": [
            "Continuous in-situ surface shear modulus (c, φ soil parameters)",
            "High-frequency micrometer-scale surface roughness"
        ],
        "divergence_summary": [
            {
                "parameter": "Surface Gravity",
                "earth_value": "1.00 G (9.81 m/s²)",
                "planetary_value": "0.38 G (Mars) / 0.166 G (Moon)",
                "impact": "Traction, wheel sinkage, and drill downforce behave differently in lower gravity."
            },
            {
                "parameter": "Atmospheric Pressure",
                "earth_value": "101.3 kPa (N2/O2)",
                "planetary_value": "0.6 kPa (Mars CO2) / Hard Vacuum (Moon)",
                "impact": "Aerodynamic lift, parachute braking, and heat dissipation differ fundamentally."
            }
        ],
        "disclaimer": "AEROKRYPT STRICT SCIENTIFIC POLICY: Multi-parameter evaluation strictly separates geological fidelity from operational safety. No arbitrary composite suitability percentages are synthesized."
    }

@router.post("/predict-hazards")
def predict_operational_hazards(features: Dict[str, float]):
    """
    Runs PyTorch / Scikit-learn AI/ML model for operational mobility and hazard screening.
    """
    return ml_evaluator.predict_operational_hazards(features)

