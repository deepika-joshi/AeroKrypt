from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ParameterResponse(BaseModel):
    parameter_key: str
    parameter_name: str
    parameter_category: str
    value: Optional[float] = None
    unit: Optional[str] = None
    data_tier: str
    station_name: Optional[str] = None
    station_distance_km: Optional[float] = None
    source_citation: str
    doi: Optional[str] = None

class BoundingBox(BaseModel):
    north: float
    south: float
    east: float
    west: float
    boundary_type: Optional[str] = None
    official_boundary_evidence_available: bool = False

class AnalogueLocationSummary(BaseModel):
    id: str
    name: str
    country: str
    region: str
    primary_target: str
    analogue_relevance: str
    target_bodies: List[str]
    location_category: str
    verification_status: str
    coordinates: str
    geodetic_datum: str = "WGS 84 / EGM96 Geoid"

class AnalogueLocationDetail(AnalogueLocationSummary):
    bounding_box: Optional[BoundingBox] = None
    parameters: List[ParameterResponse] = []
    lithology: List[str] = []
    geomorphology_primary: Optional[str] = None
    operational_strengths: List[str] = []
    operational_limitations: List[str] = []

class PlanetaryTerrainResponse(BaseModel):
    id: str
    name: str
    target_body: str
    planetary_region: str
    primary_landform: str
    center_coordinates: str
    datum_name: str
    datum_description: str
    local_relief_m: Optional[float] = None
    typical_slope_deg: Optional[float] = None
    max_slope_deg: Optional[float] = None
    source_agency: str = "NASA / ESA"
    integration_tier: str = "MAP_SERVICE"

class SiteEvaluationRequest(BaseModel):
    location_id: str
    target_body: str = Field(..., pattern="^(Mars|Moon)$")
    planetary_terrain_id: str
    experiment_id: Optional[str] = None
    evaluator_name: Optional[str] = "Principal Investigator"

class DualSuitabilityAssessment(BaseModel):
    geological_fidelity: Dict[str, Any]
    operational_suitability: Dict[str, Any]
    missing_critical_parameters: List[str]
    divergence_summary: List[Dict[str, Any]]
    disclaimer: str = "AEROKRYPT STRICT SCIENTIFIC POLICY: Multi-parameter evaluation strictly separates geological fidelity from operational safety. No arbitrary composite suitability percentages are synthesized."

class IngestionTaskRequest(BaseModel):
    agency: str = Field(..., pattern="^(NASA_PDS|USGS_3DEP|ESA|COPERNICUS)$")
    dataset_id: str
    target_body: str
    product_url: Optional[str] = None
    bounding_box: Optional[BoundingBox] = None

class IngestionTaskResponse(BaseModel):
    task_id: str
    agency: str
    status: str
    message: str
    ingested_at: datetime

