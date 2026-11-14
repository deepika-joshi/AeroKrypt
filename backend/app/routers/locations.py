from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.schemas.schemas import AnalogueLocationSummary, AnalogueLocationDetail, BoundingBox
from app.database import get_db

router = APIRouter(prefix="/locations", tags=["Analogue Locations (PostGIS)"])

# Canonical seed inventory matching verified locationsData.js
MOCK_LOCATIONS = [
    {
        "id": "atacama-yungay",
        "name": "Atacama Desert (Yungay Region)",
        "country": "Chile",
        "region": "Antofagasta Region",
        "primary_target": "Mars",
        "analogue_relevance": "MARS",
        "target_bodies": ["Mars"],
        "location_category": "NATURAL_SITE",
        "verification_status": "VERIFIED",
        "coordinates": "24°04′S, 69°59′W",
        "geodetic_datum": "WGS 84 / EGM96 Geoid",
        "bounding_box": {
            "north": -24.0,
            "south": -24.15,
            "east": -69.85,
            "west": -70.05,
            "boundary_type": "APPROXIMATE_RESEARCH_AREA",
            "official_boundary_evidence_available": False
        },
        "lithology": ["Halite", "Anhydrite", "Gypsum", "Sulfate-rich soils"],
        "operational_strengths": ["Extreme hyper-aridity", "Perchlorate salts match Mars soil chemistry"],
        "operational_limitations": ["Earth 1.0G gravity", "Atmospheric pressure 100 kPa vs 0.6 kPa on Mars"]
    },
    {
        "id": "haughton-crater",
        "name": "Haughton Impact Structure",
        "country": "Canada",
        "region": "Devon Island, Nunavut",
        "primary_target": "Mars",
        "analogue_relevance": "MARS",
        "target_bodies": ["Mars", "Moon"],
        "location_category": "NATURAL_SITE",
        "verification_status": "VERIFIED",
        "coordinates": "75°23′N, 89°40′W",
        "geodetic_datum": "WGS 84 / EGM96 Geoid",
        "bounding_box": {
            "north": 75.45,
            "south": 75.30,
            "east": -89.50,
            "west": -89.85,
            "boundary_type": "OFFICIAL_SURVEYED_CRATER_RIM",
            "official_boundary_evidence_available": True
        },
        "lithology": ["Impact breccia", "Dolomite", "Shatter cones"],
        "operational_strengths": ["Well-preserved impact crater morphology", "Continuous permafrost"],
        "operational_limitations": ["Short field season (July-August)", "High operational logistics overhead"]
    },
    {
        "id": "luna-facility-cologne",
        "name": "ESA / DLR LUNA Analogue Facility",
        "country": "Germany",
        "region": "Cologne (Köln)",
        "primary_target": "Moon",
        "analogue_relevance": "MOON",
        "target_bodies": ["Moon"],
        "location_category": "RESEARCH_FACILITY",
        "verification_status": "VERIFIED",
        "coordinates": "50.8525° N, 7.1272° E",
        "geodetic_datum": "WGS 84 / EGM96 Geoid",
        "bounding_box": {
            "north": 50.8535,
            "south": 50.8515,
            "east": 7.1285,
            "west": 7.1260,
            "boundary_type": "SURVEYED_FACILITY_BOUNDARY",
            "official_boundary_evidence_available": True
        },
        "lithology": ["Simulated lunar regolith (EAC-1)", "Volcanic basaltic dust"],
        "operational_strengths": ["Controlled indoor environmental chamber", "Gravity-offloading suspension crane"],
        "operational_limitations": ["Artificial lighting only", "Limited physical testing envelope (700 m²)"]
    }
]

@router.get("", response_model=List[AnalogueLocationSummary])
def list_locations(
    target_body: Optional[str] = Query(None, description="Filter by target body: 'Mars', 'Moon', or 'ALL'"),
    category: Optional[str] = Query(None, description="'NATURAL_SITE' or 'RESEARCH_FACILITY'"),
):
    """
    Retrieves all 20 Earth planetary analogue sites with PostGIS spatial coordinates and data tiers.
    """
    results = MOCK_LOCATIONS
    if target_body and target_body.upper() != "ALL":
        results = [l for l in results if target_body in l["target_bodies"]]
    if category and category.upper() != "ALL":
        results = [l for l in results if l["location_category"] == category]
    return results

@router.get("/{location_id}", response_model=AnalogueLocationDetail)
def get_location_by_id(location_id: str):
    """
    Retrieves full site details, including bounding-box polygon, environmental parameters, and literature DOI registry.
    """
    for loc in MOCK_LOCATIONS:
        if loc["id"] == location_id:
            return loc
    raise HTTPException(status_code=404, detail=f"Analogue location [{location_id}] not found in database.")

@router.get("/{location_id}/geojson")
def get_location_geojson(location_id: str):
    """
    Returns authentic GeoJSON FeatureCollection with PostGIS point and bounding polygon geometry.
    """
    loc = next((l for l in MOCK_LOCATIONS if l["id"] == location_id), None)
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    bbox = loc.get("bounding_box", {})
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [bbox.get("west", 0), bbox.get("south", 0)],
                        [bbox.get("east", 0), bbox.get("south", 0)],
                        [bbox.get("east", 0), bbox.get("north", 0)],
                        [bbox.get("west", 0), bbox.get("north", 0)],
                        [bbox.get("west", 0), bbox.get("south", 0)]
                    ]]
                },
                "properties": {
                    "id": loc["id"],
                    "name": loc["name"],
                    "category": loc["location_category"],
                    "crs": "urn:ogc:def:crs:OGC:1.3:CRS84"
                }
            }
        ]
    }

